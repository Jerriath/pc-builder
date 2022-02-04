const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true }
    }
)

// Virtual for manufacturer's URL
ManufacturerSchema.virtual("url").get(function() {
    return `/catalog/manufacturer/${this._id}`;
})

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);