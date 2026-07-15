module.exports = {
    environment: 'production',
    mongodb: {
        uri: 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/ecommerce-production?retryWrites=true&w=majority'
    },
    port: 5000,
    jwtSecret: 'mysecretkey-production',
    features: {
        debugMode: false,
        enableLogging: false
    }
};