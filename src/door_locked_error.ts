class DoorLockedError extends Error {
    constructor(x: string) {
        super(x);

        (<any>this).__proto__ = DoorLockedError.prototype;
    }
}