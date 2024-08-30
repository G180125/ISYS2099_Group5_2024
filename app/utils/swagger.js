const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital Management API",
      version: "1.0.0",
      description: "API documentation for the Hospital Management system",
    },
    servers: [
      {
        url:"http://localhost:2099/hospital_management/api/v1", // Dynamically use the server port
      },
    ],
  },
  apis: ["/home/capyboy/ISYS2099_Group5_2024/app/routers/*.js"], // Wildcard to include all routers
}

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(swaggerSpec);
};



module.exports = setupSwagger;
