class Enemy extends Character{
   
    constructor(name: string, description: string, age: number){
        super(name, description, age);
    }

    greet(){
        return super.greet();
    }
}

