/**
 * Controls Card - Shared CSS Styles
 * All component styles using Lit's css template tag
 */

import { css } from "lit";

// ============================================================================
// CSS Custom Properties
// ============================================================================

export const cssVariables = css`
  :host {
    /* Status colours — fallbacks match the HA design system */
    --status-success: #4caf50;
    --status-warning: #ff9800;

    /* Spacing scale */
    --controls-card-padding: 16px;
    --controls-section-gap: 16px;

    /* Border radius scale */
    --controls-radius-card: 16px;
    --controls-radius-row: 12px;
    --controls-radius-button: 8px;
  }
`;

// ============================================================================
// Main Card Styles
// ============================================================================

export const cardStyles = css`
  ${cssVariables}

  :host {
    display: block;
    width: 100%;
  }

  ha-card {
    padding: var(--controls-card-padding);
    border-radius: var(--controls-radius-card);
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;
  }

  /* ── Header ────────────────────────────────────────────────── */

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: var(--controls-section-gap);
  }

  .card-header ha-icon {
    --mdc-icon-size: 24px;
    color: var(--primary-text-color);
  }

  .card-header .title {
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  /* ── Group ─────────────────────────────────────────────────── */

  .control-group {
    margin-bottom: var(--controls-section-gap);
  }

  .control-group:last-child {
    margin-bottom: 0;
  }

  .group-label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  /* ── Cover rows container ──────────────────────────────────── */

  .covers-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  @media (min-width: 600px) {
    .covers-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ── Actions grid ──────────────────────────────────────────── */

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
`;

// ============================================================================
// Cover Row Styles
// ============================================================================

export const coverRowStyles = css`
  ${cssVariables}

  :host {
    display: block;
  }

  .cover-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-left: 3px solid var(--divider-color);
    border-radius: var(--controls-radius-row);
    transition: border-left-color 300ms ease;
  }

  .cover-row.open {
    border-left-color: var(--status-success, #4caf50);
  }

  .cover-row.partial {
    border-left-color: var(--status-warning, #ff9800);
  }

  .cover-row.unavailable {
    opacity: 0.5;
  }

  /* Entity icon */
  .cover-row ha-icon {
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  /* Name + position */
  .name {
    font-size: 14px;
    font-weight: 400;
    color: var(--primary-text-color);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .position {
    font-size: 11px;
    font-weight: 500;
    font-family: monospace;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  /* Button group */
  .button-group {
    display: flex;
    gap: 4px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .cover-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--divider-color);
    border-radius: var(--controls-radius-button);
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
    transition: background 150ms ease;
    padding: 0;
  }

  .cover-btn ha-icon {
    --mdc-icon-size: 18px;
    color: var(--primary-text-color);
  }

  .cover-btn.stop ha-icon {
    color: var(--secondary-text-color);
  }

  .cover-btn:hover {
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
  }

  .cover-btn:active {
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);
  }

  .cover-btn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .cover-btn:disabled:hover {
    background: transparent;
  }
`;

// ============================================================================
// Action Button Styles
// ============================================================================

export const actionButtonStyles = css`
  ${cssVariables}

  :host {
    display: block;
  }

  .action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 12px;
    background: var(--card-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--controls-radius-row);
    cursor: pointer;
    transition: background 150ms ease;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }

  .action-button:hover {
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
  }

  .action-button:active {
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);
  }

  .action-button.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-button.unavailable:hover {
    background: var(--card-background-color);
  }

  .action-button ha-icon {
    --mdc-icon-size: 28px;
    color: var(--primary-color);
  }

  .action-button .label {
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
    line-height: 1.3;
    white-space: pre-line;
  }

  /* Triggered pulse animation */
  .action-button.triggered ha-icon {
    animation: action-triggered 500ms ease forwards;
  }

  @keyframes action-triggered {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    40% {
      transform: scale(1.15);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
