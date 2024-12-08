import { FlattenMaps, model, Schema, Types } from "mongoose";
import { User } from "../model/User";
import { MongooseConnection } from "../database/connect";

interface IUser {
    uid:string,
    password:string,
    token:string
}

const userSchema = new Schema<IUser>({
    uid: {type: String, required: true, index: {unique: true, sparse: false}},
    password: {type: String, required: true},
    token: {type:String, index: {}}
})

const UserModel = model<IUser>('User', userSchema);
type UserReturn = FlattenMaps<IUser> & { _id : Types.ObjectId};

class DAOUser{
    connection: MongooseConnection;
    userSchema: Schema<IUser> = userSchema;
    UserModel = UserModel;

    constructor(connection: MongooseConnection){
        this.connection = connection;
    }

    async saveUser(user:User){
        //upsert version - haha won't work, way too unreliable
        let dbUser = await UserModel.findOne({uid: user.uid}).exec();
        if(dbUser){
            dbUser.uid = user.uid;
            dbUser.password = user.password;
            if(user.token){
                dbUser.token = user.token;
            }
            dbUser = await dbUser.save();
            user.dbid = dbUser._id;
            return user;
        }
        dbUser = await new UserModel({
            uid: user.uid,
            password: user.password,
            token: user.token
        }).save();
        user.dbid = dbUser._id;
        return user;
    }

    async getUserByUID(uid: string){
        let query = UserModel.findOne({uid: uid}).lean();

        const userReturn = await query.exec();
        if (userReturn) {
            return this.DBUserToUser(userReturn);
        } else {
            return null;
        }
    }

    async getuserByDBID(dbid : any){
        let query = UserModel.findById(dbid).lean();

        const userReturn = await query.exec();
        if (userReturn) {
            return this.DBUserToUser(userReturn);
        } else {
            return null;
        }
    }

    static create(conn:MongooseConnection):Promise<DAOUser>{

        return new Promise((resolves, rejects) => {
            conn.client.connection.asPromise().then(()=> {
                resolves(new DAOUser(conn));
            }).catch((err) => {
                rejects(err);
            })
        });
    }

    private async DBUserToUser(dbuser:UserReturn){
        let retUser = new User(dbuser.uid, 
            dbuser.password
        );
        retUser.dbid = dbuser._id;
        retUser.token = dbuser.token;
        return retUser;
    }

    
}

export { DAOUser, IUser }