class Token {
    dbid: any = undefined;
    user: string;

    constructor(user:string){
        this.user = user;
    }
}

export { Token }