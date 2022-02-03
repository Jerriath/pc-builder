const mongoose = require("mongoose");

// Defining the Schema constructor
const Schema = mongoose.Schema;

// Defining the CategorySchema
const CategorySchema = new Schema(
    {
        name: { type: string, required: true },
        description: { type: string, required: true },

    }
);

//Virtual for the category's URL
CategorySchema.virtual("url").get( function () {
    return `/catalog/category/${this._id}`;
})

module.exports = mongoose.model("Category", CategorySchema);