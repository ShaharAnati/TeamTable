import * as express from "express";
import * as bodyParser from 'body-parser';

import { initLogger } from "./conf/Logger";
import BuildResourceRouter from './routers/ResourcesRouter';

const init = async (): Promise<void> => {
    const app: express.Application = express();

    await initLogger();
    app.use(bodyParser.json());

    app.use(BuildResourceRouter());

    app.listen( process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`)
    })
}

init();