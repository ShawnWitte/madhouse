class LockedDoorBaby extends Door {

    keys : Array<String> = ["baby"];

    enter(inventory : Array<String>) {
        let missingItems : Array<String> = [];

        for (let key of this.keys) {
            if (inventory.indexOf(key) < 0) {
                missingItems.push(key);
                continue;
            }
        }

        if (missingItems.length == 0) {
            return;
        }

        throw new DoorLockedError("You need " + missingItems.join(", ") + " to enter");
    }
}