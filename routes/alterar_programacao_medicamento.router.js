/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 27/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerAlterarProgramacaoMedicamento = require('../controllers/alterar_programacao_medicamento/controller_alterar_programacao_medicamento.js')

//                          ENDPOINTS ALTERAR PROGRAMACAO MEDICAMENTO
router.patch('/:id/alterar', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerAlterarProgramacaoMedicamento.alterarProgramacaoMedicamento(id, dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router