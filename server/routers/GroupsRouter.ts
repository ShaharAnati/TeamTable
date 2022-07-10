import { Router } from 'express';
import { uuid } from 'uuidv4';
import { withAuth } from '../middlewares/auth';

import GroupSchema from '../mongoose/GroupSchema';

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get('/', async (req, res) => {
         /*
            #swagger.tags = ['Group']
            #swagger.description = 'Get all user's groups'
        */       
        const username = req.query.username;
        if (!username) {
            return res.status(400).send();
        }

        const groups = await GroupSchema.find({ "members.username": username }).lean();
        return res.send(groups);
    })

    router.get('/recent', async (req, res) => {
         /*
            #swagger.tags = ['Group']
            #swagger.description = 'Get all user's groups with recent activity'
        */     
        const username = req.query.username;
        if (!username) {
            return res.status(400).send();
        }

        const groups = await GroupSchema.find({ "members.username": username }).lean();

        const membersHasActivity = (members: any[]) => members.filter((member) => member.username !== username && member.active).length > 0;

        const groupsWithActivity = groups.filter((group: any) => membersHasActivity(group.members));

        return res.send(groupsWithActivity);
    })

    router.get('/get/:id', async (req, res) => {
         /*
            #swagger.tags = ['Group']
            #swagger.description = 'Get group by id'
        */     
        const id = req.params.id;
        GroupSchema.findOne({ id }).lean().exec(function (err: any, group: any) {
            return res.end(JSON.stringify(group));
        });
    })

    router.post('/', withAuth, async (req, res) => {
        /*
            #swagger.tags = ['Group']
            #swagger.description = 'Create new group'
        */     
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

    return router;
}

export default buildRouter;