const Sequelize = require("sequelize");
const connection = new Sequelize('db_ultimate_blog', 'root', 'database1234', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection ;