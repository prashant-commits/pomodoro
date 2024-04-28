export const FONTS = {
  kumbh: "--kumbh-sans",
  roboto: "--roboto-slab",
  spaceMono: "--space-mono",
};

export const PRIMARY_COLORS = {
  orange: "--orange-color",
  teal: "--teal-color",
  lavender: "--lavender-color",
};

export const defaultSettings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  font: FONTS.kumbh,
  primaryColor: PRIMARY_COLORS.orange,
};

export function getFont(font = FONTS.kumbh) {
  const fontValues = Object.values(FONTS);
  if (!fontValues.includes(font)) {
    console.warn("Invalid font value, using default font");
    font = FONTS.kumbh;
  }
  return `var(${font})`;
}

export function getPrimaryColor(color = PRIMARY_COLORS.orange) {
  const colorValues = Object.values(PRIMARY_COLORS);
  if (!colorValues.includes(color)) {
    console.warn("Invalid color value, using default color");
    color = PRIMARY_COLORS.orange;
  }
  return `var(${color})`;
}
