import { FlattenMaps, model, Schema, Types } from "mongoose";
import { Token } from "../model/Token";
import { MongooseConnection } from "../database/connect";

interface IToken {
    user:string,
    value:string,
    createdAt:Date
}

const tokenSchema = new Schema<IToken>({
    user: {type: String, required: true, index: {unique: true, sparse: false}},
    createdAt: {type: Date, index: {expires: '2m'}, required:true}
})

const TokenModel = model<IToken>('Token', tokenSchema);
type TokenReturn = FlattenMaps<IToken> & { _id : Types.ObjectId};

class DAOToken{
    connection: MongooseConnection;
    tokenSchema: Schema<IToken> = tokenSchema;
    TokenModel = TokenModel;

    constructor(connection: MongooseConnection){
        this.connection = connection;
    }

    async saveToken(token:Token){
        //upsert version - haha won't work, way too unreliable
        let dbToken = await TokenModel.findOne({user: token.user}).exec();
        if(dbToken){
            dbToken.user = token.user;
            dbToken.createdAt = new Date(Date.now());
            dbToken = await dbToken.save();
            token.dbid = dbToken._id;
            return token;
        }
        dbToken = await new TokenModel({
            user: token.user,
            createdAt: new Date(Date.now())
        }).save();
        token.dbid = dbToken._id;
        return token;
    }

    async getTokenByUser(user: string){
        let query = TokenModel.findOne({user: user}).lean();

        const tokenReturn = await query.exec();
        if (tokenReturn) {
            return this.DBTokenToToken(tokenReturn);
        } else {
            return null;
        }
    }

    async getTokenByDBID(dbid : any){
        let query = TokenModel.findById(dbid).lean();

        const tokenReturn = await query.exec();
        if (tokenReturn) {
            return this.DBTokenToToken(tokenReturn);
        } else {
            return null;
        }
    }

    static create(conn:MongooseConnection):Promise<DAOToken>{

        return new Promise((resolves, rejects) => {
            conn.client.connection.asPromise().then(()=> {
                resolves(new DAOToken(conn));
            }).catch((err) => {
                rejects(err);
            })
        });
    }

    private async DBTokenToToken(dbtoken:TokenReturn){
        let retToken = new Token(dbtoken.user);
        retToken.dbid = dbtoken._id;
        return retToken;
    }

    
}

export { DAOToken, IToken }