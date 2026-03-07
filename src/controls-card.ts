/**
 * Controls Card for Home Assistant
 * Main card element — composes cover-row and action-button components
 */

import { LitElement, html, nothing, PropertyValues, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from "custom-card-helpers";

import { ControlsCardConfig, ControlGroup } from "./types";
import { CARD_INFO, DEFAULT_TITLE, DEFAULT_ICON } from "./const";
import { cardStyles } from "./styles";

// Import child components (side-effect)
import "./components/cover-row";
import "./components/action-button";
import "./components/shutter-button-row";

// Import editor (side-effect)
import "./editor";

// ── Card registration ──────────────────────────────────────────────────────

// @ts-ignore
window.customCards = window.customCards || [];
// @ts-ignore
window.customCards.push({
  type: CARD_INFO.type,
  name: CARD_INFO.name,
  description: CARD_INFO.description,
});

// ── Main card ──────────────────────────────────────────────────────────────

@customElement("controls-card")
export class ControlsCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ControlsCardConfig;

  static styles = cardStyles;

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Set card configuration — merge with defaults
   */
  public setConfig(config: LovelaceCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    if (!config.groups || !Array.isArray(config.groups)) {
      throw new Error("You must define at least one group");
    }

    this._config = {
      ...config,
      title: config.title ?? DEFAULT_TITLE,
      icon: config.icon ?? DEFAULT_ICON,
      groups: config.groups,
    } as ControlsCardConfig;
  }

  /**
   * Only re-render when entities referenced in the config have changed
   */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has("_config")) return true;

    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) return true;

    // Collect all entity IDs referenced in groups
    for (const group of this._config.groups) {
      // Standard entities (covers & actions)
      for (const entity of (group.entities ?? [])) {
        if (
          oldHass.states[entity.entity] !== this.hass.states[entity.entity]
        ) {
          return true;
        }
      }
      // Shutter button entities (3 per row)
      for (const se of (group.shutter_entities ?? [])) {
        for (const id of [se.up_entity, se.stop_entity, se.down_entity]) {
          if (id && oldHass.states[id] !== this.hass.states[id]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // ── Rendering ────────────────────────────────────────────────────────────

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <ha-card>
        ${this._renderHeader()}
        ${this._config.groups.map((group) => this._renderGroup(group))}
      </ha-card>
    `;
  }

  private _renderHeader(): TemplateResult {
    return html`
      <div class="card-header">
        <ha-icon .icon=${this._config.icon}></ha-icon>
        <span class="title">${this._config.title}</span>
      </div>
    `;
  }

  private _renderGroup(group: ControlGroup): TemplateResult {
    return html`
      <div class="control-group">
        <div class="group-label">${group.name}</div>
        ${group.type === "covers"
          ? this._renderCovers(group)
          : group.type === "shutter_buttons"
            ? this._renderShutterButtons(group)
            : group.type === "actions"
              ? this._renderActions(group)
              : nothing}
      </div>
    `;
  }

  private _renderCovers(group: ControlGroup): TemplateResult {
    return html`
      <div class="covers-list">
        ${(group.entities ?? []).map(
          (entity) => html`
            <controls-cover-row
              .hass=${this.hass}
              .config=${entity}
            ></controls-cover-row>
          `
        )}
      </div>
    `;
  }

  private _renderShutterButtons(group: ControlGroup): TemplateResult {
    return html`
      <div class="covers-list">
        ${(group.shutter_entities ?? []).map(
          (entity) => html`
            <controls-shutter-button-row
              .hass=${this.hass}
              .config=${entity}
            ></controls-shutter-button-row>
          `
        )}
      </div>
    `;
  }

  private _renderActions(group: ControlGroup): TemplateResult {
    const style =
      group.columns != null
        ? `grid-template-columns: repeat(${group.columns}, 1fr)`
        : "";

    return html`
      <div class="actions-grid" style=${style}>
        ${(group.entities ?? []).map(
          (entity) => html`
            <controls-action-button
              .hass=${this.hass}
              .config=${entity}
            ></controls-action-button>
          `
        )}
      </div>
    `;
  }

  // ── Card API ─────────────────────────────────────────────────────────────

  /**
   * Approximate card height for the dashboard layout engine
   */
  public getCardSize(): number {
    if (!this._config?.groups) return 3;

    let totalEntities = 0;
    let groupCount = 0;

    for (const group of this._config.groups) {
      groupCount++;
      totalEntities += (group.entities ?? []).length;
      totalEntities += (group.shutter_entities ?? []).length;
    }

    return Math.ceil(totalEntities / 2) + groupCount + 1;
  }

  /**
   * Return the editor custom element
   */
  static getConfigElement(): HTMLElement {
    return document.createElement("controls-card-editor");
  }

  /**
   * Stub config for new card creation from the UI
   */
  static getStubConfig(): Record<string, unknown> {
    return {
      title: DEFAULT_TITLE,
      icon: DEFAULT_ICON,
      groups: [
        {
          name: "Shutters",
          type: "covers",
          entities: [],
        },
      ],
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "controls-card": ControlsCard;
  }
}
