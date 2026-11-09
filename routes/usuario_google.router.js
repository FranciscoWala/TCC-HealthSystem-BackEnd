/************************************************
    Objetivo: Arquivo responsável pela ROTA de LOGIN GOOGLE
    data: 09/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerLoginGoogle = require('../controllers/usuario_google/controller_login_google.js')
const controllerCadastroGoogle = require('../controllers/usuario_google/controller_cadastro_usuario_google.js')

//                          ENDPOINT LOGIN GOOGLE
router.post('/login', bodyParserJSON, async function (request, response) {
    let token = request.body.token
    let contentType = request.headers['content-type']

    let result = await controllerLoginGoogle.loginGoogle(token, contentType)

    response.status(result.status_code)
    response.json(result)
})

//                          ENDPOINT CADASTRO GOOGLE
router.post('/cadastro', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerCadastroGoogle.cadastrarUsuarioGoogle(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router