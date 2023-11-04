const jwt = require("jsonwebtoken");
require('dotenv').config();
const userModel = require("../model/userModel");

//----Modulo para AUTH os USERs----
module.exports = {
  //----Função para VERIFICAR o TOKEN----
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers["x-access-token"]; //----Header para o TOKEN----
      const perfil = req.headers["perfil"]; //----Header para o PERFIL----

      //----TOKEN e PERFIL não forem PASSADO no HEADER ira causar um ERRO----
      if (!token || !perfil) {
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      }
      //----TOKEN e PERFIL forem UNDEFINED no HEADER ira causar um ERRO----
      if(token === undefined || perfil === undefined){
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      } else if (token === null || perfil === null) {
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      } else if (token === "" || perfil === "") {
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      }

      //----PERFIL for DIFERENTE DE PR e AD não ira permitir o USER----
      if (perfil != "professor" && perfil != "admin") {
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      }else if(perfil === "aluno"){
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      }

      let decoded;

      //----Verifica se o TOKEN é VÁLIDO----
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error("Ops! Token inválido:", error);
        return res.status(401).json({ auth: false, message: "Token inválido" });
      }

      //----Verifica se o USER associado ao TOKEN ainda EXISTE no BD----
      const user = await userModel.login(decoded.id);
      if (!user) {
        return res.status(401).json({ auth: false, message: "Usuário não encontrado" });
      }

      //----Verifica se o TOKEN ainda é TRUE de acordo com a DATA de EXPERIÇÃO----
      const now = Date.now().valueOf() / 1000;
      if (decoded.exp < now) {
        return res.status(401).json({ auth: false, message: "Token expirado" });
      }

      //----Tudo certo! O USER está AUTENTICADO----
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Ops! Erro na autenticação:", error);
      return res.status(500).json({ auth: false, message: "Erro no servidor" });
    }
  },
};

