// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const async = require("async");
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
            ComputerPart.findById(req.cookies[categoryID]).exec(function (
              err,
              part
            ) {
              if (err) return next(err);
              resolve([categoryID, part]);
            });
          })
        );
      }
    }
    return promises;
  }

exports.index = function(req, res, next) {

    Category.find({}).exec(function (err, categories) {
        if (err) return next(err);
        const userList = {};
        Promise.all(getStoredParts(req, next)).then(function (parts) {
            parts.forEach((part) => {
            userList[part[0]] = part[1];
            });
        });
        res.render("index", {
            title: "Components Catalog",
            userList: userList,
            categories: categories,
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
