/**
 * Controls Card - Constants and Defaults
 */

// ============================================================================
// Card Info
// ============================================================================

export const CARD_NAME = "controls-card";
export const CARD_VERSION = "1.0.0";

export const CARD_INFO = {
  type: CARD_NAME,
  name: "Controls Card",
  description: "A unified controls card for covers, shutters, and action buttons",
};

// ============================================================================
// Defaults
// ============================================================================

export const DEFAULT_TITLE = "Controls";
export const DEFAULT_ICON = "mdi:tune";

/** Default icon for cover entities when none is set */
export const DEFAULT_COVER_ICON = "mdi:blinds";

/** Default icon for shutter button entities when none is set */
export const DEFAULT_SHUTTER_BUTTON_ICON = "mdi:blinds";

/** Default icon for action entities when none is set */
export const DEFAULT_ACTION_ICON = "mdi:gesture-tap-button";

/** Default icon for switch entities when none is set */
export const DEFAULT_SWITCH_ICON = "mdi:toggle-switch";

/** Duration (ms) for the action-triggered animation */
export const ACTION_TRIGGERED_DURATION = 500;
