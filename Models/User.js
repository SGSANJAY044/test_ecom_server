// id  integer not null 
// email character varying(100) not null 
//  password   character varying(255)  not null  
// created_at   timestamp without time zone  CURRENT_TIMESTAMP
// updated_at   timestamp without time zone  CURRENT_TIMESTAMP
const { DataTypes } = require('sequelize');
const User = (sequelize) => sequelize.define(
    'User',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
        created_at: {
            type: DataTypes.DATE,
            default: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.STRING,
            default: DataTypes.NOW
        },
    }
);

module.exports = User