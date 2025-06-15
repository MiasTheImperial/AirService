export const addOpacity = (color: string, opacity: number): string => {
  const clamp = Math.max(0, Math.min(opacity, 1));
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const alpha = Math.round(clamp * 255).toString(16).padStart(2, '0');
    return `#${hex}${alpha}`;
  }
  const rgbMatch = color.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1]
      .split(',')
      .slice(0, 3)
      .map((v) => parseInt(v.trim(), 10));
    return `rgba(${r}, ${g}, ${b}, ${clamp})`;
  }
  return color;
};
