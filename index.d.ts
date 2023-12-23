declare module 'pwd-hasher' {
  export class Hasher {
    constructor(options?: { secretPepper?: string; workFactor?: number });

    async hash(data: string): Promise<string>;
    async compare(data: string, hash: string): Promise<boolean>;
    needsRegenerate(hash: string): boolean;
  }
}
