interface Color {
    r: number,
    g: number,
    b: number
}

export function hexToRgb(hex: string) {
    let result: string[] | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16)
    } : null;
}

export function isLight(color: Color) {
    return (color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > 186;
}

export const betterMod = (n: number, m: number) => {
    if (n >= 0) while (n >= m) n -= m;
    else while (n < 0) n += m;
    return n;
}