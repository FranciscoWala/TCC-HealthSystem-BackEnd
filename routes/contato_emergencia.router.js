/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 15/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerContatoEmergencia = require('../controllers/contatos_de_emergencia/controller_contatos_emergencia.js')

//                          ENDPOINTS CONTATOS DE EMERGENCIA
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerContatoEmergencia.inserirNovoContatoEmergencia(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerContatoEmergencia.listarContatoEmergencia()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerContatoEmergencia.buscarContatoEmergencia(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerContatoEmergencia.atualizarContatoEmergencia(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerContatoEmergencia.excluirContatoEmergencia(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router