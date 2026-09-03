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

  updateNode(id, patch, meta = {}) {
    const before = this.getNode(id);
    if (!before) throw new Error(`Unknown node: ${id}`);
    const after = { ...before, ...patch };
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

  // --- Change / Affected Nodes (см. 54_Changes.md §19-20) --------------

  _recordChange({ objectType, objectId, before, after, reason = null, source = "User", changedBy = null }) {
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
      status: "Applied",
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
