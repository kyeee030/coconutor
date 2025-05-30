export default class BerlinNoise {

    private seed: number;

    constructor(seed: number = -1) {
        if (seed < 0) {
            seed = Math.floor(Math.random() * 1000000); // Generate a random seed if not provided
        }
    }

    setSeed(seed: number): void {
        this.seed = seed;
    }

    getSeed(): number {
        return this.seed;
    }

    noise1D(x: number): number {
        const noise = null;
        return noise;
    }

    noise2D(x: number, y: number): number {
        const noise = null;
        return noise;
    }
}