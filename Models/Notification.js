// id  integer  not null 
// subscription  character varying(500)  not null 
// email  character varying(255)  not null  
const { DataTypes } = require('sequelize');
const Notification = (sequelize) => sequelize.define(
    'Notification',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        subscription: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);

module.exports = Notification