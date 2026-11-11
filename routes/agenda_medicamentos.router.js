/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 27/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerAgendaMedicamento = require('../controllers/agenda_medicamento/controller_agenda_medicamento.js')
const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

//                          ENDPOINTS AGENDA MEDICAMENTO
router.get('/:id_usuario', verificarToken.verificarToken,
    authorization.verficarPermissao('VISUALIZAR_AGENDA'),
    authorization.verificarRelacao(),
    async function (request, response) {

        let id = request.params.id_usuario
        let data = request.query.data
        let fuso = request.query.fuso

        let result = await controllerAgendaMedicamento.gerarAgendaMedicamento(id, data, fuso)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router