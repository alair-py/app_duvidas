//Model para SQL(Pergunta)
const Sequelize = require('sequelize');
const connection = require('./database');

//Cria tabela! Método define (2 parametros) 1 - "nome tabela", 2 - "Json com nome coluna {Tipo}"
const Pergunta = connection.define('perguntas', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Sincroniza com banco e cria tabela (force: false = se tabela já existe, não faz nada)
Pergunta.sync({ force: false }).then(function () {
    console.log("Tabela criada.");
});

module.exports = Pergunta;