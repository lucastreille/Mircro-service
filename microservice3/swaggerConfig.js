// swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Microservice API Documentation',
            version: '1.0.0',
            description: 'Documentation for the product microservice',
        },
    },
    apis: ['./swagger.js'], // Chemin vers les fichiers contenant les annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
