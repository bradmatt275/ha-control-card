/**
 * Controls Card - Action Button Component
 * Renders a single action tile for script/input_button/button entities
 */

import { LitElement, html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant } from "custom-card-helpers";

import { ControlEntity } from "../types";
import { DEFAULT_ACTION_ICON, ACTION_TRIGGERED_DURATION } from "../const";
import { actionButtonStyles } from "../styles";

@customElement("controls-action-button")
export class ControlsActionButton extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ControlEntity;

  @state() private _triggered = false;

  static styles = actionButtonStyles;

  /**
   * Resolve the icon — config override → entity icon → default
   */
  private _getIcon(): string {
    if (this.config.icon) return this.config.icon;

    const stateObj = this.hass.states[this.config.entity];
    return stateObj?.attributes?.icon ?? DEFAULT_ACTION_ICON;
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
    return (this.hass.states[this.config.entity]?.state ?? "unavailable") === "unavailable";
  }

  /**
   * Derive the domain from the entity ID and call the appropriate service
   */
  private _handlePress(): void {
    if (this._isUnavailable()) return;

    const domain = this.config.entity.split(".")[0];

    // script → turn_on; input_button / button → press
    const service = domain === "script" ? "turn_on" : "press";

    this.hass.callService(domain, service, {
      entity_id: this.config.entity,
    });

    // Trigger the pulse animation
    this._triggered = true;
    setTimeout(() => {
      this._triggered = false;
    }, ACTION_TRIGGERED_DURATION);
  }

  protected render(): TemplateResult {
    const unavailable = this._isUnavailable();

    return html`
      <button
        class="action-button ${this._triggered ? "triggered" : ""} ${unavailable ? "unavailable" : ""}"
        @click=${this._handlePress}
        ?disabled=${unavailable}
      >
        <ha-icon .icon=${this._getIcon()}></ha-icon>
        <span class="label">${this._getName()}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "controls-action-button": ControlsActionButton;
  }
}
