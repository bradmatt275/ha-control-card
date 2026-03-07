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
 * Group type — covers (shutters/blinds) or actions (scripts/buttons)
 */
export type ControlGroupType = "covers" | "actions";

/**
 * A named group of control entities
 */
export interface ControlGroup {
  name: string;
  type: ControlGroupType;
  columns?: number;
  entities: ControlEntity[];
}

/**
 * A single entity within a control group
 */
export interface ControlEntity {
  entity: string;
  name?: string;
  icon?: string;
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
