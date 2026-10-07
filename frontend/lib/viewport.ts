const DESIGN_WIDTH = 1920;

export const pxToVw = (px: number) => `${(px / DESIGN_WIDTH) * 100}vw`;
