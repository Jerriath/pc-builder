// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const async = require("async");
const mongoose = require("mongoose");
const { body, validationResults } = require("express-validator");

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
                Component.find({ manurfacturer: req.params.id})
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
    res.send("NOT IMPLEMENTED YET");
}

exports.manufacturer_create_post = function(req, res) {
    res,send("NOT IMPLETMENTED YET");
}

exports.manufacturer_delete_get = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
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
