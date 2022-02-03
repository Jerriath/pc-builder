const express = require("express");
const router = express.Router();

// Require controller modules
const component_controller = require("../controllers/componentController");
const manufacturer_controller = require("../controllers/manufacturerController");
const category_controller = require("../controllers/categoryController");


// ----- COMPONENT ROUTERS ----- //

// GET catalog homepage
router.get("/", component_controller.index);

// GET request for creating a Component
router.get("/component/create", component_controller.component_create_get);

// POST request for creating Component
router.post("/component/create", component_controller.component_create_post);

// GET request to delete Component
router.post("/component/:id/delete", component_controller.component_delete_get);

// POST request to delete Component
router.post("/component/:id/delete", component_controller.component_delete_post);

// GET request to update Component
router.get("/component/:id/update", component_controller.component_update_get);

// POST request to update Component
router.post("/component/:id/update", component_controller.component_update_post);

// GET request for one Component
router.get("/component/:id", component_controller.component_detail);

// GET request for list of all Components
router.get("/components", component_controller.component_list);


// ----- MANUFACTURER ROUTES ----- //

// GET request for creating manufacturer. NOTE This must come before route for id (i.e. display manufacturer).
router.get('/manufacturer/create', manufacturer_controller.manufacturer_create_get);

// POST request for creating manufacturer.
router.post('/manufacturer/create', manufacturer_controller.manufacturer_create_post);

// GET request to delete manufacturer.
router.get('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_get);

// POST request to delete manufacturer.
router.post('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_post);

// GET request to update manufacturer.
router.get('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_get);

// POST request to update manufacturer.
router.post('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_post);

// GET request for one manufacturer.
router.get('/manufacturer/:id', manufacturer_controller.manufacturer_detail);

// GET request for list of all manufacturers.
router.get('/manufacturers', manufacturer_controller.manufacturer_list);


// ----- CATEGORY ROUTES ----- //

// GET request for creating category. NOTE This must come before route for id (i.e. display category).
router.get('/category/create', category_controller.category_create_get);

// POST request for creating category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all categorys.
router.get('/categories', category_controller.category_list);

module.exports = router;