var yelpApi = require("../helper/yelpAPIcall");
var db = require("../models");

// call to the database to receive the names of the food trucks stored
function populateArray() {
    let truckNamesFromDatabase = [];
    db.FoodTruck.findAll({
        attributes: ["name"]
    }).then(function (results) {
        for (var g = 0; g < results.length; g++) {
            truckNamesFromDatabase.push(results[g].dataValues.name);
        }
    }).then(function () { processArray(truckNamesFromDatabase) })
}

// setInterval to make API call to yelp once per day, updating the info for each food truck

setTimeout(populateArray, 30 * 1000) // does a call after 30s
setInterval(function () {
    populateArray();
}, 1000 * 60 * 60 * 12) // every 12 hr make a call

// server-side API call to yelp

function delay() {
    return new Promise(resolve => setTimeout(resolve, 5000));
}
async function delayedYelpCall(truck) {
    await delay();
    yelpApi(truck).then(function (response) {
        // console.log(response);
        // console.log("truck",truck)
        let FoodTruckId;
        let Response = response;
        db.FoodTruck.findAll({ where: { name: truck } }).then(function (dbFoodTruck) {
            FoodTruckId = dbFoodTruck[0].id
            let exisitngAddress = dbFoodTruck[0].address;
            var dbAddressField = dbFoodTruck[0].addressUpdated;
            db.YelpReview.destroy({
                where: {
                    FoodTruckId: FoodTruckId
                }
            }).then(function (dbFoodTruck) {
                for (let b = 0; b < Response.reviewText.length; b++) {
                    db.YelpReview.create({
                        rating: Response.reviewRating[b],
                        username: Response.reviewAuthor[b],
                        content: Response.reviewText[b],
                        contentTimeCreated: Response.reviewTime[b],
                        contentUrl: Response.reviewUrl[b],
                        userImage: Response.reviewImage[b],
                        FoodTruckId: FoodTruckId
                    })
                }
                if (dbAddressField === null) {
                    if (Response.address === "") {
                        Response.address = exisitngAddress
                    }
                    console.log('dbAdressField is NULL will update address to default', Response.address)
                    db.FoodTruck.update({
                        address: Response.address,
                        phone: Response.phone,
                        overallRating: Response.rating,
                        image: Response.image_url,
                        priceRating: Response.price
                    },
                        {
                            where: {
                                id: FoodTruckId
                            }
                        })
                    console.log(Response.address, Response.phone, FoodTruckId)
                } else {
                    console.log('dbAdressField has content will not update address to default')
                    db.FoodTruck.update({
                        phone: Response.phone,
                        overallRating: Response.rating,
                        image: Response.image_url,
                        priceRating: Response.price,
                    }, {
                            where: {
                                id: FoodTruckId
                            }
                        })
                }

            })
        });
    })
}
      
async function processArray(truckArray) {
    for (let i = 0; i < truckArray.length; i++) {
        await delayedYelpCall(truckArray[i])
    }
}


