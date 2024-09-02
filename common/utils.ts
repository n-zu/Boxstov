export function polarToCartesian(angle: number, radius: number): [number, number] {
    return [
        radius * Math.cos(angle),
        radius * Math.sin(angle)
    ];
}
