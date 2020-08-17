
export class Deferred<T> implements Promise<T> {

    [Symbol.toStringTag]: "Deferred";
    private onFullfill: Array<(v: T) => void> = [];
    private onRejected: Array<(e: unknown) => void> = [];

    public resolve(value: T) {
        for (const handler of this.onFullfill) {
            handler(value);
        }
        this.onFullfill = [];
        this.onRejected = [];
    }

    public reject(err: unknown) {
        for (const handler of this.onRejected) {
            handler(err);
        }
        this.onFullfill = [];
        this.onRejected = [];
    }

    public promise(): Promise<T> {
        return new Promise((resolve, reject) => {
            this.onFullfill.push(resolve);
            this.onRejected.push(reject);
        });
    }

    public then<TResult1 = T, TResult2 = never>(
        onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, 
        onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>,
    ): Promise<TResult1 | TResult2> {
        return this.promise().then(onfulfilled, onrejected);
    }
    
    public catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<T | TResult> {
        return this.promise().catch(onrejected);
    }

    public finally(onfinally?: (() => void) | undefined | null): Promise<T> {
        return this.promise().finally(onfinally);
    }
}
