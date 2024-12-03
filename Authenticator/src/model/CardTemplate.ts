class CardTemplate{
    dbid: any = undefined;
    uid: string; //Unique
    name: string;
    baseValue: number;
    type: string;
    color: string;
    attributes: string[];
    tags: string[];
    description?: string | undefined;
    flavorText?: string | undefined;

    constructor(uid:string, name: string, baseValue: number, type: string, color: string, attributes: string[] = [], tags: string[] = [], description?: string, flavorText?: string){
        this.uid = uid;
        this.name = name;
        this.baseValue = baseValue;
        this.type = type;
        this.color = color;
        this.attributes = attributes
        this.tags = tags;
        this.description = description;
        this.flavorText = flavorText; 
    }

    rankScore(){
        switch (this.name) {
            case "Ace":
                return 14;
            case "K":
                return 13;
            case "D":
                return 12
            case "J":
                return 11;
            case "10":
                return 10;
            case "9":
                return 9;
            case "8":
                return 8;
            case "7":
                return 7;
            case "6":
                return 6;
            case "5":
                return 5;
            case "4":
                return 4;
            case "3":
                return 3;
            case "2":
                return 2;
            default:
                return 0;
        }
    }
}

export { CardTemplate }