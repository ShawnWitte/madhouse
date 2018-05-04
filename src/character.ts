class Character{
    name: String;
    description: String;
    age: number;
    isEvil: boolean;
    
    
    constructor(name: string, description: string, age: number, isEvil: boolean){
        this.name = name;
        this.description = description;
        this.age = age;
        this.isEvil = isEvil;
    }

    greet(){
        var tekst = '"Hello there, my name is ' + this.name + ' I am ' + this.description + ' and I am ' + this.age + ' years old." <br/>';
        if(this.isEvil){
            return tekst + "Watch out, he's evil!"
        }
        else{
            return tekst + "Don't worry, he's a good guy. <br/>"
        }
    }

    roar(){
        
    }
}

class Enemy extends Character{
   
    constructor(name: string, description: string, age: number, isEvil: boolean){
        super(name, description, age, isEvil);
    }

    greet(){
        return super.greet();
    }

    roar(){
        return '"RAAAAWR!!!" <br/>';
    }
}

class Ally extends Character{

    constructor(name: string, description: string, age: number, isEvil: boolean){
        super(name, description, age, isEvil);
    }

    greet(){
        return super.greet();
    }

    roar(){
        return '"HiiiiiiI!" <br/>';
    }

    support(){
        return "You can do it!";
    }
}