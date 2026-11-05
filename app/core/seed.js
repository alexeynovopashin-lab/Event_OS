// core/seed.js
// Демонстрационные данные одного проекта — свадьба Smith.
// Используются всеми ролевыми PWA, чтобы показать, что они читают
// один и тот же Project Graph.

import { Graph } from "./graph.js";
import { appId } from "./id.js";
import { PlaceRegistry, VERIFICATION, placeRef } from "./registry.js";

export function seedDemoProject() {
  const graph = new Graph("demo-smith-wedding");
  if (graph.nodes.size > 0) return graph; // уже засеяно ранее

  // Event Root (11_Graph_Model.md): каждый граф имеет один корневой объект,
  // все остальные вершины должны иметь путь к нему — иначе не принадлежат
  // системе. Проверяется Graph.orphanNodes(), а не декларируется на слово.
  graph.addNode({ id: "event-smith-wedding", type: "Event", title: "Smith Wedding" });

  graph.addNode({ id: "person-photographer", type: "Person", name: "Алекс", role: "photographer" });
  graph.addNode({ id: "person-driver", type: "Person", name: "Игорь", role: "driver" });
  graph.addNode({ id: "person-client", type: "Person", name: "Иван и Анна", role: "client" });
  graph.addNode({ id: "person-organizer", type: "Person", name: "Организатор", role: "organizer" });
  graph.addEdge("RESPONSIBLE_FOR", "person-organizer", "event-smith-wedding");

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

  graph.addEdge("BELONGS_TO", "scene-ceremony", "event-smith-wedding");
  graph.addEdge("BELONGS_TO", "scene-photosession", "event-smith-wedding");
  graph.addEdge("BELONGS_TO", "scene-reception", "event-smith-wedding");

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

  // Участник из справочника, а не по инвайту (BRIDGE_LIGHT_PLAN.md §9, §13):
  // ресторан существовал в реестре мест до этого проекта. Место адресуется
  // номером из реестра (core/registry.js), а не телефоном: в графе лежит
  // только ссылка PlaceRef — номер и название на день записи. Администратор
  // на смене — человек со своим ID по номеру телефона (appId), он лишь держит
  // ключ при этом месте. Ни INVITED_BY, ни DEPENDS_ON к person-organizer нет —
  // попадание в проект не через приглашение.
  const registry = seedPlaceRegistry();
  const venueId = registry.find("Терраса")[0];
  const venueRef = placeRef(registry, venueId, SEED_DATE);
  graph.addNode(venueRef);
  graph.addEdge("LOCATED_AT", "scene-reception", venueRef.id);

  const venuePhone = "79161234567"; // уже нормализован (telFull() — в Light Plan)
  const managerId = appId(venuePhone, "person");
  graph.addNode({
    id: managerId,
    type: "Person",
    name: "Ресторан «Терраса», администратор",
    role: "venue_manager",
    joinedVia: "catalogue",
  });
  graph.addEdge("ASSIGNED_TO", managerId, "scene-reception");

  return graph;
}

// Демонстрационный реестр мест: ресторан «Терраса» уже есть в справочнике.
// Реестр живёт отдельно от графа проекта (16_Place_Registry.md).
const SEED_DATE = "2026-11-05";

export function seedPlaceRegistry() {
  const registry = new PlaceRegistry();
  const place = registry.issue(
    {
      name: "Ресторан «Терраса»",
      address: "Демо-адрес, 1",
      city: "Томск",
      timezone: "Asia/Tomsk",
      verification: VERIFICATION.HUMAN,
    },
    "2026-01-01"
  );
  registry.addHall(place.placeId, { name: "Основной зал" }, "2026-01-01");
  return registry;
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
