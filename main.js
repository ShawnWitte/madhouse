var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DoorLockedError = (function (_super) {
    __extends(DoorLockedError, _super);
    function DoorLockedError(m) {
        var _this = _super.call(this, m) || this;
        _this.__proto__ = DoorLockedError.prototype;
        return _this;
    }
    return DoorLockedError;
}(Error));
var Door = (function () {
    function Door(exit) {
        this.exit = exit;
    }
    Door.prototype.enter = function (inventor) {
    };
    return Door;
}());
var Game = (function () {
    function Game(output, input) {
        this.allItems = [];
        this.parser = new Parser(this, input);
        this.out = new Printer(output);
        this.isOn = true;
        this.createRooms();
        this.printWelcome();
    }
    Game.prototype.createRooms = function () {
        var mainHall = new Room("You are in the main hall. It is dark, it's hard to see in here.");
        var restroom = new Room("You are in a restroom, it smells really bad in here.");
        var closet = new Room("You are in a closet, you see a key on the ground.");
        var livingRoom = new Room("You are in the living room, nothing seems unusual.");
        var dollRoom = new Room("You are the doll room, you see a lot of creepy dolls staring at you.");
        var paintingRoom = new Room("You are in some sort of painting room.");
        var kitchen = new Room("You are in the Kitchen");
        var dogRoom = new Room("You are in the dog room, you see a vicious dog, you need to distract it with some food.");
        var backyard = new Room("You are in the backyard, you can almost smell the freedom");
        var freedom = new Room("You have successfully escaped the mad house, your heart is still pumping, but you're relieved. " +
            "Press F5 to play again");
        {
        }
        ;
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
        kitchen.inventory = new Item("lockpick");
        closet.inventory = new Item("key");
        paintingRoom.inventory = new Item("sledgehammer");
        dollRoom.inventory = new Item("baby");
        mainHall.inventory = new Item("toothpic");
        this.currentRoom = mainHall;
    };
    Game.prototype.printWelcome = function () {
        this.out.println();
        this.out.println("You heard a baby crying in an abandoned house");
        this.out.println("You've entered the house, but the door got locked behind you");
        this.out.println("You will need to find another way out.");
        this.out.println();
        this.out.println("What do you want to do?");
        this.out.println();
        this.out.println("" + this.currentRoom.description);
        this.out.println("There is a " + this.currentRoom.inventory.description + " here");
        this.out.print("Actions: ");
        this.out.println(this.currentRoom.getDoors().join(" "));
        this.out.print(">");
    };
    Game.prototype.gameOver = function () {
        this.isOn = false;
        this.out.println("Thank you for playing.  Good bye.");
        this.out.println("Hit F5 to restart the game");
    };
    Game.prototype.printError = function (params) {
        this.out.println("I don't know what you mean...");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help get show look");
        return false;
    };
    Game.prototype.printHelp = function (params) {
        debugger;
        if (params.length > 0) {
            this.out.println("Help what?");
            return false;
        }
        this.out.println("Try to escape from this prison");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help get show");
        return false;
    };
    Game.prototype.goRoom = function (params) {
        if (params.length == 0) {
            this.out.println("Go where?");
            return;
        }
        var direction = params[0];
        var door = this.currentRoom.getDoor(direction);
        try {
            door.enter(this.allItems);
        }
        catch (e) {
            if (e instanceof DoorLockedError) {
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
    };
    Game.prototype.getItem = function (params) {
        if (this.currentRoom.inventory == null) {
            this.out.println("There are no item's. You can't get anything!");
            return;
        }
        if (params.length == 0) {
            this.out.println("Get what?");
            return;
        }
        var yourItem = params[0];
        var nextItem = null;
        switch (yourItem) {
            case ("baby"):
            case ("lockpick"):
            case ("sledgehammer"):
            case ("toothpick"):
            case ("key"):
                this.allItems.push(this.currentRoom.inventory.description);
                this.currentRoom.inventory = null;
                break;
        }
        this.out.print("You picked up a " + this.allItems);
        this.out.println();
        console.log(this.allItems);
        return false;
    };
    Game.prototype.showItem = function (params) {
        var allItems = params[0];
        if (this.allItems != null) {
            this.out.print("You're items: " + this.allItems);
            this.out.println();
        }
        else {
            this.out.print("You don't have items");
            this.out.println();
        }
        console.log(this.allItems);
        return false;
    };
    Game.prototype.lookRoom = function (params) {
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
    };
    Game.prototype.quit = function (params) {
        if (params.length > 0) {
            this.out.println("Quit what?");
            return false;
        }
        else {
            return true;
        }
    };
    return Game;
}());
var Item = (function () {
    function Item(description) {
        this.description = description;
    }
    return Item;
}());
var LockedDoorBaby = (function (_super) {
    __extends(LockedDoorBaby, _super);
    function LockedDoorBaby() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = ["baby"];
        return _this;
    }
    LockedDoorBaby.prototype.enter = function (inventory) {
        var missingItems = [];
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (inventory.indexOf(key) < 0) {
                missingItems.push(key);
                continue;
            }
        }
        if (missingItems.length == 0) {
            return;
        }
        throw new DoorLockedError("You need " + missingItems.join(", ") + " to enter");
    };
    return LockedDoorBaby;
}(Door));
var LockedDoorKey = (function (_super) {
    __extends(LockedDoorKey, _super);
    function LockedDoorKey() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = ["key"];
        return _this;
    }
    LockedDoorKey.prototype.enter = function (inventory) {
        var missingItems = [];
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (inventory.indexOf(key) < 0) {
                missingItems.push(key);
                continue;
            }
        }
        if (missingItems.length == 0) {
            return;
        }
        throw new DoorLockedError("You need " + missingItems.join(", ") + " to enter");
    };
    return LockedDoorKey;
}(Door));
var LockedDoorLockpick = (function (_super) {
    __extends(LockedDoorLockpick, _super);
    function LockedDoorLockpick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = ["lockpick"];
        return _this;
    }
    LockedDoorLockpick.prototype.enter = function (inventory) {
        var missingItems = [];
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (inventory.indexOf(key) < 0) {
                missingItems.push(key);
                continue;
            }
        }
        if (missingItems.length == 0) {
            return;
        }
        throw new DoorLockedError("You need " + missingItems.join(", ") + " to enter");
    };
    return LockedDoorLockpick;
}(Door));
var LockedDoorSledgehammer = (function (_super) {
    __extends(LockedDoorSledgehammer, _super);
    function LockedDoorSledgehammer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = ["sledgehammer"];
        return _this;
    }
    LockedDoorSledgehammer.prototype.enter = function (inventory) {
        var missingItems = [];
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (inventory.indexOf(key) < 0) {
                missingItems.push(key);
                continue;
            }
        }
        if (missingItems.length == 0) {
            return;
        }
        throw new DoorLockedError("You need " + missingItems.join(", ") + " to enter");
    };
    return LockedDoorSledgehammer;
}(Door));
var LockedDoorToothpick = (function (_super) {
    __extends(LockedDoorToothpick, _super);
    function LockedDoorToothpick() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keys = ["toothpick"];
        return _this;
    }
    LockedDoorToothpick.prototype.enter = function (inventory) {
        var missingItems = [];
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (inventory.indexOf(key) < 0) {
                missingItems.push(key);
                continue;
            }
        }
        if (missingItems.length == 0) {
            return;
        }
        throw new DoorLockedError("You need " + missingItems.join(", ") + " to enter");
    };
    return LockedDoorToothpick;
}(Door));
var Parser = (function () {
    function Parser(game, input) {
        var _this = this;
        this.game = game;
        this.input = input;
        input.onkeyup = function (e) {
            if (e.keyCode == 13 && _this.game.isOn) {
                var command = _this.input.value;
                _this.game.out.println(command);
                _this.parse(command.split(" "));
                _this.input.value = "";
                _this.game.out.print(">");
            }
        };
    }
    Parser.prototype.parse = function (words) {
        var wantToQuit = false;
        var params = words.slice(1);
        switch (words[0]) {
            case "":
                break;
            case "help":
                wantToQuit = this.game.printHelp(params);
                break;
            case "go":
                wantToQuit = this.game.goRoom(params);
                break;
            case "quit":
                wantToQuit = this.game.quit(params);
                break;
            case "get":
                wantToQuit = this.game.getItem(params);
                break;
            case "show":
                wantToQuit = this.game.showItem(params);
                break;
            case "look":
                wantToQuit = this.game.lookRoom(params);
                break;
            default:
                wantToQuit = this.game.printError(params);
        }
        if (wantToQuit) {
            this.input.disabled = true;
            this.game.gameOver();
        }
    };
    return Parser;
}());
var Printer = (function () {
    function Printer(output) {
        this.output = output;
    }
    Printer.prototype.print = function (text) {
        this.output.innerHTML += text;
    };
    Printer.prototype.println = function (text) {
        if (text === void 0) { text = ""; }
        this.print(text + "<br/>");
        this.output.scrollTop = this.output.scrollHeight;
    };
    return Printer;
}());
var Room = (function () {
    function Room(description) {
        this.doors = {};
        this.description = description;
    }
    Room.prototype.setDoors = function (north, east, south, west) {
        if (north != null) {
            this.addDoor("north", new Door(north));
        }
        if (east != null) {
            this.addDoor("east", new Door(east));
        }
        if (south != null) {
            this.addDoor("south", new Door(south));
        }
        if (west != null) {
            this.addDoor("west", new Door(west));
        }
    };
    Room.prototype.addDoor = function (alias, exit) {
        this.doors[alias] = exit;
    };
    Room.prototype.getDoors = function () {
        return Object.keys(this.doors);
    };
    Room.prototype.getDoor = function (alias) {
        return this.doors[alias];
    };
    return Room;
}());
