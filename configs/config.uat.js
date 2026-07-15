module.exports = {
    environment: 'uat',
    mongodb: {
        uri: 'mongodb+srv://christianbalitaan_db_user:12345@cluster0.ecey95q.mongodb.net/ecommerce-uat?retryWrites=true&w=majority'
    },
    port: 5000,
    jwtSecret: 'mysecretkey-uat',
    features: {
        debugMode: false,
        enableLogging: true
    }
};