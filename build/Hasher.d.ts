export default class Hasher {
    private secretPepper;
    private workFactor;
    constructor({ secretPepper, workFactor }?: {
        secretPepper?: string;
        workFactor?: number;
    });
    hash(data: string): Promise<string>;
    compare(data: string, hash: string): Promise<boolean>;
    needsRegenerate(hash: string): boolean;
}
//# sourceMappingURL=Hasher.d.ts.map