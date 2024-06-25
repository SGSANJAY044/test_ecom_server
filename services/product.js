const productServices = (server, db) => {

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'SparrowMart';
        }
    });

    server.route({
        method: 'GET',
        path: '/products/{id}',
        handler: async (request, h) => {
            try {
                const productId = request.params.id
                const product = await db.any('SELECT * FROM product WHERE id = $1', [productId]);
                return product[0];
            } catch (err) {
                console.error('Error fetching product:', err);
                return Boom.badRequest('Failed to fetch product');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/products',
        handler: async (request, h) => {
            try {
                console.log("db");
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
                const { id, title, category, description, image, rating, price } = request.payload;

                const insertQuery = 'INSERT INTO product(id,title,category,description,image,rating,price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
                const newProduct = await db.one(insertQuery, [id, title, category, description, image, rating, price]);
                return newProduct;
            } catch (err) {
                console.error('Error inserting product:', err);
                return Boom.badRequest('Failed to insert product');
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/products',
        handler: async (request, h) => {
            try {
                await db.any('DELETE FROM product');
                return "Success";
            } catch (err) {
                console.error('Error inserting product:', err);
                return Boom.badRequest('Failed to insert product');
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/products',
        handler: async (request, h) => {
            try {
                let newProducts = []
                request.payload.map(async (product) => {
                    const { id, title, category, description, image, rating, price } = product;
                    const insertQuery = 'INSERT INTO product(id,title,category,description,image,rating,price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
                    newProducts.push(await db.one(insertQuery, [id, title, category, description, image, rating, price]));
                })
                return newProducts;
            } catch (err) {
                console.error('Error inserting product:', err);
                return Boom.badRequest('Failed to insert product');
            }
        }
    });
}

module.exports = productServices
