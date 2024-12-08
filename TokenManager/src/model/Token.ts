class Token {
    dbid: any = undefined;
    user: string;
    value: string | undefined;

    constructor(user:string){
        this.user = user;
    }
}

export { Token }