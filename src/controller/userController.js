const userModel = require("../model/userModel");
const nodemailer = require('nodemailer');

//----Função para REALIZAR o LOGIN do USER----
exports.login = async (req, res) => {
  const result = await userModel.login(req.body);
  if (result.auth) {
    return res.status(200).json({ 
      auth: true, 
      token: result.token, 
      user: result.user 
    })
  } else {
    return res.status(404).json({ 
      auth: false,
       message: "Credenciais inválidas" 
    })
  }
};

//----Função para ENVIAR o EMIAL para USER----
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const codigo = await userModel.sendVerificationCode(email);
    res.status(200).json({ codigo });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Erro ao enviar código de verificação." });
  }
};

//----Função para TROCAR a SENHA do USER----
exports.updatePassword = async (req, res) => {
  const { email, novaSenha, confirmSenha, codigo } = req.body;
  try {
    const result = await userModel.updatePassword({ email, novaSenha, confirmSenha, codigo });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Erro ao atualizar senha do usuário." });
  }
};
