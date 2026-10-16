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

const controllerUnidadeMedida = require('../controllers/unidade_medida/controller_unidade_medida.js')

//                          ENDPOINTS UNIDADE DE MEDIDA
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerUnidadeMedida.inserirNovaUnidadeMedida(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerUnidadeMedida.listarUnidadeMedida()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerUnidadeMedida.buscarUnidadeMedida(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerUnidadeMedida.atualizarUnidadeMedida(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerUnidadeMedida.excluirUnidadeMedida(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router