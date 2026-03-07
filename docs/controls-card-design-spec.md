# Controls Card — Home Assistant Custom Lovelace Card
## Design Specification v1.0

---

## Overview

A unified, configurable controls card that consolidates all action-oriented controls into a single cohesive dashboard card. Supports three control group types: **Covers/Shutters** (Up/Stop/Down), **Action Buttons** (icon + label scripts/input_buttons), and future extensibility. Groups are always expanded and user-defined via YAML configuration. Visually matches the existing Energy, Battery, and Lights card aesthetic.

---

## Visual Design

### Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  🎛  Controls                                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│  SHUTTERS                                            │
│  ┌────────────────────────────────────────────────┐  │
│  │  ▤  Master Bedroom Left        ↑  ■  ↓        │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  ▤  Master Bedroom Right       ↑  ■  ↓        │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  ▤  Dusk Room                  ↑  ■  ↓        │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ACTIONS                                             │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │  🖥  Gaming PC   │  │  💡  Night Mode  │         │
│  │     Turn On      │  │                  │         │
│  └──────────────────┘  └──────────────────┘         │
│  ┌──────────────────┐                               │
│  │  🔒  Lock All    │                               │
│  └──────────────────┘                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Shutter Row Detail

```
┌──────────────────────────────────────────────────────┐
│  [icon]  Entity Name                [▲] [■] [▼]     │
└──────────────────────────────────────────────────────┘

- Icon: mdi:blinds or entity's own icon, 20px, secondary text color
- Name: 14px, primary text, left-aligned, grows to fill space
- Button group: right-aligned, pill-shaped trio
  - ▲ Up:   mdi:chevron-up
  - ■ Stop: mdi:stop  (only shown for cover entities)
  - ▼ Down: mdi:chevron-down
```

### Action Button Detail

```
┌─────────────────────┐
│  [icon]             │
│  Label line 1       │
│  Label line 2       │
└─────────────────────┘

- Icon: 28px, accent colored, centered top-area
- Label: 12px, centered, up to 2 lines, wraps naturally
- Min-width: ~120px, grows in grid
- Background: card background with border
- Active/press state: brief highlight flash
```

### Visual Hierarchy

1. **Card header** — Icon + "Controls" title (matches other cards)
2. **Group labels** — 12px uppercase, secondary color, section dividers
3. **Shutter rows** — Full-width rows, consistent height, button group right-aligned
4. **Action buttons** — Grid layout (auto-fill, min 120px), icon-prominent tiles

---

## Color Scheme

Follows the design system. No new colors introduced.

| Element | Color Variable |
|---|---|
| Card background | `--ha-card-background` |
| Group label text | `--secondary-text-color` |
| Row/button border | `--divider-color` |
| Row background | `--card-background-color` |
| Entity icon (default) | `--secondary-text-color` |
| Button icon (Up/Down) | `--primary-text-color` |
| Stop button | `--secondary-text-color` |
| Action button icon | `--primary-color` |
| Action button label | `--primary-text-color` |
| Button hover bg | `rgba(var(--rgb-primary-color), 0.1)` |
| Button active/press bg | `rgba(var(--rgb-primary-color), 0.2)` |
| Open state indicator | `--status-success` left border accent |
| Closed state indicator | no accent (neutral) |

### State Colors for Cover Rows

- **Open**: subtle `--status-success` left border (3px) on the row
- **Closed**: no border, neutral appearance
- **Partially open**: `--status-warning` left border

---

## Typography

| Element | Size | Weight | Style |
|---|---|---|---|
| Card title | 16px | 500 | Normal |
| Group label | 12px | 500 | Uppercase, letter-spacing 0.5px |
| Entity name | 14px | 400 | Normal |
| Action button label | 12px | 500 | Centered, normal |
| Cover position % | 11px | 500 | Monospace, secondary color |

---

## Interactions & Animations

### Button Press Feedback
- **Duration**: 150ms
- **Effect**: Background flashes to `rgba(primary-color, 0.2)` then fades back
- No persistent state change on buttons (the entity updates via HA subscription)

### Cover State Update
- Left border color transitions smoothly: `transition: border-color 300ms ease`

### Action Button "Triggered" State
- Brief 500ms pulse animation on the icon after tap
- Communicates the action was received

```css
@keyframes action-triggered {
  0%   { transform: scale(1);    opacity: 1; }
  40%  { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1);    opacity: 1; }
}
```

---

## Configuration Schema

```yaml
type: custom:controls-card
title: Controls           # optional, defaults to "Controls"
icon: mdi:tune            # optional, defaults to mdi:tune

groups:
  - name: Shutters        # Group label (uppercase in UI)
    type: covers          # "covers" | "actions"
    entities:
      - entity: cover.master_bedroom_left
        name: Master Bedroom Left   # optional override
        icon: mdi:blinds            # optional override
      - entity: cover.master_bedroom_right
        name: Master Bedroom Right
      - entity: cover.dusk_room
        name: Dusk Room

  - name: Actions
    type: actions
    columns: 3            # optional, default auto (fill)
    entities:
      - entity: script.gaming_pc_turn_on
        name: "Gaming PC\nTurn On"  # \n for line break in label
        icon: mdi:monitor
      - entity: input_button.lock_all
        name: Lock All
        icon: mdi:lock
      - entity: script.night_mode
        name: Night Mode
        icon: mdi:weather-night
```

### Config Properties Reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | string | No | `"Controls"` | Card header title |
| `icon` | string | No | `"mdi:tune"` | Card header icon |
| `groups` | array | Yes | — | List of control groups |
| `groups[].name` | string | Yes | — | Group heading label |
| `groups[].type` | enum | Yes | — | `"covers"` or `"actions"` |
| `groups[].entities` | array | Yes | — | Entities in this group |
| `groups[].columns` | number | No | auto | Columns for actions grid |
| `entity.entity` | string | Yes | — | HA entity ID |
| `entity.name` | string | No | friendly_name | Display name override |
| `entity.icon` | string | No | entity icon | Icon override |

---

## TypeScript Interfaces

```typescript
interface ControlsCardConfig extends LovelaceCardConfig {
  type: "custom:controls-card";
  title?: string;
  icon?: string;
  groups: ControlGroup[];
}

type ControlGroupType = "covers" | "actions";

interface ControlGroup {
  name: string;
  type: ControlGroupType;
  columns?: number;
  entities: ControlEntity[];
}

interface ControlEntity {
  entity: string;
  name?: string;
  icon?: string;
}

// Runtime state per cover entity
interface CoverState {
  entityId: string;
  friendlyName: string;
  icon: string;
  state: "open" | "closed" | "opening" | "closing" | "stopped";
  positionPct?: number;       // 0-100 if supported
}

// Runtime state per action entity
interface ActionState {
  entityId: string;
  friendlyName: string;
  icon: string;
  domain: "script" | "input_button" | "button";
  triggered: boolean;         // true for 500ms after press
}
```

---

## Component Architecture

```
controls-card/
├── src/
│   ├── controls-card.ts        # Main card element
│   ├── editor.ts               # Visual config editor
│   ├── types.ts                # Interfaces above
│   ├── const.ts                # CARD_NAME, defaults
│   ├── styles.ts               # All CSS (lit css`...`)
│   └── components/
│       ├── cover-row.ts        # Single shutter row component
│       └── action-button.ts    # Single action tile component
├── dist/
│   └── controls-card.js
├── package.json
├── rollup.config.js
└── hacs.json
```

### Rendering Logic (Main Card)

```
render():
  → <ha-card>
      → header row (icon + title)
      → for each group in config.groups:
          → group label
          → if group.type === "covers":
              → for each entity: <cover-row>
          → if group.type === "actions":
              → actions grid
                → for each entity: <action-button>
```

### Cover Row Component

```
CoverRow:
  props: hass, entity (ControlEntity)
  
  computed:
    coverState = hass.states[entity.entity]
    stateStr    = coverState?.state ?? "unavailable"
    position    = coverState?.attributes?.current_position
    borderClass = stateStr === "open" ? "open"
                : stateStr === "closed" ? "closed"
                : "partial"

  actions:
    callService("cover", "open_cover",  { entity_id })
    callService("cover", "stop_cover",  { entity_id })
    callService("cover", "close_cover", { entity_id })

  render:
    <div class="cover-row {borderClass}">
      <ha-icon icon={resolvedIcon} />
      <span class="name">{resolvedName}</span>
      {position != null && <span class="position">{position}%</span>}
      <div class="button-group">
        <button @click=open>  ↑ </button>
        <button @click=stop>  ■ </button>
        <button @click=close> ↓ </button>
      </div>
    </div>
```

### Action Button Component

```
ActionButton:
  props: hass, entity (ControlEntity)
  state: triggered (boolean, resets after 500ms)

  actions:
    domain = entity.entity.split(".")[0]
    service = domain === "script" ? "turn_on" : "press"
    callService(domain, service, { entity_id })
    triggered = true; setTimeout(() => triggered = false, 500)

  render:
    <button class="action-button {triggered ? 'triggered' : ''}">
      <ha-icon icon={resolvedIcon} />
      <span class="label">{resolvedName}</span>
    </button>
```

---

## Visual Editor (Config Editor)

The editor allows groups to be added/removed and entities within each group to be configured.

```
┌──────────────────────────────────────────────────────┐
│  Title:  [Controls            ]                      │
│  Icon:   [mdi:tune            ]  🎛                  │
│                                                      │
│  ── Group 1 ─────────────────────────────────────    │
│  Name:   [Shutters            ]                      │
│  Type:   [Covers          ▼  ]                       │
│  Entities:                                           │
│    [cover.master_bedroom_left          ] [✕]         │
│    [cover.master_bedroom_right         ] [✕]         │
│    [+ Add Entity]                                    │
│                                                      │
│  ── Group 2 ─────────────────────────────────────    │
│  Name:   [Actions             ]                      │
│  Type:   [Actions         ▼  ]                       │
│  Entities:                                           │
│    [script.gaming_pc_turn_on           ] [✕]         │
│    [+ Add Entity]                                    │
│                                                      │
│  [+ Add Group]                                       │
└──────────────────────────────────────────────────────┘
```

Use `ha-entity-picker` for all entity fields (filtered by domain where possible).

---

## CSS Key Patterns

```css
/* Cover row with state border */
.cover-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--card-background-color);
  border: 1px solid var(--divider-color);
  border-left: 3px solid var(--divider-color);  /* default */
  border-radius: 12px;
  transition: border-left-color 300ms ease;
}
.cover-row.open    { border-left-color: var(--status-success); }
.cover-row.partial { border-left-color: var(--status-warning); }

/* Button trio */
.button-group {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.cover-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--divider-color);
  border-radius: 8px;
  background: transparent;
  color: var(--primary-text-color);
  cursor: pointer;
  transition: background 150ms ease;
}
.cover-btn:active,
.cover-btn:hover {
  background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
}

/* Actions grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

/* Action button tile */
.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  background: var(--card-background-color);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  cursor: pointer;
  transition: background 150ms ease;
  text-align: center;
}
.action-button ha-icon {
  --mdc-icon-size: 28px;
  color: var(--primary-color);
}
.action-button .label {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary-text-color);
  line-height: 1.3;
}
.action-button:active,
.action-button:hover {
  background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
}
.action-button.triggered ha-icon {
  animation: action-triggered 500ms ease forwards;
}
```

---

## Example Configurations

### Minimal (current setup)

```yaml
type: custom:controls-card
groups:
  - name: Shutters
    type: covers
    entities:
      - entity: cover.master_bedroom_left
      - entity: cover.master_bedroom_right
      - entity: cover.dusk_room

  - name: Actions
    type: actions
    entities:
      - entity: script.gaming_pc_turn_on
        name: "Gaming PC\nTurn On"
        icon: mdi:monitor
```

### Expanded future setup

```yaml
type: custom:controls-card
title: Controls
icon: mdi:tune
groups:
  - name: Shutters
    type: covers
    entities:
      - entity: cover.master_bedroom_left
        name: Master Bedroom Left
      - entity: cover.master_bedroom_right
        name: Master Bedroom Right
      - entity: cover.dusk_room
        name: Dusk Room

  - name: Quick Actions
    type: actions
    columns: 3
    entities:
      - entity: script.gaming_pc_turn_on
        name: "Gaming PC\nTurn On"
        icon: mdi:monitor
      - entity: script.night_mode
        name: Night Mode
        icon: mdi:weather-night
      - entity: input_button.lock_all
        name: Lock All
        icon: mdi:lock
      - entity: script.good_morning
        name: Good Morning
        icon: mdi:coffee
```

---

## Implementation Notes

1. **Cover position**: Not all covers report `current_position`. Always guard with optional chaining: `coverState?.attributes?.current_position`. Only render the `%` label if the value is defined.

2. **Stop button**: Always render it — the stop service is safe to call on any cover entity regardless of whether position is supported.

3. **Script entities**: Use `script.turn_on` not `homeassistant.turn_on` to avoid HA version compatibility issues.

4. **Entity domain detection**: Derive the service domain from the entity ID prefix: `entity.split(".")[0]`. Supported: `script`, `input_button`, `button`.

5. **Icon resolution**: Use `entity.icon` config override → `hass.states[entityId]?.attributes?.icon` → domain default (`mdi:blinds` for covers, `mdi:gesture-tap-button` for actions).

6. **`shouldUpdate()`**: Only re-render when the states of configured entities change. Iterate `config.groups[].entities` and check if any entity ID appears in `changedProps.get("hass")?.states`.

7. **`getCardSize()`**: Return `Math.ceil(totalEntityCount / 2) + groupCount + 1` as an approximation.

8. **No position slider**: Per spec, covers only need Up/Stop/Down. Do not implement a slider for v1.

9. **Unavailable state**: If an entity is unavailable, show the row/tile greyed out (50% opacity) and disable its buttons. Do not throw or hide the row entirely.

---

## GitHub Copilot Implementation Prompt

```
I am building a custom Home Assistant Lovelace card called `controls-card`.

CARD PURPOSE:
A unified controls card with configurable groups. Supports two group types:
- "covers": displays shutter/blind entities with Up/Stop/Down button trio
- "actions": displays script/input_button/button entities as icon+label tiles in a grid

TECH STACK:
- LitElement with TypeScript decorators
- Rollup bundler
- Home Assistant custom-card-helpers
- CSS in lit css`` template literals (no external stylesheets)

DESIGN SYSTEM:
All styling uses CSS custom properties from the HA theme:
--ha-card-background, --card-background-color, --divider-color,
--primary-text-color, --secondary-text-color, --primary-color,
--status-success (#4CAF50), --status-warning (#FF9800)
Spacing: 4/8/12/16/24px scale. Border radius: 4/8/12/16px scale.
Font: system-ui. Monospace for numeric data values.

CONFIGURATION INTERFACE:
interface ControlsCardConfig {
  title?: string;           // default "Controls"
  icon?: string;            // default "mdi:tune"
  groups: Array<{
    name: string;
    type: "covers" | "actions";
    columns?: number;
    entities: Array<{
      entity: string;
      name?: string;
      icon?: string;
    }>;
  }>;
}

PHASE 1 - Project setup:
Create package.json, tsconfig.json, rollup.config.js for a HA custom card.
Entry: src/controls-card.ts. Output: dist/controls-card.js (single bundle).

PHASE 2 - Types and constants:
Create src/types.ts with ControlsCardConfig, ControlGroup, ControlEntity,
CoverState, ActionState interfaces.
Create src/const.ts with CARD_TYPE = "controls-card", CARD_NAME, defaults.

PHASE 3 - Cover row sub-component (src/components/cover-row.ts):
LitElement component. Props: hass (HomeAssistant), config (ControlEntity).
- Reads cover state from hass.states
- Shows: ha-icon | entity name | optional position% | [Up][Stop][Down] buttons
- Left border color: green if open, orange if partially open, neutral if closed
- Calls cover.open_cover / cover.stop_cover / cover.close_cover services
- Greyed out + buttons disabled if state is "unavailable"

PHASE 4 - Action button sub-component (src/components/action-button.ts):
LitElement component. Props: hass, config (ControlEntity).
- Tile layout: centered icon (28px, primary-color) above label (12px, 2-line max)
- Detects domain from entity ID, calls appropriate service (script.turn_on,
  input_button.press, button.press)
- On press: sets triggered=true, plays scale pulse animation, resets after 500ms
- Greyed out if unavailable

PHASE 5 - Main card (src/controls-card.ts):
- Renders ha-card with header (icon + title) and groups
- For each group: section label then either a list of cover-rows or
  a CSS grid of action-buttons (auto-fill, minmax 120px 1fr)
- Implements shouldUpdate() to only re-render on relevant entity state changes
- Implements getCardSize(), getConfigElement(), getStubConfig()
- Registers to window.customCards

PHASE 6 - Visual editor (src/editor.ts):
LovelaceCardEditor with ha-entity-picker for entity fields.
Allows adding/removing groups and entities within groups.
Use ha-textfield for name, ha-select for group type.

Follow the HA custom card patterns from custom-card-helpers.
Use fireEvent(this, "config-changed", { config }) for editor changes.
Use this.hass.callService(domain, service, { entity_id }) for actions.
```
