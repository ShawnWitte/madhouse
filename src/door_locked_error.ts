class DoorLockedError extends Error {
    constructor(m: string) {
        super(m);

        // Set the prototype explicitly. If you skip this, iinstanceof will not work :-(
        (<any>this).__proto__ = DoorLockedError.prototype;
    }
}