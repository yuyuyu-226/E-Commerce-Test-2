module.exports = {
    environment: 'staging',
    mongodb: {
        uri: 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/ecommerce-staging?retryWrites=true&w=majority'
    },
    port: 5000,
    jwtSecret: 'mysecretkey-staging',
    features: {
        debugMode: true,
        enableLogging: true
    }
};