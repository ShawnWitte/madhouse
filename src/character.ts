class Character{
    name: String;
    description: String;
    age: number;
    
    
    constructor(name: string, description: string, age: number){
        this.name = name;
        this.description = description;
        this.age = age;
    }

    greet(){
        return "Hello there, my name is " + this.name + " I am " + this.description + " and I am " + this.age + " years old";
    }
}