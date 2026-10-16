/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 09/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerDoencaCronica = require('../controllers/doencas_cronicas/controller_doencas_cronicas.js')

//                          ENDPOINTS DOENÇAS CRÔNICAS
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDoencaCronica.inserirNovaDoencaCronica(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerDoencaCronica.listarDoencaCronica()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerDoencaCronica.buscarDoencaCronica(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerDoencaCronica.atualizarDoencaCronica(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerDoencaCronica.excluirDoencaCronica(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router