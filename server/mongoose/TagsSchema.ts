import mongoose from "mongoose";
import { Document } from 'mongoose';
import { TagGroup } from '../models/Restaurant';

const tagsSchema = new mongoose.Schema({
    tagGroupId: { type: String },
    tagGroupame: { type: String },
    constraintLevel: { type: Number },
    tags: [{ type: {id: String, name: String}}]
});

const schema: any = mongoose.model("tags", tagsSchema);

export const getAllTagGroups = async (): Promise<TagGroup[]> => {
    return ((await schema.find({})) as Document[]).map(tagGroup => tagGroup.toObject());
}

export default schema;