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

const controllerTipoIntervalo = require('../controllers/tipo_intervalo/controller_tipo_intervalo.js')

//                          ENDPOINTS TIPO DE INTERVALO
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerTipoIntervalo.inserirNovoTipoIntervalo(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerTipoIntervalo.listarTipoIntervalo()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerTipoIntervalo.buscarTipoIntervalo(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerTipoIntervalo.atualizarTipoIntervalo(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerTipoIntervalo.excluirTipoIntervalo(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router