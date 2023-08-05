const express = require('express');
const criarAlternativasRouter = express.Router();
const criarAlternativasController = require('../controller/criarAlternativasController');

criarAlternativasRouter.get('/', async (req, res, next) => {
    user = await criarAlternativasController.get(req.headers);
    res.status(200).send(user);
});

criarAlternativasRouter.post('/', async(req, res, next)=>{
    user=await criarAlternativasController.criar(req.body);
    res.status(200).send(user);
})

module.exports = criarAlternativasRouter;