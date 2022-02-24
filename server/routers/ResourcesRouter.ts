import * as express from 'express';
import * as path from 'path';
import { Router } from 'express';


const buildRouter = (): Router => {
    const router: Router = Router();

    router.use('/', express.static(path.resolve(__dirname, '../../client/build')));
    router.get('/', (req, res) => {
        res.redirect('/index.html');
    })
    return router;
} 

export default buildRouter;

