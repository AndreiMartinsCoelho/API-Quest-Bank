const express = require('express');
const disciplinaRouter = express.Router();
const disciplinaController = require('../controller/disciplinaController');

disciplinaRouter.get('/', async (req, res, next) => {
    user = await disciplinaController.get(req.headers);
    res.status(200).send(user);
});

disciplinaRouter.get('/listaDisciplina', async(req, res, next)=>{
    user=await disciplinaController.listar(req.body);
    res.status(200).send(user);
})

module.exports = disciplinaRouter;
