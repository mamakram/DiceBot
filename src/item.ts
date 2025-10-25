export class Item{
    name:string
    description:string=""
    constructor(name:string,description:string=""){
        this.name=name;
        this.description=description
    }
    getName(){
        return this.name
    }
    getDescription(){
        return this.description
    }
}