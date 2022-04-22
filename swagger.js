const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Team Table API',
        description: 'api of project teamtable',
    },

    host: 'localhost:3000',
    schemes: ['http'],
}

const outputFile = './swagger.json';
const endpointsFiles = ['./server/routers/LoginRouter.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
