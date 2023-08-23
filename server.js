const app = require("./src/api");

let apiIsAwake = false; //variavel para verificar se a API está acordada

app.use(function (req, res, next) {
  //condigo para acordar a API caso ela esteja dormindo

  if (!apiIsAwake) {
    console.log("API estava dormindo. Acordando agora...");
    apiIsAwake = true;
  }
  console.log("API está acordada!");
  // Continue com o processamento normal da requisição
  next();
});

// Define a porta do servidor e o inicia
let port = process.env.PORT || 3000;

// Inicia o servidor
app.listen(port);
console.log("Iniciado o servidor na porta " + port);
