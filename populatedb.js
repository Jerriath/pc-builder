#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Manufacturer = require('./models/manufacturer')
var Component = require('./models/component')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var components = []
var categories = []
var manufacturers = []

function categoryCreate(name, description, cb) {
  categoryDetail = {name: name , description: description }
  
  var category = new Category(categoryDetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function manufacturerCreate(name, description, cb) {
  var manufacturer = new Manufacturer({ name: name, description: description });
       
  manufacturer.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Manufacturer: ' + manufacturer);
    manufacturers.push(manufacturer)
    cb(null, manufacturer);
  }   );
}

function componentCreate(name, description, price, category, manufacturer, cb) {
  componentDetail = { 
    name: name,
    description: description,
    image: null,
    price: price,
    category: category,
    manufacturer: manufacturer
  }
  console.log(name + " " + description + " " + price + " " + category + " " + manufacturer);
  if (category != false) componentDetail.category = category
  if (manufacturer != false) componentDetail.manufacturer = manufacturer
  var component = new Component(componentDetail);    
  component.save(function (err) {
    if (err) {
      console.log(err);
      cb(err, null)
      return
    }
    console.log('New Component: ' + component);
    components.push(component)
    cb(null, component)
  }  );
}


function createCategoryManufacturers(cb) {
    async.series([
        function(callback) {
          let description = "Founded in 1969 as a Silicon Valley start-up, the AMD journey began with dozens of employees focused on leading-edge semiconductor products. From those modest beginnings, AMD has grown into a global company achieving many important industry firsts along the way. AMD today develops high-performance computing and visualization products to solve some of the world’s toughest and most interesting challenges.";
          manufacturerCreate('AMD', description, callback);
        },
        function(callback) {
          let description = "Nvidia Corporation is an American multinational technology company incorporated in Delaware and based in Santa Clara, California. It designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market.";
          manufacturerCreate('Nvidia', description, callback);
        },
        function(callback) {
          let description = "Intel Corporation, stylized as intel, is an American multinational corporation and technology company headquartered in Santa Clara, California. It is the world's largest semiconductor chip manufacturer by revenue, and is the developer of the x86 series of microprocessors, the processors found in most personal computers (PCs).";
          manufacturerCreate('Intel', description, callback);
        },
        function(callback) {
          let description = "Corsair designs and sells a range of products for computers, including high-speed DRAM modules, ATX power supplies (PSUs), USB flash drives (UFDs), CPU/GPU and case cooling, gaming peripherals (such as keyboards or computer mice), computer cases, solid-state drives (SSDs), and speakers.";
          manufacturerCreate('Corsair', description, callback);
        },
        function(callback) {
          let description = "MSI is a world leader in gaming, content creation, business & productivity and AIoT solutions. Bolstered by its cutting-edge R&D capabilities and customer-driven innovation, MSI has a wide-ranging global presence spanning over 120 countries. Its comprehensive lineup of laptops, graphics cards, monitors, motherboards, desktops, peripherals, servers, IPCs, robotic appliances, and vehicle infotainment and telematics systems are globally acclaimed.";
          manufacturerCreate('MSI', description, callback);
        },
        function(callback) {
          let description = "A central processing unit (CPU), also called a central processor, main processor or just processor, is the electronic circuitry that executes instructions comprising a computer program. The CPU performs basic arithmetic, logic, controlling, and input/output (I/O) operations specified by the instructions in the program.";
          categoryCreate('CPU', description, callback);
        },
        function(callback) {
          let description = "A graphics processing unit (GPU) is a specialized electronic circuit designed to rapidly manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display device. GPUs are used in embedded systems, mobile phones, personal computers, workstations, and game consoles.";
          categoryCreate("GPU", description, callback);
        },
        function(callback) {
          let description = "A motherboard is the main printed circuit board (PCB) in general-purpose computers and other expandable systems. It holds and allows communication between many of the crucial electronic components of a system, such as the central processing unit (CPU) and memory, and provides connectors for other peripherals.";
          categoryCreate("Motherboard", description, callback);
        },
        function(callback) {
          let description = "Random-access memory is a form of computer memory that can be read and changed in any order, typically used to store working data and machine code.";
          categoryCreate("RAM", description, callback);
        },
        ],
        // optional callback
        cb);
}


function createComponents(cb) {
    async.parallel([
        function(callback) {
          componentCreate("Intel Core i5-12400", "2.5GHz base, 6-Core, 65W base power, 117W max power, Intel UHD Graphics 730", 208.96, categories[0]._id, manufacturers[2]._id, callback);
        },
        function(callback) {
          componentCreate("AMD Ryzen 5 5600X", '3.7 GHz base, 6-Core, 65W base power, Multithread processing (12 threads)', 265.98, categories[0]._id, manufacturers[0]._id, callback);
        },
        function(callback) {
          componentCreate("GIGABYTE GeForce RTX 3060", '15GHz memory clock, 12 GB memory size, 360GB/s memory bandwidth, OpenGL 4.6', 699.99, categories[1]._id, manufacturers[1]._id, callback);
        },
        function(callback) {
          componentCreate("MSI MPG Z690 EDGE WIFI DDR4 LGA 1700 ATX Intel Motherboard", "Intel Z690 chipset, 6 x SATA 6Gb/s, Intel WiFi 6 802.11, Bluetooth 5.2", 474.98, categories[2]._id, manufacturers[4]._id, callback);
        }
        ],
        // optional callback
        cb);
}



async.series([
    createCategoryManufacturers,
    createComponents
  ],
  // Optional callback
  function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Components: ' + results + components);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



