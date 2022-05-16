import { Router } from 'express';
import { uuid } from 'uuidv4';

import GroupSchema from '../mongoose/GroupSchema';
import groupSchema from '../mongoose/GroupSchema';
import { Server } from "ws";

const buildRouter = (ioServer: Server): Router => {
    const router: Router = Router();

    router.get('/get/:id', async (req, res) => {

        const id = req.params.id;
        groupSchema.findOne({ id }).lean().exec(function (err: any, group: any) {
            return res.end(JSON.stringify(group));
        });
    })

    router.post('/', async (req, res) => {
        try {
            const { creator, name, members, filters } = req.body;

            const newGroup = await GroupSchema.create({
                id: uuid(),
                creator,
                name,
                members,
                filters
            })

            res.status(201).json(newGroup);
        } catch (error) {
            console.log(error);
        }
    })

    router.put('/update/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const group = req.body.group;
            const { members, filters } = group;

            groupSchema.updateOne({ id: id }, { members, filters }).lean().exec(function () {
                ioServer.emit('updateClient', group);
                return res.status(201);
            });
        } catch (error) {
            console.log(error);
        }
    })

    return router;
}

export default buildRouter;