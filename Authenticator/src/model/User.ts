class User {
    dbid: any = undefined;
    uid: string; //Unique
    password: string;

    constructor(uid:string, password:string){
        this.uid = uid;
        this.password = password;
    }
}

export { User }