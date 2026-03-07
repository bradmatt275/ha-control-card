/**
 * Controls Card - Switch Button Component
 * Renders a single toggle tile for switch/light/input_boolean/fan entities
 */

import { LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant } from "custom-card-helpers";

import { ControlEntity } from "../types";
import { DEFAULT_SWITCH_ICON } from "../const";
import { switchButtonStyles } from "../styles";

@customElement("controls-switch-button")
export class ControlsSwitchButton extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ControlEntity;

  static styles = switchButtonStyles;

  /**
   * Resolve the icon — config override → entity icon → default
   */
  private _getIcon(): string {
    if (this.config.icon) return this.config.icon;

    const stateObj = this.hass.states[this.config.entity];
    return stateObj?.attributes?.icon ?? DEFAULT_SWITCH_ICON;
  }

  /**
   * Resolve the display name — config override → friendly_name → entity_id
   */
  private _getName(): string {
    if (this.config.name) return this.config.name;

    const stateObj = this.hass.states[this.config.entity];
    return stateObj?.attributes?.friendly_name ?? this.config.entity;
  }

  /**
   * Check if the entity is unavailable
   */
  private _isUnavailable(): boolean {
    return (
      (this.hass.states[this.config.entity]?.state ?? "unavailable") ===
      "unavailable"
    );
  }

  /**
   * Check if the entity is currently on
   */
  private _isOn(): boolean {
    return this.hass.states[this.config.entity]?.state === "on";
  }

  /**
   * Toggle the entity on/off
   */
  private _handleToggle(): void {
    if (this._isUnavailable()) return;

    const domain = this.config.entity.split(".")[0];
    const service = this._isOn() ? "turn_off" : "turn_on";

    this.hass.callService(domain, service, {
      entity_id: this.config.entity,
    });
  }

  protected render(): TemplateResult {
    const unavailable = this._isUnavailable();
    const isOn = this._isOn();

    return html`
      <button
        class="switch-button ${isOn ? "on" : "off"} ${unavailable ? "unavailable" : ""}"
        @click=${this._handleToggle}
        ?disabled=${unavailable}
      >
        <ha-icon .icon=${this._getIcon()}></ha-icon>
        <span class="label">${this._getName()}</span>
        <div class="toggle-track ${isOn ? "on" : ""}">
          <div class="toggle-thumb"></div>
        </div>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "controls-switch-button": ControlsSwitchButton;
  }
}
