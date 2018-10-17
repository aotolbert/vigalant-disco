var db = require("../models");

module.exports = function(app) {
  app.get("/api/trucks", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.YelpReview
    db.FoodTruck.findAll({
      include: [db.YelpReview]
    }).then(function(dbFoodTruck) {
      res.json(dbFoodTruck);
    });
  });

  app.get("/api/trucks/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.YelpReview
    db.FoodTruck.findOne({
      where: {
        id: req.params.id
      },
      include: [db.YelpReview]
    }).then(function(dbFoodTruck) {
      res.json(dbFoodTruck);
    });
  });

  app.post("/api/trucks", function(req, res) {
    db.FoodTruck.create(req.body).then(function(dbFoodTruck) {
      res.json(dbFoodTruck);
    });
  });

  app.delete("/api/trucks/:id", function(req, res) {
    db.FoodTruck.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbFoodTruck) {
      res.json(dbFoodTruck);
    });
  });

};