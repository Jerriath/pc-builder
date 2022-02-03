const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComponentSchema = new Schema(
    {
        name: { type: String, required: true, maxlength: 150 },
        description: { type: String, required: true, maxlength: 1000},
        price: { type: Number, required: true, min: 0 },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        manufacturer: { type: Schema.Types.ObjectId, ref: "Manufacturer", required: true },
        img: { type: String }
    }
)

// Virtual for component url 
ComponentSchema.virtual("url").get(function() {
    return `/catalog/component/${this._id}`;
})