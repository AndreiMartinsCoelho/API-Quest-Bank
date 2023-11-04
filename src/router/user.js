const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

//----ROTA para REALIAR o LOGIN----
userRouter.post('/user/login', userController.login)

//----ROTA para ENVIAR o EMAIL para o USER----
userRouter.post('/user/reset/senha/request', userController.sendVerificationCode);
//----ROTA para TROCAR a SENHA do USER----
userRouter.put('/user/reset/senha', userController.updatePassword);

module.exports = userRouter;

