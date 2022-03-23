// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.manufacturer_list = function(req, res) {

    Manufacturer.find({}).exec(function (err, manufacturers) {
        if (err) return next(err);
        res.render("manufacturer_list", {
            title: "Manufacturer List",
            manufacturers: manufacturers
        });
    })

}

exports.manufacturer_detail = function(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel(
        {
            manufacturer: function (callback) {
                Manufacturer.findById(req.params.id).exec(callback);
            },
            components: function (callback) {
                Component.find({ manufacturer: req.params.id})
                    .populate("category")
                    .exec(callback);
            }
        },
        function (err, results) {
            if (err) { return next(err) }
            if (results.manufacturer == null) {
                let err = new Error("Manufacturer not found");
                err.status = 404;
                return next(err);
            }
            res.render("manufacturer_detail", {
                manufacturer: results.manufacturer,
                components: results.components
            })
        }
    )
}

exports.manufacturer_create_get = function(req, res) {
    res.render("manufacturer_form", { title: "Add a manufacturer", isUpdating: false });
}

exports.manufacturer_create_post = [
    body("name")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Must provide a manufacturer name"),
    body("description").optional({checkfalsy: true}),
    (req, res, next) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           res.render("manufacturer_form", {
               title: "Add a manufacturer",
               manufacturer: req.body,
               isUpdating: false,
               errors: errors.array()
           })
           return;
       } 
       else {
           let manufacturer = new Manufacturer({
               name: req.body.name,
               description: req.body.description
           });
           manufacturer.save(function (err) {
               if (err) {return next(err)}
               res.redirect(manufacturer.url);
           })
       }
    }
]

exports.manufacturer_delete_get = function(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }
    async.parallel(
        {
            manufacturer: function(callback) {
                Manufacturer.findById(req.params.id).exec(callback)
            },
            components: function(callback) {
                Component.find({manufacturer: req.params.id}).exec(callback)
            }
        },
        function (err, results) {
            if (err) { return next(err) }
            if (results.manufacturer == null) {
                let error = new Error("Manufacturer not found");
                error.status = 404;
                return (next(error));
            }
            let msg = "";
            if (results.components.length > 0) {
                msg = "You cannot delete this manufacturer unless you delete these components first. Click on the component to go to it's page."                
            }
            else {
                msg = "Are you sure you want to delete this manufacturer. "
            }
            res.render("manufacturer_delete", {
                manufacturer: results.manufacturer,
                components: results.components,
                msg: msg
            })
        }
    )
}

exports.manufacturer_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.manufacturer_update_get = function(req, res) {
    res.send("NOT IMPLEMEMENTED YET");
}

exports.manufacturer_update_post = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}
