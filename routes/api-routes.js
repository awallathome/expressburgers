// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the todos
  app.get("/api/burgers", function(req, res) {
    // Write code here to retrieve all of the todos from the database and res.json them
    // back to the user
    db.burgers.findAll().then(function(dbburgerz){
        res.json(dbburgerz);
    });
    
  });

  // POST route for saving a new todo. We can create todo with the data in req.body
  app.post("/api/burgers", function(req, res) {
    // Write code here to create a new todo and save it to the database
    // and then res.json back the new todo to the user
    db.burgers.create(req.body).then(function(dbburger){
      res.json(req.body);
      console.log(req.body);
    });
  });

  // DELETE route for deleting burgers. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete("/api/burgers/:id", function(req, res) {

  });

  // PUT route for updating burgers. We can get the updated todo data from req.body
  app.put("/api/burgers", function(req, res) {

  });
};
