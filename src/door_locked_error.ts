class DoorLockedError extends Error {
    constructor(m: string) {
        super(m);

        (<any>this).__proto__ = DoorLockedError.prototype;
    }
}