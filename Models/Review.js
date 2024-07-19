const { DataTypes } = require('sequelize');
const Review = (sequelize) => sequelize.define(
    'Review',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        review: {
            type: DataTypes.TEXT,
        },
        rating: {
            type: DataTypes.FLOAT,
        },
        customer: {
            type: DataTypes.FLOAT,
        },
    }
);
module.exports = Review