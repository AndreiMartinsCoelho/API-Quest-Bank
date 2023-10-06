const express = require('express');
const TopicoRouter = express.Router();
const TopicoController = require('../controller/TopicosController');
const Middleware = require('../middleware/auth');

//Rota para listar o tópico
TopicoRouter.get('/topico/listar', Middleware.verifyToken, async(req, res, next)=>{
    const { idProfessor } = req.query;
    const user = await TopicoController.get(req.body, { idProfessor });
    res.status(200).send(user);
});

//Rota para criar o tópico
TopicoRouter.post('/topico/adicionar', Middleware.verifyToken, async(req, res, next) => {
    const data = req.body;
    const result = await TopicoController.criar(data);
    res.status(200).send(result);
});

//Rota para excluir o tópico
TopicoRouter.delete('/topico/deletar/:id', Middleware.verifyToken, TopicoController.excluir);

//Rota para atualizar o tópico
TopicoRouter.put('/topico/atualizar/:id', Middleware.verifyToken, TopicoController.editar);

//Rota para obter um tópico específico pelo seu ID
TopicoRouter.get('/topico/listar/:id', Middleware.verifyToken, TopicoController.listaId);

//Rota para buscar um tópico pelo enunciado
TopicoRouter.get('/topico/buscar/:enunciado', Middleware.verifyToken,  TopicoController.buscar);

module.exports = TopicoRouter;