const express = require('express');
const listarAlternativasRouter = express.Router();
const listarAlternativasController = require('../controller/listarAlternativasController');

listarAlternativasRouter.get('/', async (req, res, next) => {
    user = await listarAlternativasController.get(req.headers);
    res.status(200).send(user);
});

listarAlternativasRouter.get('/listarAlternativas', async(req, res, next)=>{
    user=await listarAlternativasController.listar(req.body);
    res.status(200).send(user);
})

module.exports = listarAlternativasRouter;