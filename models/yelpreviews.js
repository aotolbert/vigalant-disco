module.exports = function(sequelize, DataTypes) {
  var YelpReview = sequelize.define("YelpReview", {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    profileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    contentURL: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    contentTimeCreated: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  YelpReview.associate = function(models) {
    // We're saying that a YelpReview should belong to an FoodTruck
    // A YelpReview can't be created without an FoodTruck due to the foreign key constraint
    YelpReview.belongsTo(models.FoodTruck, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return YelpReview;
};
