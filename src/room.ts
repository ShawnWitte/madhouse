/**
 * Class Room - a room in an adventure game.
 *
 * This class is part of the "Zorld of Wuul" application. 
 * "Zorld of Wuul" is a very simple, text based adventure game.  
 *
 * A "Room" represents one location in the scenery of the game.  It is 
 * connected to other rooms via doors.  The doors are labelled north,
 * east, south, west.  For each direction, the room stores a reference
 * to the neighboring room, or null if there is no exit in that direction.
 * 
 * @author  Michael Kölling, David J. Barnes and Bugslayer
 * @version 2017.03.30
 */
class Room {
    description : string;
    doors: { [key: string]: Door; } = {};

    inventory : Item;
    /**
     * Create a room described "description". Initially, it has
     * no doors. "description" is something like "a kitchen" or
     * "an open court yard".
     * @param description The room's description.a
     */
    constructor(description : string) {
        this.description = description;
    }

    /**
     * Define the doors of this room.  Every direction either leads
     * to another room or is null (no exit there).
     * @param north The north exit.
     * @param east The east east.
     * @param south The south exit.
     * @param west The west exit.
     */
    setDoors(north : Room, east : Room, south : Room, west : Room) : void {
        if(north != null) {
            this.addDoor("north", new Door(north));
        }
        if(east != null) {
            this.addDoor("east", new Door(east));
        }
        if(south != null) {
            this.addDoor("south", new Door(south));
        }
        if(west != null) {
            this.addDoor("west", new Door(west));
        }
    }

    addDoor(alias : string, exit : Door) {
        this.doors[alias] = exit;
    }

    getDoors() : Array<string> {
        return Object.keys(this.doors);
    }

    getDoor(alias : string) : Door {
       return this.doors[alias];
    }

}

