const dotenv = require("dotenv");
const path = require('path')

dotenv.config();

// membaca file .env supaya bisa dibaca di berbagai file
module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  serviceName: process.env.SERVICE_NAME,
  urlDb: process.env.MONGO_URL,
  PORT: process.env.PORT // custom port
};
