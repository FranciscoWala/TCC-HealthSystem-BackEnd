/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 16/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerTipoDosagem = require('../controllers/tipo_dosagem/controller_tipo_dosagem.js')

//                          ENDPOINTS TIPO DE DOSAGEM
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerTipoDosagem.inserirNovoTipoDosagem(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerTipoDosagem.listarTipoDosagem()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerTipoDosagem.buscarTipoDosagem(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerTipoDosagem.atualizarTipoDosagem(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerTipoDosagem.excluirTipoDosagem(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router