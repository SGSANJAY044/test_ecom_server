const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('sparrowmartDB', 'sanjays', 'postgrespassword', {
    host: 'localhost'|'postgres',
    dialect: 'postgres'
})
const checkDbStatus = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
checkDbStatus()

const User = require('../Models/User')(sequelize)
const Product = require('../Models/Product')(sequelize)
const Notification = require('../Models/Notification')(sequelize)
const Review = require('../Models/Review')(sequelize)

sequelize.sync({ force: true })
const db = {
    Sequelize,
    sequelize,
    User,
    Product,
    Notification,
    Review
}
module.exports = db