
export class ConflictError extends Error {
    constructor(msg?: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}