const { DataTypes } = require('sequelize');
const Product = (sequelize) => sequelize.define(
    'Product',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
        image: {
            type: DataTypes.STRING,
        },
        rating: {
            type: DataTypes.FLOAT,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }
);
module.exports = Product
