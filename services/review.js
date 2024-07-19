const reviewServices = (server, db) => {
    server.route({
        method: 'GET',
        path: '/reviews/{id}',
        handler: async (request, h) => {
            try {
                const productId = request.params.id
                const reviews = await db.Review.findAll({ where: { productId: productId } });
                return reviews;
            } catch (err) {
                console.error('Error fetching reviews:', err);
                return Boom.badRequest('Failed to fetch reviews');
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/reviews',
        handler: async (request, h) => {
            try {
                const reviews = await db.Review.findAll({});
                return reviews;
            } catch (err) {
                console.error('Error fetching reviews:', err);
                return Boom.badRequest('Failed to fetch reviews');
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/reviews',
        handler: async (request, h) => {
            try {
                console.log(request.payload);
                const newreviews = await db.Review.bulkCreate(request.payload);
                return newreviews;
            } catch (err) {
                console.error('Error inserting review:', err);
                return Boom.badRequest('Failed to insert review');
            }
        }
    });
}

module.exports = reviewServices