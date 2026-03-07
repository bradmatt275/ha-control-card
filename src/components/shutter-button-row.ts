/**
 * Controls Card - Shutter Button Row Component
 * Renders a shutter row with Up/Stop/Down buttons that call
 * button.press or script.turn_on instead of cover services.
 * Visually identical to cover-row.
 */

import { LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant } from "custom-card-helpers";

import { ShutterButtonEntity } from "../types";
import { DEFAULT_SHUTTER_BUTTON_ICON } from "../const";
import { coverRowStyles } from "../styles";

@customElement("controls-shutter-button-row")
export class ControlsShutterButtonRow extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ShutterButtonEntity;

  // Reuse the exact same styles as cover-row
  static styles = coverRowStyles;

  /**
   * Resolve the icon — config override → default
   */
  private _getIcon(): string {
    return this.config.icon ?? DEFAULT_SHUTTER_BUTTON_ICON;
  }

  /**
   * Check if any of the 3 entities are unavailable
   */
  private _isUnavailable(): boolean {
    const ids = [
      this.config.up_entity,
      this.config.stop_entity,
      this.config.down_entity,
    ];
    return ids.every(
      (id) => !id || (this.hass.states[id]?.state ?? "unavailable") === "unavailable"
    );
  }

  /**
   * Call the appropriate service on a button/script entity
   */
  private _callEntity(entityId: string): void {
    if (!entityId) return;

    const domain = entityId.split(".")[0];
    const service = domain === "script" ? "turn_on" : "press";

    this.hass.callService(domain, service, {
      entity_id: entityId,
    });
  }

  protected render(): TemplateResult {
    const unavailable = this._isUnavailable();

    return html`
      <div class="cover-row ${unavailable ? "unavailable" : ""}">
        <ha-icon .icon=${this._getIcon()}></ha-icon>
        <span class="name">${this.config.name}</span>
        <div class="button-group">
          <button
            class="cover-btn"
            @click=${() => this._callEntity(this.config.up_entity)}
            ?disabled=${unavailable}
            title="Up"
          >
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button
            class="cover-btn stop"
            @click=${() => this._callEntity(this.config.stop_entity)}
            ?disabled=${unavailable}
            title="Stop"
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
          <button
            class="cover-btn"
            @click=${() => this._callEntity(this.config.down_entity)}
            ?disabled=${unavailable}
            title="Down"
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "controls-shutter-button-row": ControlsShutterButtonRow;
  }
}
