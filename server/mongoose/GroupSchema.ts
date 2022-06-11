const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    id: { type: String },
    creator: { type: String },
    name: { type: String },
    members: [{ username: { type: String }, active: { type: Boolean } }],
    filters: {
        tags: { type: [String] },
        hour: { type: String },
        day: { type: String },
        priceRange: [{ type: Number }]
    }
}, {
    timestamps: true
});

const schema: any = mongoose.model("groups", groupSchema);

export default schema;