const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

// Função para buscar todos os usuários
const get = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT *, (SELECT nome FROM pessoa WHERE id=u.pessoa_id_pessoa) as nome FROM usuario u",
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Função para realizar o login do usuário
const login = async (data) => {
  const { email, senha } = data;
  const md5 = require("md5")
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT p.id_pessoa as id, p.nome, p.email, ` +
      `(SELECT COUNT(pessoa_id_pessoa) FROM professor WHERE pessoa_id_pessoa=p.id_pessoa) as professor, ` +
      `(SELECT COUNT(pessoa_id_pessoa) FROM administrador WHERE pessoa_id_pessoa=p.id_pessoa) as admin ` +
      `FROM usuario u ` +
      `JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa ` +
      `WHERE p.email = ? AND u.senha = ?`;

    connection.query(sql, [email, md5(senha)], (error, results) => {
      if (error) {
        reject(error);
      } else {
        let result = null;
        if (results && results.length > 0) {
          const id = results[0].id;
          const token = jwt.sign({ id }, "infocimol", { expiresIn: "1h" });

          console.log("Fez login e gerou token!");

          const perfil = [];
          if (results[0].professor > 0) {
            perfil.push("professor");
          }
          if (results[0].admin > 0) {
            perfil.push("admin");
          }

          results[0].perfil = perfil;

          // Atualiza o perfil do usuário no banco de dados
          const updateSql =
            "UPDATE usuario SET perfil = ? WHERE pessoa_id_pessoa = ?";
          console.log(updateSql);
          connection.query(updateSql, [perfil.toString(), id], (error) => {
            if (error) {
              reject(error);
            } else {
              result = { auth: true, token, user: results[0] };
              resolve(result);
            }
          });
        } else {
          result = { auth: false, message: "Credenciais inválidas" };
          resolve(result);
        }
      }
    });
  });
};

// Função para verificar a validade do token JWT
const verifyJWT = async (token, perfil) => {
  try {
    const decoded = jwt.verify(token, "infocimol");

    return new Promise((resolve, reject) => {
      const sql = "SELECT perfil FROM usuario WHERE pessoa_id_pessoa = ?";
      connection.query(sql, [decoded.id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            const perfilList = results[0].perfil.split(",");
            if (perfilList.includes(perfil)) {
              resolve({ auth: true, idUser: decoded.id });
            } else {
              resolve({ auth: false, message: "Perfil Inválido!" });
            }
          } else {
            resolve({ auth: false, message: "Perfil Inválido!" });
          }
        }
      });
    });
  } catch (err) {
    return { auth: false, message: "Token inválido!" };
  }
};

module.exports = { get, login, verifyJWT };
