/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 27/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerCadastroMedicamentoUsuario = require('../controllers/cadastro_medicamento_usuario/controller_cadastro_medicamento_usuario.js')

//                          ENDPOINTS CADASTRO MEDICAMENTO USUARIO
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerCadastroMedicamentoUsuario.cadastrarMedicamentoUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router