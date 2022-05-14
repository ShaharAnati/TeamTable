import {Router} from 'express';
import {uuid} from 'uuidv4';

import GroupSchema from '../mongoose/GroupSchema';
import groupSchema from '../mongoose/GroupSchema';
import {Server} from "ws";

const buildRouter = (ioServer: Server): Router => {
    const router: Router = Router();

    router.get('/get/:id', async (req, res) => {

        const id = req.params.id;
        groupSchema.findOne({id}).lean().exec(function (err: any, users: any) {
            return res.end(JSON.stringify(users));
        });
    })

    router.post('/', async (req, res) => {
        try {
            const {creator, name, members, filters} = req.body;

            const newGroup = await GroupSchema.create({
                id: uuid(),
                creator,
                name,
                members,
                filters
            })

            /*ioServer.on('connectedToScreen', socket =>
            {
                socket.join(newGroup.id);
                // and then later
                socket.to(newGroup.id).emit("hi");
            });*/

            res.status(201).json(newGroup);
        } catch (error) {

        }
    })

    router.put('/update/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const body = req.body.group;
            groupSchema.updateOne({id: id}, {members: req.body.group.members}).lean().exec(function () {
                ioServer.emit('updateClient', body);
                return res.status(201);
            });
        } catch (error) {

        }
    })

    return router;
}

export default buildRouter;