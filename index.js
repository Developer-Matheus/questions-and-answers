const express = require('express');
const app = express();
app.set('view engine', 'ejs'); //setando ejs como view engine
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
const connection = require('./database/database');

connection
    .authenticate()
    .then(() => {
        console.log('conexão OK!');
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.listen(4000, (req, res) => {
    console.log('App rodando!');
});

app.get('/', (req, res) => {

    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((perguntas) => {
        res.render("index", {
            perguntas: perguntas
        });
    });

});

app.get('/perguntar', (req, res) => {

    res.render("perguntar", {

    });
});

app.post('/salvarpergunta', (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then((pergunta) => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect('/');
        }
    });
});

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId);
    });

});