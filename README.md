# Controls Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/bradmatt275/ha-control-card)](https://github.com/bradmatt275/ha-control-card/releases)

A custom Lovelace card that consolidates cover/shutter controls and action buttons into a single, configurable dashboard card. Supports two group types: **Covers** (Up/Stop/Down) and **Actions** (script/button tiles).

## Features

- 🪟 **Cover/shutter rows** with Up/Stop/Down button trio
- 🎯 **Action button tiles** for scripts, input buttons, and button entities
- 🎨 **State-aware styling** — green border for open covers, orange for partially open
- ⚡ **Triggered animation** — pulse feedback on action button press
- 📐 **Configurable grid** — set column count for action groups or use auto-fill
- 🔧 **Visual editor** — full UI configuration with entity picker, group management
- 🌙 **Theme integration** — uses HA CSS custom properties for dark/light mode

## Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend" section
3. Click the three dots menu and select "Custom repositories"
4. Add `https://github.com/bradmatt275/ha-control-card` as a "Lovelace" repository
5. Click "Install"
6. Refresh your browser

### Manual Installation

1. Download `controls-card.js` from the [latest release](https://github.com/bradmatt275/ha-control-card/releases)
2. Copy to `config/www/controls-card.js`
3. Add to your Lovelace resources:

```yaml
resources:
  - url: /local/controls-card.js
    type: module
```

## Configuration

The card is fully configurable via the visual editor. You can also configure it via YAML.

### Minimal Configuration

```yaml
type: custom:controls-card
groups:
  - name: Shutters
    type: covers
    entities:
      - entity: cover.master_bedroom_left
      - entity: cover.master_bedroom_right
      - entity: cover.dusk_room
```

### Full Configuration

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
        icon: mdi:blinds
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
```

### Configuration Reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | string | No | `"Controls"` | Card header title |
| `icon` | string | No | `"mdi:tune"` | Card header icon |
| `groups` | array | Yes | — | List of control groups |

#### Group Properties

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string | Yes | — | Group heading label (displayed uppercase) |
| `type` | enum | Yes | — | `"covers"` or `"actions"` |
| `columns` | number | No | auto | Column count for actions grid |
| `entities` | array | Yes | — | Entities in this group |

#### Entity Properties

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `entity` | string | Yes | — | Home Assistant entity ID |
| `name` | string | No | friendly_name | Display name override (use `\n` for line breaks in action labels) |
| `icon` | string | No | entity icon | Icon override (e.g. `mdi:blinds`) |

### Supported Entity Domains

| Group Type | Supported Domains | Service Called |
|---|---|---|
| `covers` | `cover` | `cover.open_cover`, `cover.stop_cover`, `cover.close_cover` |
| `actions` | `script` | `script.turn_on` |
| `actions` | `input_button` | `input_button.press` |
| `actions` | `button` | `button.press` |

## Development

```bash
npm install          # Install dependencies
npm run build        # Production build → dist/controls-card.js
npm run watch        # Development build with auto-rebuild
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint issues
```

**Testing locally**: Copy `dist/controls-card.js` to your HA `config/www/` folder and add as a Lovelace resource.

## License

MIT
