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
        console.log(decoded);
      } catch (error) {
        console.error("Ops! Token inválido:", error);
        return res.status(401).json({ auth: false, message: "Token inválido" });
      }

      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Ops! Erro na autenticação:", error);
      return res.status(500).json({ auth: false, message: "Erro no servidor" });
    }
  },
};

