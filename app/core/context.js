// core/context.js
// Минимальная реализация Context Engine (см. 12_Context_Engine.md) и
// Navigator (см. 14_Navigator.md) поверх Graph.
//
// Rescue Room: Где я? Что происходит? Что изменилось? Что делать дальше?

export function computeContext(graph, { role, userId, now = new Date() }) {
  const scenes = graph
    .nodesByType("Scene")
    .filter((s) => isRelevantToRole(graph, s, role, userId))
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  const current = scenes.find(
    (s) => new Date(s.startsAt) <= now && now <= new Date(s.endsAt)
  );
  const next = scenes.find((s) => new Date(s.startsAt) > now);
  const past = scenes.filter((s) => new Date(s.endsAt) < now);

  const recentChanges = graph.changes
    .filter((c) => graph.affectedRoles(c).includes(role) || c.objectId === current?.id || c.objectId === next?.id)
    .filter((c) => !c.acknowledgedBy?.includes(userId))
    .slice(0, 5);

  return {
    role,
    where: current ?? null,
    whatsNext: next ?? null,
    changed: recentChanges,
    completed: past.length,
    total: scenes.length,
  };
}

function isRelevantToRole(graph, scene, role, userId) {
  const assigned = [
    ...graph.edgesTo(scene.id, "ASSIGNED_TO"),
    ...graph.edgesTo(scene.id, "PARTICIPATES_IN"),
  ].map((e) => graph.getNode(e.from));

  if (role === "organizer") return true; // организатор видит весь Timeline
  return assigned.some((p) => p?.role === role || p?.id === userId);
}

export function acknowledge(graph, changeId, userId) {
  const change = graph.changes.find((c) => c.id === changeId);
  if (!change) return;
  change.acknowledgedBy = change.acknowledgedBy ?? [];
  if (!change.acknowledgedBy.includes(userId)) {
    change.acknowledgedBy.push(userId);
  }
  graph._save();
}
