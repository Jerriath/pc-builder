// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const mongoose = require("mongoose");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.category_list = function(req, res) {
    
    Category.find({}).exec(function (err, categories) {
        if (err) return next(err);
        res.render("category_list", {
            title: "Category List",
            categories: categories
        });
    })

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
    res.render("category_form", { title: "Add a category", isUpdating: false });
}

exports.category_create_post = [
    body("name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Must provide a category name"),
    body("description").optional({checkfalsy: true}),
    (req, res, next) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           res.render("category_form", {
               title: "Add a category",
               category: req.body,
               isUpdating: false,
               errors: errors.array()
           })
           return;
       } 
       else {
           let category = new Category({
               name: req.body.name,
               description: req.body.description
           });
           category.save(function (err) {
               if (err) {return next(err)}
               res.redirect(category.url);
           })
       }
    }
]

exports.category_delete_get = function(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel(
        {
            category: function(callback) {
                Category.findById(req.params.id).exec(callback)
            },
            components: function(callback) {
                Component.find({category: req.params.id}).exec(callback)
            }
        },
        function (err, results) {
            if (err) { return next(err) }
            if (results.category == null) {
                let error = new Error("Category not found");
                error.status = 404;
                return (next(error));
            }
            let msg = "";
            if (results.components.length > 0) {
                msg = "You cannot delete this category unless you delete these components first. Click on a component to go to it's page."                
            }
            else {
                msg = "Are you sure you want to delete this Category? "
            }
            res.render("category_delete", {
                category: results.category,
                components: results.components,
                msg: msg
            })
        }
    )
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
