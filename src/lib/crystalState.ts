/** Shared mutable state — written by HeroObject every RAF frame,
 *  read by GizmoController and TriangleMatrix. */
export const crystalState = {
  /** Current quaternion (read-only for consumers) */
  qw: 1, qx: 0, qy: 0, qz: 0,
  /** Euler approximation for TriangleMatrix backward-compat */
  ry: 0, rx: 0,

  /** Set true while gizmo is being dragged */
  gizmoActive: false,
  /** Target Euler angles written by GizmoController */
  gizmoTargetRy: 0,
  gizmoTargetRx: 0,
};

/** Material parameters — written by MaterialConsole, read by HeroObject.
 *  color '#ffffff' = fully clear glass (white tint → no tint → max transparency).
 */
export const crystalMatParams = {
  color:      '#ffffff',   // white = fully clear glass
  roughness:  0.0,         // 0 = crystal clear, 1 = frosted
  noiseScale: 4.0,
  dirty:      false,
};
