const reviewServices = (server, db) => {
    server.route({
        method: 'GET',
        path: '/reviews/{id}',
        handler: async (request, h) => {
            try {
                const productId = request.params.id
                const reviews = await db.any('SELECT * FROM reviews WHERE productId = $1', [productId]);
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
                const reviews = await db.any('SELECT * FROM reviews');
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
                let newreviews = []
                request.payload.map(async (currentreview) => {
                    const { id, productId, review, rating, customer } = currentreview;
                    const insertQuery = 'INSERT INTO reviews(id, productId, review, rating, customer) VALUES($1, $2, $3, $4, $5) RETURNING *';
                    newreviews.push(await db.one(insertQuery, [id, productId, review, rating, customer]));
                })
                return newreviews;
            } catch (err) {
                console.error('Error inserting review:', err);
                return Boom.badRequest('Failed to insert review');
            }
        }
    });
}

module.exports = reviewServices