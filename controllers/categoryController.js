// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const mongoose = require("mongoose");
const async = require("async");
const { body, validationResults } = require("express-validator");

exports.category_list = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.category_detail = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel(
        {
            category: function (callback) {
                Category.findById(req.params.id).exec(callback);
            },
            components: function (callback) {
                Component.find({ category: req.params.id})
                    .populate("category")
                    .populate("manufacturer")
                    .exec(callback);
            }
        },
        function (err, results) {
            if (err) { return next(err) }
            if (results.category == null) {
                let err = new Error("Category not found");
                err.status = 404;
                return next(err);
            }
            res.render("category_detail", {
                category: results.category,
                components: results.components
            })
        }
    )
}

exports.category_create_get = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.category_create_post = function(req, res) {
    res,send("NOT IMPLETMENTED YET");
}

exports.category_delete_get = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.category_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.category_update_get = function(req, res) {
    res.send("NOT IMPLEMEMENTED YET");
}

exports.category_update_post = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}
