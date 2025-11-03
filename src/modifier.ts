<<<<<<< HEAD
/**
 * Stat Modifier
 * name:name of Stat modified
 * value:number
 * conditional: modifier depends on a specific condition
 */
export class Modifier {
  _name: string; //stat name
  _value: number;

  constructor(name: string, value: number) {
    this._name = name;
    this._value = value;
  }

  get name(): string {
    return this._name;
  }
  get value(): number {
    return this._value;
  }
}
=======
export class Modifier{
    name:string //stat name
    value:number
    conditional:Boolean

    constructor(name:string,value:number,conditional:Boolean=false){
        this.name = name;
        this.value = value
        this.conditional=conditional
    }

    getName():string{
        return this.name
    }
    getValue():number{
        return this.value
    }
    isConditional():Boolean{
        return this.conditional
    }
}
>>>>>>> main
