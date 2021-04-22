//Importa Sequelize
const Sequelize = require("sequelize");
//Instancia Sequelize passando dados para conexão com banco
const connection = new Sequelize('app_perguntas', 'root', '0000', {
    host: 'localhost',
    dialect: 'mysql'
});

//Exporta conexão para usar em outros arquivos
module.exports = connection;