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
import {logger} from '@/lib/winston'

const app = express();

const corsOptions:CorsOptions = {
    origin(origin,callback){
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        }else{
            const errorMessage = `CORS error: ${origin} is not allowed by CORS`;
            logger.error(errorMessage);
            callback(new Error(errorMessage),false);
        }
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
           logger.info(`server running http://localhost:${config.PORT}`);
        });

    }catch(err){
        logger.error('Failed to start server:', err);

        if(config.NODE_ENV === "production"){
            process.exit(1); // Exit the process with failure
        }
    }
})();   

const handleServerShutdown = async () => {
    try{
        await disconnectFromDatabase();
        logger.warn("SHUTTING DOWN SERVER...");
        process.exit(0); // Exit the process gracefully
    }catch(err){
        logger.error("Error during server shutdown:", err);
    }


}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
