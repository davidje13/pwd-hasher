export default class Hasher {
    private secretPepper;
    private workFactor;
    constructor({ secretPepper, workFactor }?: {
        secretPepper?: string | undefined;
        workFactor?: number | undefined;
    });
    hash(data: string): Promise<string>;
    compare(data: string, hash: string): Promise<boolean>;
    needsRegenerate(hash: string): boolean;
}
