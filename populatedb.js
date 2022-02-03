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
var Component = require('./models/component')
var Category = require('./models/category')
var Manufacturer = require('./models/manufacturer')


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
    genres.push(manufacturer)
    cb(null, manufacturer);
  }   );
}

function componentCreate(name, image, price, category, manufacturer, cb) {
  componentDetail = { 
    name: name,
    image: image,
    price: price,
    category: category,
    manufacturer: manufacturer
  }
  if (category != false) componentDetail.category = category
  if (manufacturer != false) componentDetail.manufacturer = manufacturer
    
  var component = new Component(componentDetail);    
  component.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Component: ' + component);
    components.push(compoennt)
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
          bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate('Test Book 1', 'Summary of test book 1', 'ISBN111111', authors[4], [genres[0],genres[1]], callback);
        },
        function(callback) {
          bookCreate('Test Book 2', 'Summary of test book 2', 'ISBN222222', authors[4], false, callback)
        }
        ],
        // optional callback
        cb);
}



async.series([
    createGenreAuthors,
    createBooks,
    createBookInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



