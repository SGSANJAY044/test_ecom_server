const { Op } = require('@sequelize/core')
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
        path: '/product/{id}',
        handler: async (request, h) => {
            try {
                const productId = request.params.id
                const product = await db.Product.findOne({
                    where: { id: parseInt(productId) },
                    rejectOnEmpty: true,
                });
                return product;
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
                const query = request.query;
                let queryObject = {}
                if (query?.categories) {
                    const categories = query.categories.split('/')
                    queryObject = {
                        where: {
                            category: { in: categories }
                        }
                    }
                }
                if (query?.rating) {
                    console.log(typeof (parseInt(query.rating)));
                    queryObject = {
                        where: {
                            ...queryObject?.where,
                            rating: {
                                lte: parseInt(query.rating)
                            }
                        }
                    }
                }
                if (query?.searchWord) {
                    queryObject = {
                        where: {
                            ...queryObject?.where,
                            title: {
                                like: `%${request.query.searchWord}%`
                            }
                        }
                    }
                }
                queryObject = {
                    ...queryObject,
                    limit: query?.limit || 10,
                    offset: query?.offset || (query?.pageno - 1) * 9
                }
                const product = await db.Product.findAll(queryObject);
                const totalcount = await db.Product.findAll({});
                return { data: product, totalcount: totalcount.length };
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
                console.log(request.payload);
                const newProduct = await db.Product.create(request.payload);
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
                await db.Product.truncate();
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
                console.log(request.payload);
                const newProducts = await db.Product.bulkCreate(request.payload);
                return newProducts;
            } catch (err) {
                console.error('Error inserting product:', err);
                return Boom.badRequest('Failed to insert product');
            }
        }
    });
}

module.exports = productServices
