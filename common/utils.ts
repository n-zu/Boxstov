import { GunType } from "./generated/player/playerArsenal.js";
import { GunName } from "./guns/gun.js";

export function polarToCartesian(angle: number, radius: number): [number, number] {
    return [
        radius * Math.cos(angle),
        radius * Math.sin(angle)
    ];
}

// Source: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
export function getPrng(seed: number) {
    return function () {
        seed |= 0;
        seed = seed + 0x9e3779b9 | 0;
        let t = seed ^ seed >>> 16;
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15;
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}

export function gunNameToGunType(gunName: GunName): GunType {
    switch (gunName) {
        case "rifle":
            return GunType.Rifle;
        case "shotgun":
            return GunType.Shotgun;
        case "rpg":
            return GunType.Rpg;
    }
}

export function gunTypeToGunName(gunType: GunType): GunName {
    switch (gunType) {
        case GunType.Rifle:
            return "rifle";
        case GunType.Shotgun:
            return "shotgun";
        case GunType.Rpg:
            return "rpg";
        case GunType.UNRECOGNIZED:
            throw new Error("function: gunTypeToGunName | action: received GunType.UNRECOGNIZED");
    }
}