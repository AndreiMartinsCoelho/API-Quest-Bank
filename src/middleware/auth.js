const jwt = require("jsonwebtoken");
require('dotenv').config();
const userModel = require("../model/userModel");


module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      }

      let decoded;

      // Verifica se o token é válido
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error("Ops! Token inválido:", error);
        return res.status(401).json({ auth: false, message: "Token inválido" });
      }

      // Verifica se o usuário associado ao token ainda existe no banco de dados
      const user = await userModel.login(decoded.id);
      if (!user) {
        return res.status(401).json({ auth: false, message: "Usuário não encontrado" });
      }

      // Verifica se o token ainda é válido de acordo com a data de expiração
      const now = Date.now().valueOf() / 1000;
      if (decoded.exp < now) {
        return res.status(401).json({ auth: false, message: "Token expirado" });
      }

      // Tudo certo! O usuário está autenticado
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Ops! Erro na autenticação:", error);
      return res.status(500).json({ auth: false, message: "Erro no servidor" });
    }
  },
};

