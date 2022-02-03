// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const async = require("async");
const { body, validationResults } = require("express-validator");

exports.index = function(req, res) {
    res.render("index", { title: "Component Catalog" })
}

exports.component_list = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.component_detail = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.component_create_get = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.component_create_post = function(req, res) {
    res,send("NOT IMPLETMENTED YET");
}

exports.component_delete_get = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.component_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}

exports.component_update_get = function(req, res) {
    res.send("NOT IMPLEMEMENTED YET");
}

exports.component_update_post = function(req, res) {
    res.send("NOT IMPLEMENTED YET");
}
