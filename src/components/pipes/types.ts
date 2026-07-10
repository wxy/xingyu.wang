export type PipeDirection = "horizontal" | "vertical";
export type JointVariant = "silver" | "copper";

/** Shared gradient definitions to keep components DRY. */

export const PIPE_GRADIENT: Record<PipeDirection, string> = {
  horizontal: [
    "linear-gradient(180deg,",
    "rgba(255,255,255,0.15) 0%,",
    "transparent 5px,",
    "transparent 9px,",
    "rgba(0,0,0,0.3) 11px,",
    "rgba(0,0,0,0.5) 14px)",
  ].join(""),
  vertical: [
    "linear-gradient(90deg,",
    "rgba(255,255,255,0.15) 0%,",
    "transparent 5px,",
    "transparent 9px,",
    "rgba(0,0,0,0.3) 11px,",
    "rgba(0,0,0,0.5) 14px)",
  ].join(""),
};

export const PIPE_METAL = ["linear-gradient(", "180deg,", "#b0b0b0,", "#c8c8c8 10%,", "#a0a0a0 25%,", "#b8b8b8 50%,", "#909090 75%,", "#a8a8a8 90%,", "#808080", ")"].join("");

export const PIPE_METAL_V: string = PIPE_METAL.replace("180deg", "90deg");

export const JOINT_GRADIENT: Record<JointVariant, string> = {
  silver: [
    "radial-gradient(ellipse at 35% 25%,",
    "rgba(255,255,255,0.2) 0%, transparent 50%),",
    "linear-gradient(135deg,",
    "#c0c0c0, #a0a0a0 20%, #888 45%,",
    "#a8a8a8 70%, #808080 90%, #999)",
  ].join(""),
  copper: [
    "radial-gradient(ellipse at 35% 25%,",
    "rgba(255,255,200,0.18) 0%, transparent 50%),",
    "linear-gradient(135deg,",
    "#e8c878, #c89840 20%, #a87828 45%,",
    "#c8a040 70%, #b08030 90%, #a07828)",
  ].join(""),
};

export const JOINT_SHADOW = [
  "0 3px 8px rgba(0,0,0,0.5),",
  "inset 0 2px 3px rgba(255,255,255,0.2),",
  "inset 0 -2px 4px rgba(0,0,0,0.3)",
].join("");

export const PIPE_SHADOW = "0 1px 3px rgba(0,0,0,0.5)";
