module.exports = function (app) {
    app.get('/api/images/:path*', require('./0.0.0/images').get);
    app.put('/api/images/:path', require('./0.0.0/images').put);
    app.delete('/api/images/:path', require('./0.0.0/images').delete);
};