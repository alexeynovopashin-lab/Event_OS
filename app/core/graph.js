// core/graph.js
// Минимальная реализация Project Graph (см. 11_Graph_Model.md).
// Никакой роли, никакого UI — только узлы, рёбра и события изменения.

const STORAGE_PREFIX = "eventos:project:";

export class Graph {
  constructor(projectId) {
    this.projectId = projectId;
    this.nodes = new Map();   // id -> node
    this.edges = [];          // { type, from, to, props }
    this.changes = [];        // история Change (54_Changes.md)
    this._load();
  }

  // --- Nodes ---------------------------------------------------------

  addNode(node) {
    if (!node.id) throw new Error("Node requires id");
    this.nodes.set(node.id, { ...node });
    this._save();
    return this.nodes.get(node.id);
  }

  getNode(id) {
    return this.nodes.get(id) ?? null;
  }

  // meta.consentFrom marks a write made by someone other than the data's
  // owner (BRIDGE_LIGHT_PLAN.md §3/§9): the node is not mutated yet, the
  // proposed state waits in the Change as "Pending" until that person calls
  // confirmChange().
  updateNode(id, patch, meta = {}) {
    const before = this.getNode(id);
    if (!before) throw new Error(`Unknown node: ${id}`);
    const after = { ...before, ...patch };

    if (meta.consentFrom) {
      const change = this._recordChange({
        objectType: before.type,
        objectId: id,
        before,
        after,
        status: "Pending",
        ...meta,
      });
      this._save();
      return { node: before, change };
    }

    this.nodes.set(id, after);
    const change = this._recordChange({
      objectType: before.type,
      objectId: id,
      before,
      after,
      ...meta,
    });

    this._save();
    return { node: after, change };
  }

  // Propose a brand-new node (e.g. a booking organizer adds to someone
  // else's calendar): it does not exist in the graph — invisible to
  // nodesByType(), edgesFrom/To() — until confirmChange() applies it.
  // Always requires meta.consentFrom; there is no owner to skip consent for.
  proposeNode(node, edges = [], meta = {}) {
    if (!node.id) throw new Error("Node requires id");
    if (this.nodes.has(node.id)) throw new Error(`Node already exists: ${node.id}`);
    if (!meta.consentFrom) throw new Error("proposeNode requires meta.consentFrom");

    const change = this._recordChange({
      objectType: node.type,
      objectId: node.id,
      before: null,
      after: node,
      pendingEdges: edges,
      status: "Pending",
      ...meta,
    });
    this._save();
    return change;
  }

  // --- Responding to a pending Change (BRIDGE_LIGHT_PLAN.md §3/§9) -----

  confirmChange(changeId, userId) {
    const change = this._requirePending(changeId, userId);
    this.nodes.set(change.objectId, change.after);
    if (change.before === null) {
      for (const e of change.pendingEdges ?? []) this.addEdge(e.type, e.from, e.to, e.props);
    }
    change.status = "Applied";
    change.confirmedBy = userId;
    change.confirmedAt = new Date().toISOString();
    this._save();
    return change;
  }

  declineChange(changeId, userId) {
    const change = this._requirePending(changeId, userId);
    change.status = "Declined";
    change.confirmedBy = userId;
    change.confirmedAt = new Date().toISOString();
    this._save();
    return change;
  }

  _requirePending(changeId, userId) {
    const change = this.changes.find((c) => c.id === changeId);
    if (!change) throw new Error(`Unknown change: ${changeId}`);
    if (change.status !== "Pending") throw new Error(`Change is not pending: ${change.status}`);
    if (change.consentFrom && change.consentFrom !== userId) {
      throw new Error("Only the addressee can respond to this change");
    }
    return change;
  }

  nodesByType(type) {
    return [...this.nodes.values()].filter((n) => n.type === type);
  }

  // --- Edges -----------------------------------------------------------

  addEdge(type, from, to, props = {}) {
    const edge = { type, from, to, props };
    this.edges.push(edge);
    this._save();
    return edge;
  }

  edgesFrom(id, type = null) {
    return this.edges.filter((e) => e.from === id && (!type || e.type === type));
  }

  edgesTo(id, type = null) {
    return this.edges.filter((e) => e.to === id && (!type || e.type === type));
  }

  // Кто зависит от этого узла по DEPENDS_ON, на любую глубину
  // (BRIDGE_LIGHT_PLAN.md §2/§4): ассистент фотографа, ассистент ассистента
  // и так далее — рекурсия, не список с фиксированным числом уровней.
  // DEPENDS_ON сам по себе не даёт доступа никому, кроме того, от кого
  // зависят — это провенанс, не право видимости (см. §4).
  dependentsOf(id) {
    const seen = new Set();
    const walk = (current) => {
      for (const e of this.edgesTo(current, "DEPENDS_ON")) {
        if (!seen.has(e.from)) {
          seen.add(e.from);
          walk(e.from);
        }
      }
    };
    walk(id);
    return [...seen];
  }

  // --- Event Root (11_Graph_Model.md: «каждый граф имеет один корневой
  // объект; все остальные вершины должны иметь путь к нему; если объект
  // невозможно связать с Event, он не принадлежит системе») -------------

  // Обход без учёта направления рёбер — то же определение связности, что
  // уже использует _affectedNodes().
  reachableFromEvent() {
    const event = this.nodesByType("Event")[0];
    if (!event) return new Set();
    const seen = new Set([event.id]);
    let frontier = [event.id];
    while (frontier.length > 0) {
      const next = [];
      for (const id of frontier) {
        for (const e of [...this.edgesFrom(id), ...this.edgesTo(id)]) {
          const other = e.from === id ? e.to : e.from;
          if (!seen.has(other)) {
            seen.add(other);
            next.push(other);
          }
        }
      }
      frontier = next;
    }
    return seen;
  }

  // Узлы без пути к Event — по правилу документа они не принадлежат системе.
  orphanNodes() {
    const reachable = this.reachableFromEvent();
    return [...this.nodes.values()].filter((n) => n.type !== "Event" && !reachable.has(n.id));
  }

  // --- Change / Affected Nodes (см. 54_Changes.md §19-20) --------------

  _recordChange({
    objectType,
    objectId,
    before,
    after,
    reason = null,
    source = "User",
    changedBy = null,
    status = "Applied",
    consentFrom = null,
    pendingEdges = null,
  }) {
    const change = {
      id: `chg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      projectId: this.projectId,
      objectType,
      objectId,
      before,
      after,
      reason,
      source,
      changedBy,
      createdAt: new Date().toISOString(),
      status,
      consentFrom,
      pendingEdges,
      affectedNodes: this._affectedNodes(objectId),
    };
    this.changes.unshift(change);
    return change;
  }

  // Обход графа по рёбрам ASSIGNED_TO / LOCATED_AT / PRECEDES / FOLLOWS
  _affectedNodes(nodeId, depth = 1) {
    const seen = new Set([nodeId]);
    let frontier = [nodeId];
    for (let i = 0; i < depth; i++) {
      const next = [];
      for (const id of frontier) {
        const related = [
          ...this.edgesFrom(id),
          ...this.edgesTo(id),
        ];
        for (const e of related) {
          const other = e.from === id ? e.to : e.from;
          if (!seen.has(other)) {
            seen.add(other);
            next.push(other);
          }
        }
      }
      frontier = next;
    }
    seen.delete(nodeId);
    return [...seen];
  }

  // Affected Roles: кто ASSIGNED_TO / RESPONSIBLE_FOR затронутые узлы
  affectedRoles(change) {
    const roles = new Set();
    for (const nodeId of [change.objectId, ...change.affectedNodes]) {
      for (const e of [...this.edgesTo(nodeId, "ASSIGNED_TO"), ...this.edgesTo(nodeId, "RESPONSIBLE_FOR")]) {
        const person = this.getNode(e.from);
        if (person?.role) roles.add(person.role);
      }
    }
    return [...roles];
  }

  // --- Persistence (localStorage; заменяется реальным backend позже) ---

  _save() {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(
      STORAGE_PREFIX + this.projectId,
      JSON.stringify({
        nodes: [...this.nodes.values()],
        edges: this.edges,
        changes: this.changes,
      })
    );
  }

  _load() {
    if (typeof localStorage === "undefined") return;
    const raw = localStorage.getItem(STORAGE_PREFIX + this.projectId);
    if (!raw) return;
    const data = JSON.parse(raw);
    this.nodes = new Map(data.nodes.map((n) => [n.id, n]));
    this.edges = data.edges ?? [];
    this.changes = data.changes ?? [];
  }
}
