// Importing model(s)
const Component = require("../models/component");
const Category = require("../models/category");
const Manufacturer = require("../models/manufacturer");

// Importing necessary modules
const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const component = require("../models/component");

function getStoredParts(req, next) {
    let promises = [];
    for (const categoryID in req.cookies) {
      if (
        mongoose.Types.ObjectId.isValid(categoryID) &&
        mongoose.Types.ObjectId.isValid(req.cookies[categoryID])
      ) {
        promises.push(
          new Promise(function (resolve, reject) {
            Component.findById(req.cookies[categoryID]).populate("category").exec(function (
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
        
        res.render("index", {
            title: "Components Catalog",
            userList: userList,
            categories: categories
        });
    })

}

exports.component_list = function(req, res) {
    
  Component.find({})
  .populate("manufacturer")
  .populate("category")
  .exec(function (err, components) {
    if (err) return next(err);
    res.render("component_list", {
        title: "Component List",
        components: components
    });
  })

}

exports.component_detail = function(req, res, next) {
    
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }

  Component.findById(req.params.id)
    .populate("manufacturer")
    .populate("category")
    .exec(function (err, component) {
      if (err) { return next(err) }
      if (component == null) {
        let err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      let details = component.description.split(",");
      res.render("component_detail", {
        title: component.name,
        component: component,
        details: details
      })
    })

}

exports.component_create_get = function(req, res, next) {
    
  async.parallel(
    {
      categories: function(callback) {
        Category.find({}).exec(callback);
      },
      manufacturers: function(callback) {
        Manufacturer.find({}).exec(callback);
      }
    },
    function(err, results) {
      if (err) { return next(err); }

      res.render("component_form", {
        title: "Create a Component",
        categories: results.categories,
        manufacturers: results.manufacturers,
        isUpdating: false
      })
    }
  )

}

exports.component_create_post = [
  body("name")
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage("Must provide a Component name"),
  body("description").optional({checkfalsy: true}),
  body("stock", "Stock must be more than 0 (zero)")
      .isInt({min: 0, max: 99999})
      .escape(),
  body("price", "Price must be between $0 and $999999")
      .isFloat({min: 0, max: 999999})
      .escape(),
  body("category", "Please select a category")
      .trim()
      .escape(),
  body("manufacturer", "Please select a manufacturer")
      .trim()
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    let component = new Component({
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      category: req.body.category,
      manufacturer: req.body.manufacturer
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories: function(callback) {
            Category.find({}).exec(callback);
          },
          manufacturers: function(callback) {
            Manufacturer.find({}).exec(callback);
          }
        },
        function (err, results) {
          if (err) { return next(err); }

          res.render("component_form", {
            title: "Add a component",
            categories: results.categories,
            manufacturers: results.manufacturers,
            component: component,
            isUpdating: false,
            errors: errors.array()
          })
        }
      )
      return;
    }
    else {
      component.save(function (err) {
        if (err) { return next(err); }

        res.redirect(component.url);
      })
    }
  }
]

exports.component_delete_get = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }
  Component.findById(req.params.id)
    .exec(function (err, component) {
      if (err) { return next(err) }
      if (component == null) {
          let error = new Error("component not found");
          error.status = 404;
          return (next(error));
      }
      let msg = "Are you sure you want to delete this component?";
      res.render("component_delete", {
          component: component,
          msg: msg
      })
    }
  )
}

exports.component_delete_post = function(req, res) {
  Component.findByIdAndDelete(req.params.id)
    .exec(function(err, next) {
      if (err) { return next(err) }
      res.redirect("/");
    }
  );
}

exports.component_update_get = function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    let err = new Error("Invalid ObjectID");
    err.status = 404;
    return next(err);
  }
  else {
    async.parallel(
      {
        component: function(callback) {
          Component.findById(req.params.id).populate("manufacturer", "category").exec(callback);
        },
        categories: function(callback) {
          Category.find({}).exec(callback);
        },
        manufacturers: function(callback) {
          Manufacturer.find({}).exec(callback);
        }
      },
      function(err, results) {
        if (err) { return next(err); }
  
        res.render("component_form", {
          title: "Update this Component",
          categories: results.categories,
          manufacturers: results.manufacturers,
          component: results.component,
          isUpdating: true
        })
      }
    )
  } 
}

exports.component_update_post = [
  body("name")
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage("Must provide a Component name"),
  body("description").optional({checkfalsy: true}),
  body("stock", "Stock must be more than 0 (zero)")
    .isInt({min: 0, max: 99999})
    .escape(),
  body("price", "Price must be between $0 and $999999")
    .isFloat({min: 0, max: 999999})
    .escape(),
  body("category", "Please select a category")
    .trim()
    .escape(),
  body("manufacturer", "Please select a manufacturer")
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("component_form", {
        title: "Add a component",
        component: req.body,
        isUpdating: false,
        errors: errors.array()
      })
      return;
    } 
    Component.findById(req.params.id).exec(function(err, component) {
      if (err) { return next(err); }
      component.name = req.body.name;
      component.description = req.body.description;
      component.stock = req.body.stock;
      component.price = req.body.price;
      component.category = req.body.category;
      component.manufacturer = req.body.manufacturer;
      component.save(function (error) {
        if (error) {
          console.log("error");
          return next(error);
        }
        else {
          let details = component.description.split(",");
          console.log("success");
          res.render("component_detail", {
            title: component.name,
            component: component,
            details: details
          })
        }
      })
    })
  }
]