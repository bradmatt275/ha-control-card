/**
 * Controls Card - Cover Row Component
 * Renders a single cover/shutter entity with Up/Stop/Down controls
 */

import { LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HomeAssistant, forwardHaptic } from "custom-card-helpers";

import { ControlEntity } from "../types";
import { DEFAULT_COVER_ICON } from "../const";
import { coverRowStyles } from "../styles";

@customElement("controls-cover-row")
export class ControlsCoverRow extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: ControlEntity;

  static styles = coverRowStyles;

  /**
   * Resolve the icon to display — config override → entity icon → default
   */
  private _getIcon(): string {
    if (this.config.icon) return this.config.icon;

    const stateObj = this.hass.states[this.config.entity];
    return stateObj?.attributes?.icon ?? DEFAULT_COVER_ICON;
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
   * Get the current cover state string
   */
  private _getState(): string {
    return this.hass.states[this.config.entity]?.state ?? "unavailable";
  }

  /**
   * Get optional current position (0-100)
   */
  private _getPosition(): number | undefined {
    const stateObj = this.hass.states[this.config.entity];
    const pos = stateObj?.attributes?.current_position;
    return typeof pos === "number" ? pos : undefined;
  }

  /**
   * Determine the CSS class for the left border state colour
   */
  private _getBorderClass(): string {
    const state = this._getState();

    if (state === "unavailable") return "unavailable";
    if (state === "open" || state === "opening") return "open";
    if (state === "closed") return "";

    // Partially open, closing, stopped
    const pos = this._getPosition();
    if (pos !== undefined && pos > 0 && pos < 100) return "partial";
    if (state === "closing" || state === "stopped") return "partial";

    return "";
  }

  /**
   * Call a cover service
   */
  private _callService(service: string): void {
    this.hass.callService("cover", service, {
      entity_id: this.config.entity,
    });

    forwardHaptic("light");
  }

  protected render(): TemplateResult {
    const isUnavailable = this._getState() === "unavailable";
    const borderClass = this._getBorderClass();
    const position = this._getPosition();

    return html`
      <div class="cover-row ${borderClass}">
        <ha-icon .icon=${this._getIcon()}></ha-icon>
        <span class="name">${this._getName()}</span>
        ${position !== undefined
          ? html`<span class="position">${position}%</span>`
          : ""}
        <div class="button-group">
          <button
            class="cover-btn"
            @click=${() => this._callService("open_cover")}
            ?disabled=${isUnavailable}
            title="Open"
          >
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button
            class="cover-btn stop"
            @click=${() => this._callService("stop_cover")}
            ?disabled=${isUnavailable}
            title="Stop"
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
          <button
            class="cover-btn"
            @click=${() => this._callService("close_cover")}
            ?disabled=${isUnavailable}
            title="Close"
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
    "controls-cover-row": ControlsCoverRow;
  }
}
