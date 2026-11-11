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

const controllerHistoricoMedicamento = require('../controllers/historico_medicamento/controller_historico_medicamento.js')
const controllerConfirmarIngestaoMedicamento = require('../controllers/confirmar_ingestao_medicamento/controller_confirmar_ingestao_medicamento.js')

const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

//                          ENDPOINTS CONTATOS DE EMERGENCIA
router.patch('/confirmar_ingestao/:id', verificarToken.verificarToken,
    authorization.verficarPermissao('CONFIRMAR_INGESTAO'),
    bodyParserJSON,
    async function (request, response) {

        let idReceitaMedica = request.params.id
        let idUsuario = request.user.id
        let horarioProgramado = request.body.horario_programado

        let result = await controllerConfirmarIngestaoMedicamento.confirmarIngestaoMedicamento(idReceitaMedica, idUsuario, horarioProgramado)

        response.status(result.status_code)
        response.json(result)
    }
)

router.post('/', bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerHistoricoMedicamento.inserirNovoHistoricoMedicamento(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/', async function (request, response) {
    let result = await controllerHistoricoMedicamento.listarHistoricoMedicamento()

    response.status(result.status_code)
    response.json(result)
})

router.get('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerHistoricoMedicamento.buscarHistoricoMedicamento(id)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', bodyParserJSON, async function (request, response) {
    let id = request.params.id
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await controllerHistoricoMedicamento.atualizarHistoricoMedicamento(dados, id, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.get('/usuario/:id', async function (request, response) {
    let idPaciente = request.params.id

    let result = await controllerHistoricoMedicamento.listarHistoricoPorPaciente(idPaciente)

    response.status(result.status_code)
    response.json(result)
})

router.delete('/:id', async function (request, response) {
    let id = request.params.id

    let result = await controllerHistoricoMedicamento.excluirHistoricoMedicamento(id)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router