import { Router } from 'express';
import { Document } from 'mongoose';
import { TagGroup } from '../models/Restaurant';

import TagsSchema, { getAllTagGroups } from '../mongoose/TagsSchema';

const buildRouter = (): Router => {
    const router: Router = Router();

    router.get('/', async (req, res) => {
          /*
            #swagger.tags = ['Tags']
            #swagger.description = 'Get all coolinary tags'
        */   
        try {
            const tagGroups: TagGroup[] = await getAllTagGroups();

            const tagNames: string[] = tagGroups.reduce((currTagNames: string[], currTagGroup: TagGroup) => {
                const currGroupTags = currTagGroup.tags.map(tag => tag.name)
                return [...currTagNames, ...currGroupTags]
            }, [])

            res.status(200).json(tagNames);
        } catch (error) {
            res.status(200).json([]);
        }
    })

    return router;
}

export default buildRouter;