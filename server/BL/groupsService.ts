import { Group } from '../models/Group';
import GroupSchema from '../mongoose/GroupSchema';


export const updateGroup = async (id: string, group: Group) => {
    try {
        const a = await GroupSchema.updateOne({ id: id }, { ...group });
        console.log(a);
    } catch (error) {
        console.error(error);
    }
}