const disciplinaModel = require('../model/disciplinaModel');

//----Função para LISTAR as DICIPLINAS----
exports.listar = async (req, res) => {
    try {
      const disciplinas = await disciplinaModel.list(req.body);
      return res.status(200).json({
        status: "success",
        msg: "Disciplinas listadas com sucesso!",
        disciplinas,
      })
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Ocorreu um erro ao buscar as disciplinas. Tente novamente mais tarde.",
      })
    }
  };

//----Função para OBTER uma DISCIPLINA por ID----
exports.getById = async (req, res) => {
    const idDisciplina = req.params.id;
    try {
        const disciplina = await disciplinaModel.getById(idDisciplina);
        return res.status(200).json({ 
          status: "success", msg: "Disciplina obtida com sucesso!", disciplina 
        })
    } catch (error) {
        //----Tratamento de ERRO caso não ACHE a DISCIPLINA----
        console.error("Erro ao obter disciplina:", error);
        return res.status(500).json({ 
          status: "error", msg: "Ocorreu um erro ao obter a disciplina. Por favor, tente novamente mais tarde." 
        })
    }
};