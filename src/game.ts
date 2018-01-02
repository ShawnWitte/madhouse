/**
 * This class is part of the "Zorld of Wuul" application. 
 * "Zorld of Wuul" is a very simple, text based adventure game.  
 * 
 * Users can walk around some scenery. That's all. It should really be 
 * extended to make it more interesting!
 * 
 * To play this game, create an instance of this class and call the "play"
 * method.
 * 
 * This main class creates and initialises all the others: it creates all
 * rooms, creates the parser and starts the game.  It also evaluates and
 * executes the commands that the parser returns.
 * 
 * @author  Michael Kölling, David J. Barnes and Bugslayer
 * @version 2017.03.30
 */
class Game {
    parser : Parser;
    out : Printer;

    currentRoom : Room;

    allItems : Array<String> = [];

    isOn : boolean;

    /**
     * Create the game and initialise its internal map.
     */
    constructor(output: HTMLElement, input: HTMLInputElement) {
        this.parser = new Parser(this, input);
        this.out = new Printer(output);
        this.isOn = true;
        this.createRooms();
        this.printWelcome();
    }

    /**
     * Making all rooms and connecting them through doors
     */
    createRooms() : void {
        // creating Rooms
        let mainHall = new Room("You are in the main hall. It is dark, it's hard to see in here.");
        let restroom = new Room("You are in a restroom, it smells really bad in here, you don't know what it is.");
        let closet = new Room("You are in a closet, you see a key on the ground.");
        let livingRoom = new Room("You are in the living room, nothing seems unusual.");
        let dollRoom = new Room("You are the doll room, you see a lot of creepy dolls staring at you.");
        let paintingRoom = new Room("You are in some sort of painting room, the paintings look creepy.");
        let kitchen = new Room("You are in the Kitchen");
        let dogRoom = new Room("You are in the dog room, you see a vicious dog, you need to distract it with some food.");
        let backyard = new Room("You are in the backyard, you can almost smell the freedom");
        let freedom = new Room("You have successfully escaped the mad house, your heart is still pumping, but you're relieved. " +
            "Press F5 to play again");{
        };

        //Connecting doors
        mainHall.addDoor("north", new Door(livingRoom));
        mainHall.addDoor("east", new Door(closet));
        mainHall.addDoor("west", new Door(restroom));

        restroom.addDoor("east", new Door(mainHall));

        closet.addDoor("north", new Door(paintingRoom));
        closet.addDoor("west", new Door(mainHall));

        livingRoom.addDoor("north", new LockedDoorSledgehammer(kitchen));
        livingRoom.addDoor("east", new Door(paintingRoom));
        livingRoom.addDoor("south", new Door(mainHall));
        livingRoom.addDoor("west", new LockedDoorLockpick(kitchen));

        dollRoom.addDoor("east", new Door(livingRoom));

        paintingRoom.addDoor("south", new Door(closet));
        paintingRoom.addDoor("west", new Door(livingRoom));

        kitchen.addDoor("south", new Door(livingRoom));
        kitchen.addDoor("west", new LockedDoorToothpick(dogRoom));

        
        dogRoom.addDoor("north", new LockedDoorBaby(restroom));
        dogRoom.addDoor("east", new Door(backyard));
        

        backyard.addDoor("east", new LockedDoorKey(freedom));
        backyard.addDoor("south", new Door(dogRoom));


        //items
        kitchen.inventory = new Item("lockpick");
        closet.inventory = new Item("key");
        paintingRoom.inventory = new Item("sledgehammer");
        dollRoom.inventory = new Item("baby");
        mainHall.inventory = new Item("toothpick");

        // starting in main hall
        this.currentRoom = mainHall;
    }

    /**
     * Print out the opening message for the player.
     */
    printWelcome() : void {
        this.out.println();
        this.out.println("You heard a baby crying in an abandoned house");
        this.out.println("You've entered the house, but the door got locked behind you");
        this.out.println("You will need to find another way out.")
        this.out.println();
        this.out.println("What do you want to do?");
        this.out.println();
        this.out.println("" + this.currentRoom.description);
        this.out.println("There is a " + this.currentRoom.inventory.description + " here");
        this.out.print("Actions: ");
        this.out.println(this.currentRoom.getDoors().join(" "));
        this.out.print(">");
    }

    gameOver() : void {
        this.isOn = false;
        this.out.println("Thank you for playing.  Good bye.");
        this.out.println("Hit F5 to restart the game");
    }

    /**
     * Print out error message when user enters unknown command.
     * Here we print some erro message and a list of the 
     * command words.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    printError(params : string[]) : boolean {
        this.out.println("I don't know what you mean...");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help get show look");
        return false;
    }


    /**
     * Print out some help information.
     * Here we print some stupid, cryptic message and a list of the 
     * command words.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    printHelp(params : string[]) : boolean {
        debugger;

        if(params.length > 0) {
            this.out.println("Help what?");
            return false;
        }
        this.out.println("Try to escape from this prison");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help get show");
        return false;
    }

    /** 
     * Try to go in one direction. If there is an exit, enter
     * the new room, otherwise print an error message.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    goRoom(params : string[]) : boolean {
        if(params.length == 0) {
            // if there is no second word, we don't know where to go...
            this.out.println("Go where?");
            return;
        }

        let direction = params[0];

        // Try to leave current room.
        let door = this.currentRoom.getDoor(direction);

        try {
            door.enter(this.allItems);
        }
        catch (e) {
            if(e instanceof DoorLockedError) {
                this.out.println(e.message);
                return false;
            }
            throw e;
        }

        if (door == null) {
            this.out.println("There is no exit " + door + "!");
            return false;
        }

        this.currentRoom = door.exit;
        this.out.println("" + this.currentRoom.description);
        if (this.currentRoom.inventory == null) {
            this.out.println("There are no items in this room");
        }
        else {
            console.log(this.currentRoom);
            this.out.println("There is a " + this.currentRoom.inventory.description + " here");
        }
        this.out.print("Exits: ");
        this.out.println(this.currentRoom.getDoors().join(" "));


        return false;
    }


    getItem(params : string[]) : boolean {
        

        if(this.currentRoom.inventory == null){
            this.out.println("There are no item's. You can't get anything!");
            return;
        }

        if(params.length == 0) {
            // if there is no second word, we don't know where to go...
            this.out.println("Get what?");
            return;
        }

        let yourItem = params[0];

        let nextItem = null;
        switch (yourItem) {
            case("baby") :
            case("lockpick") :
            case("sledgehammer") :
            case("toothpick") :
            case("key") :
                this.allItems.push(this.currentRoom.inventory.description);
                this.currentRoom.inventory = null;
                break;
        }
        this.out.print("You picked up a " + this.allItems);
        this.out.println();

        console.log(this.allItems);
        return false;
    }

    showItem(params : string[]) : boolean {

        let allItems = params[0];

        if(this.allItems != null){
            this.out.print("You're items: " + this.allItems);
            this.out.println();
        }
        else {
            this.out.print("You don't have items");
            this.out.println();
        }
        console.log(this.allItems);
        return false;
    }

    lookRoom(params : string[]) : boolean {
        this.out.print(this.currentRoom.description);
        this.out.println();
        if (this.currentRoom.inventory == null) {
            this.out.println("There are no items in this room");
        }
        else {
            console.log(this.currentRoom);
            this.out.println("There is a " + this.currentRoom.inventory.description + " here");
        }
        this.out.print("Actions: ");
        this.out.println(this.currentRoom.getDoors().join(" "));
        return false;
    }


    /** 
     * "Quit" was entered. Check the rest of the command to see
     * whether we really quit the game.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    quit(params : string[]) : boolean {
        if(params.length > 0) {
            this.out.println("Quit what?");
            return false;
        }
        else {
            return true;  // signal that we want to quit
        }
    }
}