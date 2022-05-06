import { Router } from 'express';
import { uuid } from 'uuidv4';

import GroupSchema from '../mongoose/GroupSchema';

const buildRouter = (): Router => {
    const router: Router = Router();

    router.post('/', async (req, res) => {
        try {
            const {creator, name} = req.body;

            const newGroup = await GroupSchema.create({
                id: uuid(),
                creator,
                name
            })

            res.status(201).json(newGroup);
        } catch (error) {

        }
    })

    return router;
}

export default buildRouter;