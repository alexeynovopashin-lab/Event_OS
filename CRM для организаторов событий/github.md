repo: alexeynovopashin-lab/Event_OS
branch: main
path: .

## Last sync
date: 2026-09-04T00:00:00Z

### Updated in this project
- Собран десктопный Organizer Workspace для агентства «Dreams»: 4 экрана + дизайн-контекст + демо-обложка
- Дизайн-система выведена из 40_UI_Philosophy / 41_Design_Principles: светлый холст, знак+слово в статусах, тёмный остров только для «идёт сейчас»
- Терминология и демо-данные взяты из app/core/seed.js (Scene, Person, Change, Иванов + Петрова, Парк → Зимний сад)
- Граф приглашений произвольной глубины из BRIDGE_LIGHT_PLAN показан в карточке специалиста (Марк → Марина → Дима)

## Screen map
| Файл в проекте | Источник в репозитории |
| --- | --- |
| Демо.dc.html | README.md, app/README.md |
| Design Context.dc.html | 00_North_Star.md, 40_UI_Philosophy.md, 41_Design_Principles.md, 22_Roles.md, 50_Event_Lifecycle.md |
| Рабочий стол.dc.html | 20_Workspaces.md §6.1, 40_UI_Philosophy.md §31–32, 54_Changes.md, app/core/seed.js |
| Календарь.dc.html | 13_Timeline_Canvas.md, 50_Event_Lifecycle.md §6–11 |
| Команды.dc.html | 22_Roles.md §31–35, 20_Workspaces.md §8–9, 23_Permissions.md |
| Специалисты.dc.html | 22_Roles.md, 11_Graph_Model.md, BRIDGE_LIGHT_PLAN.md §2/§4/§9 |

## Не перенесено в код
- Экраны статичные, интерактив не реализован
- Карточка события с Timeline по сценам не сделана
- Корзина, создание события, площадки, статистика и учёт — только пункты навигации
