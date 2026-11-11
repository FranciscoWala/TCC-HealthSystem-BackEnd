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

const controllerRolePermissoes = require('../controllers/role_permissoes/controller_role_permissoes.js')
const verificarToken = require('../middleware/auth.js')

//                          ENDPOINTS ROLE PERMISSOES
router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerRolePermissoes.inserirNovaRolePermissoes(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerRolePermissoes.listarRolePermissoes()

    response.status(result.status_code)
    response.json(result)
})

router.get('/permitido', verificarToken.verificarToken, async function (request, response) {
    let idRole = request.user.role

    let result = await controllerRolePermissoes.buscarPermissoesUsuario(idRole)

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerRolePermissoes.buscarRolePermissoes(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerRolePermissoes.atualizarRolePermissoes(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerRolePermissoes.excluirRolePermissoes(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router