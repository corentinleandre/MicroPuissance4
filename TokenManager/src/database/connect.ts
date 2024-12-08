import mongoose, { Mongoose, MongooseOptions } from "mongoose";

class MongooseConnection{

    uri : string;
    connected : boolean = false;
    client : Mongoose;

    constructor(uri : string, options?: mongoose.ConnectOptions){
        this.uri = uri;
        this.client = mongoose;
        this.client.connect(uri, options).then(() => {
            this.connected = true;
            /*
            console.log("connected to : " + this.client.connection.db.databaseName);
            console.log("connected using : " + this.client.connection.name);
            console.log("connected as : " + this.client.connection.user);
            console.log(this.client.connection.getClient());
            */
        });
    }

}

export { MongooseConnection }

