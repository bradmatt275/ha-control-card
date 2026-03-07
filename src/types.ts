/**
 * Controls Card - Type Definitions
 * TypeScript interfaces for configuration and state management
 */

import { LovelaceCardConfig } from "custom-card-helpers";

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Main card configuration interface
 */
export interface ControlsCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  icon?: string;
  groups: ControlGroup[];
}

/**
 * Group type — covers, shutter_buttons, actions, or switches
 */
export type ControlGroupType = "covers" | "shutter_buttons" | "actions" | "switches";

/**
 * A named group of control entities
 */
export interface ControlGroup {
  name: string;
  type: ControlGroupType;
  columns?: number;
  entities: ControlEntity[];
  shutter_entities?: ShutterButtonEntity[];
}

/**
 * A single entity within a control group (covers / actions)
 */
export interface ControlEntity {
  entity: string;
  name?: string;
  icon?: string;
}

/**
 * A shutter controlled by 3 separate button entities (up / stop / down)
 */
export interface ShutterButtonEntity {
  name: string;
  icon?: string;
  up_entity: string;
  stop_entity: string;
  down_entity: string;
}

// ============================================================================
// Runtime State Types
// ============================================================================

/**
 * Runtime state for a cover entity
 */
export interface CoverState {
  entityId: string;
  friendlyName: string;
  icon: string;
  state: "open" | "closed" | "opening" | "closing" | "stopped" | "unavailable";
  positionPct?: number;
}

/**
 * Runtime state for an action entity
 */
export interface ActionState {
  entityId: string;
  friendlyName: string;
  icon: string;
  domain: "script" | "input_button" | "button";
  triggered: boolean;
}

/**
 * Runtime state for a switch entity
 */
export interface SwitchState {
  entityId: string;
  friendlyName: string;
  icon: string;
  domain: "switch" | "light" | "input_boolean" | "fan";
  isOn: boolean;
}

// ============================================================================
// Global augmentation
// ============================================================================

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }

  // HTMLElementTagNameMap entries are declared in each component file
}
