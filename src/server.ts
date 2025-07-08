import  express from 'express';
import config from '@/config';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from '@/lib/express-rate-limit';
import v1Routes from '@/routes/v1';
import {connectToDatabase,disconnectFromDatabase} from '@/lib/mongoose'

const app = express();

const corsOptions:CorsOptions = {
    origin(origin,callback){
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        }else{
            callback(new Error(`CORS error: ${origin} is not allowed by CORS`),false);
        }
        console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
    compression({
        threshold:1024,
    }),
);

app.use(helmet());

app.use(limiter);

(async () => {
    try{
        await connectToDatabase();
        app.use('/api/v1', v1Routes);
        app.listen(config.PORT,()=>{
            console.log(`server running http://localhost:${config.PORT}`);
        });

    }catch(err){
        console.log('Failed to start server:', err);

        if(config.NODE_ENV === "production"){
            process.exit(1); // Exit the process with failure
        }
    }
})();   

const handleServerShutdown = async () => {
    try{
        await disconnectFromDatabase();
        console.log("SHUTTING DOWN SERVER...");
        process.exit(0); // Exit the process gracefully
    }catch(err){
        console.log("Error during server shutdown:", err);
    }


}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
