// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const async = require("async");
const mongoose = require("mongoose");
const { body, validationResults } = require("express-validator");

function getStoredParts(req, next) {
    let promises = [];
    for (const categoryID in req.cookies) {
      if (
        mongoose.Types.ObjectId.isValid(categoryID) &&
        mongoose.Types.ObjectId.isValid(req.cookies[categoryID])
      ) {
        promises.push(
          new Promise(function (resolve, reject) {
            Component.findById(req.cookies[categoryID]).exec(function (
              err,
              component
            ) {
              if (err) return next(err);
              resolve([categoryID, component]);
            });
          })
        );
      }
    }
    return promises;
  }

exports.index = function(req, res, next) {

    Category.find({}).exec(async function (err, categories) {
        if (err) return next(err);
        const userList = {};
        await Promise.all(getStoredParts(req, next)).then(function (components) {
            components.forEach((component) => {
            userList[component[0]] = component[1];
            });
        });
        console.log("test");
        console.log(userList);
        res.render("index", {
            title: "Components Catalog",
            userList: userList,
            categories: categories
        });
    })

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
