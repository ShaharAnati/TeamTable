import { Group, GroupLikedRestaurants, GroupUser } from '../models/Group';
import GroupSchema from '../mongoose/GroupSchema';
import {getLikedRestaurantsByUserIds} from '../mongoose/UserSchema';

export const getAllGroups = async () => {
    try {
        const a = await GroupSchema.find().lean();
        return a;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const updateGroup = async (id: string, group: Group) => {
    try {
        const a = await GroupSchema.updateOne({ id: id }, { ...group });
    } catch (error) {
        console.error(error);
    }
}

export const getGroupLikedRestaurants = async (groupUsers: GroupUser[]): Promise<GroupLikedRestaurants> => {
    try {
     const activeUsersIds: string[] = groupUsers.filter(user => user.active === true).map(user => user.username);

        return await getLikedRestaurantsByUserIds(activeUsersIds);
    } catch (error) {
        console.error(error);
        throw error;
    }
}