//Importando Express e Instanciando
const express = require("express");
const app = express();

//Importando Body-Parser (para lidar com dados vindos do form)
const bodyParser = require("body-parser");

//Importa conexão com banco de dados
const connection = require("./database/database");

//Importa Model
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");


//Promisse para testar conexão com banco
connection
    .authenticate()
    .then(function () {
        console.log("Conexão realizada com sucesso!");
    })
    .catch(function (msgErro) {
        console.log("Ocorreu um erro na conexão!");
    });




//Setando o EJS como View Engine (para renderizar HTML)
app.set("view engine", "ejs");

//Setando local de arquivos estaticos da aplicação
app.use(express.static('public'));

//Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





//Rota de inicio
app.get("/", function (req, resp) {
    //Model com método "findAll" (busca dados das tabelas), no "then" guarda os dados na variável "perguntas". (raw: true = busca apenas dados simples)
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC'] //BUSCA DESCRESCENTE
        ]
    }).then(perguntas => {
        //Método Render escolhe arquivo dentro da pasta "Views" para renderizar
        resp.render("index.ejs", {
            //Passa os dados da variável "perguntas" para o front-end
            perguntas: perguntas
        });
    });

});

//Rota de página de perguntas
app.get("/perguntar", function (req, resp) {
    resp.render("perguntas.ejs");
});

//Rota de recebimento de formulário
app.post("/salvarPergunta", function (req, resp) {
    //Recuperando os dados do formulario através do Body-Parser
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    //Método create salva dados das variaveis recuperadas do form, na tabela do banco pelo Model (INSERT)
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(function () {
        resp.redirect("/");
    });
});


//Rota de redirecionamento para duvida especifica
app.get("/pergunta/:id", function (req, resp) {
    var id = req.params.id;
    //Busca pelo id na tabela que o Model representa
    Pergunta.findOne({
        where: { id: id }
        //"Then" se achou o ID procurado (for diferente de Undefined) manda para página requerida / senão redireciona para inicio
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'desc']]
            }).then(respostas => {
                resp.render("pergunta.ejs", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            resp.redirect("/");
        }
    });
});


//Rota de respostas para perguntas
app.post("/responder", function (req, resp) {
    var corpo = req.body.resposta
    var perguntaId = req.body.pergunta

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(function () {
        resp.redirect("pergunta/" + perguntaId);
    });
});






//Config para rodar servidor
app.listen(8888, function () {
    console.log("App rodando!");
});