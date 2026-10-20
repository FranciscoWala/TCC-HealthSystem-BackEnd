//import das dependências para criar a API

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

//Criando um objeto do express para criar uma API
const app = express()

//Configurações do CORS da API
const corsOptions = {
    origin: ["*"], // Configuração de origem e domínio da requisição (IP ou domínio)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //Configuração dos métodos que serão utilizados na API
    allowedHeaders: ['Content-type', 'Authorization'] // Configurações de permissões
    //Tipo de dados //Autorização de acesso
}

const autenticarLogin = require("./middleware/autenticarLogin.js")
const auth =require("./middleware/auth.js")
const authorization = require("./middleware/authorization.js")

//Aplica as configurações do CORS no app (EXPRESS)
app.use(cors(corsOptions))
app.use(bodyParserJSON)

app.post("/v1/teste/usuario/login", async (request, response) => {
    let result = await autenticarLogin.autenticarLogin(request, response)

    response.status(200)
    response.json({message: "Usuário encontrado", usuario: result})
})

app.post(
    "/v1/teste/medicamento", 
    authorization.verficarPermissao("gerenciar pessoas"), 
    async (request, response) => {
        console.log(request.body);
        

        response.status(200)
        response.json({message: "Tudo certo!!"})
    }
)

app.listen(8080, () => {
    console.log("Aguardando requisições..."); 
})