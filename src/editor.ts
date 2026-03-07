/**
 * Controls Card - Visual Configuration Editor
 * Provides a UI for configuring the card in the Home Assistant dashboard editor
 */

import { LitElement, html, css, TemplateResult, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  LovelaceCardEditor,
  fireEvent,
} from "custom-card-helpers";

import { ControlsCardConfig, ControlGroup, ControlEntity, ControlGroupType } from "./types";
import { DEFAULT_TITLE, DEFAULT_ICON } from "./const";

@customElement("controls-card-editor")
export class ControlsCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: ControlsCardConfig;

  // ── Styles ───────────────────────────────────────────────────────────────

  static styles = css`
    :host {
      display: block;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-group label {
      font-size: 12px;
      color: var(--secondary-text-color);
    }

    ha-textfield,
    ha-select {
      width: 100%;
    }

    /* ── Group card ─────────────────────────────────────────── */

    .group-card {
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 16px;
    }

    .group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .group-title {
      font-weight: 500;
      font-size: 14px;
    }

    .group-fields {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── Entity list item ───────────────────────────────────── */

    .entity-item {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }

    .entity-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .entity-item-title {
      font-weight: 500;
      font-size: 13px;
    }

    .entity-item-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* ── Add / remove buttons ───────────────────────────────── */

    .add-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border: 2px dashed var(--divider-color);
      border-radius: 8px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: border-color 100ms ease, color 100ms ease;
    }

    .add-button:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }

    .remove-button {
      color: var(--error-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: background-color 100ms ease, color 100ms ease;
    }

    .action-button:hover {
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }

    .action-button.disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .action-button.disabled:hover {
      background: transparent;
      color: var(--secondary-text-color);
    }

    .action-button ha-icon {
      --mdc-icon-size: 18px;
    }
  `;

  // ── Lifecycle ────────────────────────────────────────────────────────────

  public setConfig(config: ControlsCardConfig): void {
    this._config = config;
  }

  // ── Render ───────────────────────────────────────────────────────────────

  protected render(): TemplateResult {
    if (!this._config) return html``;

    return html`
      <div class="editor-container">
        <!-- Global settings -->
        <div class="form-group">
          <label>Title</label>
          <ha-textfield
            .value=${this._config.title ?? DEFAULT_TITLE}
            .placeholder=${DEFAULT_TITLE}
            @input=${(e: Event) =>
              this._updateConfig("title", (e.target as HTMLInputElement).value)}
          ></ha-textfield>
        </div>

        <div class="form-group">
          <label>Icon</label>
          <ha-textfield
            .value=${this._config.icon ?? DEFAULT_ICON}
            .placeholder=${DEFAULT_ICON}
            @input=${(e: Event) =>
              this._updateConfig("icon", (e.target as HTMLInputElement).value)}
          ></ha-textfield>
        </div>

        <!-- Groups -->
        ${(this._config.groups ?? []).map((group, gi) =>
          this._renderGroup(group, gi)
        )}

        <div class="add-button" @click=${this._addGroup}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add Group
        </div>
      </div>
    `;
  }

  // ── Group rendering ──────────────────────────────────────────────────────

  private _renderGroup(group: ControlGroup, gi: number): TemplateResult {
    const domainFilter =
      group.type === "covers"
        ? ["cover"]
        : ["script", "input_button", "button"];

    return html`
      <div class="group-card">
        <div class="group-header">
          <span class="group-title">Group ${gi + 1}${group.name ? `: ${group.name}` : ""}</span>
          <div class="item-actions">
            <div
              class="action-button ${gi === 0 ? "disabled" : ""}"
              @click=${() => this._moveGroupUp(gi)}
              title="Move up"
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </div>
            <div
              class="action-button ${gi === (this._config.groups?.length ?? 0) - 1 ? "disabled" : ""}"
              @click=${() => this._moveGroupDown(gi)}
              title="Move down"
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </div>
            <ha-icon
              class="remove-button"
              icon="mdi:delete"
              @click=${() => this._removeGroup(gi)}
              title="Remove group"
            ></ha-icon>
          </div>
        </div>

        <div class="group-fields">
          <div class="form-group">
            <label>Name</label>
            <ha-textfield
              .value=${group.name ?? ""}
              @input=${(e: Event) =>
                this._updateGroup(gi, "name", (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          </div>

          <div class="form-group">
            <label>Type</label>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ select: {
                options: [
                  { value: "covers", label: "Covers" },
                  { value: "actions", label: "Actions" },
                ],
                mode: "dropdown",
              }}}
              .value=${group.type ?? "covers"}
              @value-changed=${(e: CustomEvent) =>
                this._updateGroup(gi, "type", e.detail.value as ControlGroupType)}
            ></ha-selector>
          </div>

          ${group.type === "actions"
            ? html`
                <div class="form-group">
                  <label>Columns (optional)</label>
                  <ha-textfield
                    type="number"
                    .value=${group.columns != null ? String(group.columns) : ""}
                    placeholder="auto"
                    @input=${(e: Event) => {
                      const val = (e.target as HTMLInputElement).value;
                      this._updateGroup(
                        gi,
                        "columns",
                        val ? Number(val) : undefined
                      );
                    }}
                  ></ha-textfield>
                </div>
              `
            : nothing}

          <!-- Entities for this group -->
          ${(group.entities ?? []).map((entity, ei) =>
            this._renderEntity(entity, gi, ei, domainFilter)
          )}

          <div class="add-button" @click=${() => this._addEntity(gi)}>
            <ha-icon icon="mdi:plus"></ha-icon>
            Add Entity
          </div>
        </div>
      </div>
    `;
  }

  // ── Entity rendering ────────────────────────────────────────────────────

  private _renderEntity(
    entity: ControlEntity,
    gi: number,
    ei: number,
    domainFilter: string[]
  ): TemplateResult {
    const groupEntities = this._config.groups[gi].entities;

    return html`
      <div class="entity-item">
        <div class="entity-item-header">
          <span class="entity-item-title"
            >Entity ${ei + 1}${entity.name ? `: ${entity.name}` : ""}</span
          >
          <div class="item-actions">
            <div
              class="action-button ${ei === 0 ? "disabled" : ""}"
              @click=${() => this._moveEntityUp(gi, ei)}
              title="Move up"
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </div>
            <div
              class="action-button ${ei === groupEntities.length - 1 ? "disabled" : ""}"
              @click=${() => this._moveEntityDown(gi, ei)}
              title="Move down"
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </div>
            <ha-icon
              class="remove-button"
              icon="mdi:delete"
              @click=${() => this._removeEntity(gi, ei)}
              title="Remove entity"
            ></ha-icon>
          </div>
        </div>

        <div class="entity-item-content">
          <div class="form-group">
            <label>Entity</label>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ entity: { domain: domainFilter } }}
              .value=${entity.entity ?? ""}
              @value-changed=${(e: CustomEvent) =>
                this._updateEntity(gi, ei, "entity", e.detail.value ?? "")}
            ></ha-selector>
          </div>

          <div class="form-group">
            <label>Name (optional)</label>
            <ha-textfield
              .value=${entity.name ?? ""}
              placeholder="Use entity name"
              @input=${(e: Event) =>
                this._updateEntity(gi, ei, "name", (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          </div>

          <div class="form-group">
            <label>Icon (optional)</label>
            <ha-textfield
              .value=${entity.icon ?? ""}
              placeholder="Use entity icon"
              @input=${(e: Event) =>
                this._updateEntity(gi, ei, "icon", (e.target as HTMLInputElement).value)}
            ></ha-textfield>
          </div>
        </div>
      </div>
    `;
  }

  // ── Config helpers ───────────────────────────────────────────────────────

  /**
   * Fire a config-changed event with the updated config
   */
  private _fireChanged(config: ControlsCardConfig): void {
    fireEvent(this, "config-changed", { config });
  }

  /**
   * Update a top-level config key
   */
  private _updateConfig(key: string, value: unknown): void {
    const newConfig = { ...this._config, [key]: value };
    if (value === "" || value === undefined) {
      delete (newConfig as Record<string, unknown>)[key];
    }
    this._fireChanged(newConfig);
  }

  // ── Group CRUD ───────────────────────────────────────────────────────────

  private _addGroup(): void {
    const groups = [...(this._config.groups ?? [])];
    groups.push({
      name: `Group ${groups.length + 1}`,
      type: "covers",
      entities: [],
    });
    this._fireChanged({ ...this._config, groups });
  }

  private _removeGroup(index: number): void {
    const groups = [...(this._config.groups ?? [])];
    groups.splice(index, 1);
    this._fireChanged({ ...this._config, groups });
  }

  private _updateGroup(
    index: number,
    field: keyof ControlGroup,
    value: unknown
  ): void {
    const groups = [...(this._config.groups ?? [])];
    groups[index] = { ...groups[index], [field]: value } as ControlGroup;

    // Remove undefined optional fields to keep YAML clean
    if (value === undefined || value === "") {
      delete (groups[index] as unknown as Record<string, unknown>)[field];
    }

    this._fireChanged({ ...this._config, groups });
  }

  private _moveGroupUp(index: number): void {
    if (index === 0) return;
    const groups = [...(this._config.groups ?? [])];
    [groups[index - 1], groups[index]] = [groups[index], groups[index - 1]];
    this._fireChanged({ ...this._config, groups });
  }

  private _moveGroupDown(index: number): void {
    const groups = [...(this._config.groups ?? [])];
    if (index >= groups.length - 1) return;
    [groups[index], groups[index + 1]] = [groups[index + 1], groups[index]];
    this._fireChanged({ ...this._config, groups });
  }

  // ── Entity CRUD ──────────────────────────────────────────────────────────

  private _addEntity(groupIndex: number): void {
    const groups = [...(this._config.groups ?? [])];
    const entities = [...(groups[groupIndex].entities ?? [])];
    entities.push({ entity: "" });
    groups[groupIndex] = { ...groups[groupIndex], entities };
    this._fireChanged({ ...this._config, groups });
  }

  private _removeEntity(groupIndex: number, entityIndex: number): void {
    const groups = [...(this._config.groups ?? [])];
    const entities = [...(groups[groupIndex].entities ?? [])];
    entities.splice(entityIndex, 1);
    groups[groupIndex] = { ...groups[groupIndex], entities };
    this._fireChanged({ ...this._config, groups });
  }

  private _updateEntity(
    groupIndex: number,
    entityIndex: number,
    field: keyof ControlEntity,
    value: string
  ): void {
    const groups = [...(this._config.groups ?? [])];
    const entities = [...(groups[groupIndex].entities ?? [])];
    entities[entityIndex] = { ...entities[entityIndex], [field]: value };

    // Remove empty optional fields
    if ((field === "name" || field === "icon") && !value) {
      delete (entities[entityIndex] as unknown as Record<string, unknown>)[field];
    }

    groups[groupIndex] = { ...groups[groupIndex], entities };
    this._fireChanged({ ...this._config, groups });
  }

  private _moveEntityUp(groupIndex: number, entityIndex: number): void {
    if (entityIndex === 0) return;
    const groups = [...(this._config.groups ?? [])];
    const entities = [...(groups[groupIndex].entities ?? [])];
    [entities[entityIndex - 1], entities[entityIndex]] = [
      entities[entityIndex],
      entities[entityIndex - 1],
    ];
    groups[groupIndex] = { ...groups[groupIndex], entities };
    this._fireChanged({ ...this._config, groups });
  }

  private _moveEntityDown(groupIndex: number, entityIndex: number): void {
    const groups = [...(this._config.groups ?? [])];
    const entities = [...(groups[groupIndex].entities ?? [])];
    if (entityIndex >= entities.length - 1) return;
    [entities[entityIndex], entities[entityIndex + 1]] = [
      entities[entityIndex + 1],
      entities[entityIndex],
    ];
    groups[groupIndex] = { ...groups[groupIndex], entities };
    this._fireChanged({ ...this._config, groups });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "controls-card-editor": ControlsCardEditor;
  }
}
