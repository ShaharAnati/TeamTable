const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    id: { type: String },
    creator: { type: String },
    name: { type: String }
});

const schema: any = mongoose.model("groups", groupSchema);

export default schema;