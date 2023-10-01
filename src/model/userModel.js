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

// Função para fazer login
const login = async (data) => {
  const bcrypt = require("bcrypt");
  const { email, senha } = data;

  return new Promise((resolve, reject) => {
    const sql =
    `SELECT p.id_pessoa as id, p.nome, p.email, ` +
    `(SELECT COUNT(pessoa_id_pessoa) FROM professor WHERE pessoa_id_pessoa=p.id_pessoa) as professor, ` +
    `(SELECT COUNT(pessoa_id_pessoa) FROM administrador WHERE pessoa_id_pessoa=p.id_pessoa) as admin, ` +
    `u.senha ` +
    `FROM usuario u ` +
    `JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa ` +
    `WHERE p.email = ?`;

    connection.query(sql, [email], async (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results && results.length > 0) {
          const id = results[0].id;
          const password = results[0].senha;
          //console.log(password);
          if (password) {
            bcrypt.compare(senha, password, async (err, res) => {
              if (err) {
                reject(err);
              } else if (res) {
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

                const updateSql =
                  "UPDATE usuario SET perfil = ? WHERE pessoa_id_pessoa = ?";

                connection.query(updateSql, [perfil.toString(), id], (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    const result = { auth: true, token, user: { 
                      id: results[0].id, 
                      nome: results[0].nome, 
                      email: results[0].email,
                      professor: results[0].professor,
                      admin: results[0].admin,
                      perfil: perfil
                    }};
                    resolve(result);
                  }
                });
              } else {
                const result = { auth: false, message: "Credenciais inválidas" };
                resolve(result);
              }
            });
          } else {
            const result = { auth: false, message: "Credenciais inválidas" };
            resolve(result);
          }
        } else {
          const result = { auth: false, message: "Credenciais inválidas" };
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

// Função para trocar a senha do usuário
const changePassword = async (data) => {
  const bcrypt = require("bcrypt");
  const { email, novaSenha, confirmSenha } = data;
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id_pessoa as id, p.nome, p.email " +
      "FROM usuario u " +
      "JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa " +
      "WHERE p.email = ?";

    // Consulta o banco de dados para obter informações do usuário
    connection.query(sql, [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        let result = null;
        if (results && results.length > 0) {
          const id = results[0].id;

          console.log("Fez a troca de senha!");

          if (novaSenha !== confirmSenha) {
            // Se a nova senha e a confirmação de senha não coincidirem, define o resultado como autenticação falsa
            result = {
              auth: false,
              message: "A nova senha e a confirmação de senha não coincidem.",
            };
            resolve(result);
          } else {
            // Criptografa a nova senha com Bcrypt
            bcrypt.hash(novaSenha, 10, (err, hash) => {
              if (err) {
                reject(err);
              } else {
                // Atualiza a senha do usuário no banco de dados
                const updateSql = `UPDATE usuario SET senha = ? WHERE pessoa_id_pessoa = ?`;
                console.log(updateSql);
                connection.query(updateSql, [hash, id], (error) => {
                  if (error) {
                    // Em caso de erro ao atualizar a senha, rejeita a Promise com o erro
                    reject(error);
                  } else {
                    // Senha atualizada com sucesso, define o resultado como autenticação verdadeira e retorna informações do usuário
                    result = { auth: true, user: results[0] };
                    resolve(result);
                  }
                });
              }
            });
          }
        } else {
          // Se nenhum usuário for encontrado com o e-mail fornecido, define o resultado como autenticação falsa
          result = { auth: false, message: "E-mail de usuário inválido!" };
          resolve(result);
        }
      }
    });
  });
};

module.exports = { get, login, verifyJWT, changePassword };
