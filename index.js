const Hapi = require('@hapi/hapi');
const pgp = require('pg-promise')();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'sparrowmart',
    user: 'sanjays',
    password: 'postgrespassword'
};

const init = async () => {
    const server = Hapi.server({
        port: 1810,
        host: 'localhost'
    });

    const db = pgp(dbConfig);
    console.log('Connected to database');

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'SparrowMart';
        }
    });

    server.route({
        method: 'GET',
        path: '/products',
        handler: async(request, h) => {
            try {
                const product = await db.any('SELECT * FROM product');
                return product;
            } catch (err) {
                console.error('Error fetching product:', err);
                return Boom.badRequest('Failed to fetch product');
            }
        }
    });


    server.route({
        method: 'PUT',
        path: '/product',
        handler: async (request, h) => {
            try {
                const { id,title,description,image,rating,price } = request.payload;

                const insertQuery = 'INSERT INTO product(id,title,description,image,rating,price) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
                const newProduct = await db.one(insertQuery, [id,title,description,image,rating,price]);
                return newProduct;
            } catch (err) {
                console.error('Error inserting product:', err);
                return Boom.badRequest('Failed to insert product');
            }
        }
    });

    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

init();
