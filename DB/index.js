const pgp = require('pg-promise')();
const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'sparrowmart',
    user: 'sanjays',
    password: 'postgrespassword'
};

const db = pgp(dbConfig);
console.log('Connected to database');

module.exports = db