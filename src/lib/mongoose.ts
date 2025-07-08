import mongoose from 'mongoose';

import config from '@/config';

import type {ConnectOptions} from 'mongoose'

const clientOptions:ConnectOptions ={
    dbName:'blogapi',
    appName:'blogAPI',
    serverApi:{
        version:'1',
        strict:true,
        deprecationErrors:true
    }
}

export const connectToDatabase =async (): Promise<void> =>{
    if(!config.MONGO_URI){
        throw new Error("MongoDB uri is not defined in the configuration")
    }
    try{
        await mongoose.connect(config.MONGO_URI,clientOptions);
        console.log('Connected to the Database Successfully...',{
            uri:config.MONGO_URI,
            options:clientOptions
        })
    }catch(err){
        if(err instanceof Error){
            console.log('Error Connecting to the Database',err)
        }
    }
}

export const disconnectFromDatabase=async (): Promise<void> =>{
    try{
        await mongoose.disconnect();
        console.log('Disconnected from the database successfully.',{
            uri:config.MONGO_URI,
            options:clientOptions
        })
    }catch(err){
        if(err instanceof Error){
            throw new Error(err.message)
        }
        console.log('Error disconnecting from the database',err)
    }
}