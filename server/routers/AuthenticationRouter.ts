import { Router } from 'express';

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get('/validate', async (req, res) => {
        res.sendStatus(200);
    })

    return router;
}

export default buildRouter;