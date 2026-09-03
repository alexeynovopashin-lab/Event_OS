// core/seed.js
// Демонстрационные данные одного проекта — свадьба Smith.
// Используются всеми ролевыми PWA, чтобы показать, что они читают
// один и тот же Project Graph.

import { Graph } from "./graph.js";

export function seedDemoProject() {
  const graph = new Graph("demo-smith-wedding");
  if (graph.nodes.size > 0) return graph; // уже засеяно ранее

  graph.addNode({ id: "person-photographer", type: "Person", name: "Алекс", role: "photographer" });
  graph.addNode({ id: "person-driver", type: "Person", name: "Игорь", role: "driver" });
  graph.addNode({ id: "person-client", type: "Person", name: "Иван и Анна", role: "client" });
  graph.addNode({ id: "person-organizer", type: "Person", name: "Организатор", role: "organizer" });

  // Граф приглашений произвольной глубины (BRIDGE_LIGHT_PLAN.md §2/§4):
  // фотограф пригласил ассистента отдельным инвайтом, ассистент — своего.
  // Организатор об этой ветке не знает и не обязан знать — ни у одного из
  // них нет ребра к person-organizer, только DEPENDS_ON вверх по цепочке.
  graph.addNode({ id: "person-assistant", type: "Person", name: "Марина", role: "assistant" });
  graph.addNode({ id: "person-second-assistant", type: "Person", name: "Дима", role: "assistant" });
  graph.addEdge("DEPENDS_ON", "person-assistant", "person-photographer");
  graph.addEdge("DEPENDS_ON", "person-second-assistant", "person-assistant");

  graph.addNode({
    id: "scene-ceremony",
    type: "Scene",
    title: "Церемония",
    location: "ЗАГС «Дворец»",
    startsAt: shiftNow(-30, "minutes"),
    endsAt: shiftNow(10, "minutes"),
  });

  graph.addNode({
    id: "scene-photosession",
    type: "Scene",
    title: "Фотосессия",
    location: "Парк",
    startsAt: shiftNow(30, "minutes"),
    endsAt: shiftNow(120, "minutes"),
  });

  graph.addNode({
    id: "scene-reception",
    type: "Scene",
    title: "Банкет",
    location: "Ресторан «Терраса»",
    startsAt: shiftNow(180, "minutes"),
    endsAt: shiftNow(360, "minutes"),
  });

  graph.addEdge("ASSIGNED_TO", "person-photographer", "scene-ceremony");
  graph.addEdge("ASSIGNED_TO", "person-photographer", "scene-photosession");
  graph.addEdge("ASSIGNED_TO", "person-photographer", "scene-reception");
  graph.addEdge("ASSIGNED_TO", "person-driver", "scene-ceremony");
  graph.addEdge("ASSIGNED_TO", "person-driver", "scene-photosession");
  graph.addEdge("PARTICIPATES_IN", "person-client", "scene-ceremony");
  graph.addEdge("PARTICIPATES_IN", "person-client", "scene-photosession");
  graph.addEdge("PARTICIPATES_IN", "person-client", "scene-reception");
  graph.addEdge("PRECEDES", "scene-ceremony", "scene-photosession");
  graph.addEdge("PRECEDES", "scene-photosession", "scene-reception");

  return graph;
}

// Демонстрационный Change: дождь переносит фотосессию (см. 54_Changes.md §37)
export function seedDemoChange(graph) {
  return graph.updateNode(
    "scene-photosession",
    { location: "Зимний сад (крытая площадка)" },
    { reason: "Дождь, ожидается в 15:00", source: "AI", changedBy: "person-organizer" }
  );
}

// Демонстрация согласия адресата (BRIDGE_LIGHT_PLAN.md §3/§9): организатор
// добавляет фотографу съёмку напрямую, без его участия. Сцена не появляется
// в графе — и на таймлайне фотографа — пока он сам её не подтвердит.
export function seedDemoConsentRequest(graph) {
  if (graph.changes.some((c) => c.objectId === "scene-detail-shoot")) return;

  graph.proposeNode(
    {
      id: "scene-detail-shoot",
      type: "Scene",
      title: "Съёмка деталей (кольца, букет)",
      location: "Отель «Метрополь», номер невесты",
      startsAt: shiftNow(200, "minutes"),
      endsAt: shiftNow(230, "minutes"),
    },
    [{ type: "ASSIGNED_TO", from: "person-photographer", to: "scene-detail-shoot" }],
    {
      reason: "Организатор добавил доп. точку в ваше расписание",
      source: "User",
      changedBy: "person-organizer",
      consentFrom: "person-photographer",
    }
  );
}

function shiftNow(amount, unit) {
  const ms = unit === "minutes" ? amount * 60_000 : amount;
  return new Date(Date.now() + ms).toISOString();
}
