/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 25/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerContatoEmergenciaUsuario = require('../controllers/contatos_de_emergencia_usuario/controller_contatos_emergencia_usuario.js')

//                          ENDPOINTS CONTATOS DE EMERGENCIA USUARIO
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerContatoEmergenciaUsuario.inserirNovoContatoEmergenciaUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerContatoEmergenciaUsuario.listarContatoEmergenciaUsuario()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerContatoEmergenciaUsuario.buscarContatoEmergenciaUsuario(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerContatoEmergenciaUsuario.atualizarContatoEmergenciaUsuario(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerContatoEmergenciaUsuario.excluirContatoEmergenciaUsuario(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router