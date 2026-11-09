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

const usuarioController = require('../controllers/usuario/usuario.js')
const autenticarLogin = require('../middleware/autenticarLogin.js')

//                          ENDPOINTS USUARIO
router.post('/login', bodyParserJSON, autenticarLogin.autenticarLogin)

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await usuarioController.inserirNovoUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await usuarioController.listarUsuario()

    response.status(result.status_code)
    response.json(result)
})

router.get('/dados_usuario', async function (request, response) {
    let result = await usuarioController.listarDadosUsuario()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await usuarioController.buscarUsuario(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await usuarioController.atualizarUsuario(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await usuarioController.excluirUsuario(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router