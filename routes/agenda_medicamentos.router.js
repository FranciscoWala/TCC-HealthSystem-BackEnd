
/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 27/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerAgendaMedicamento = require('../controllers/agenda_medicamento/controller_agenda_medicamento.js')

//                          ENDPOINTS AGENDA MEDICAMENTO
router.get('/:id_usuario', async function (request, response) {
    let id = request.params.id_usuario
    let data = request.query.data

    let result = await controllerAgendaMedicamento.gerarAgendaMedicamento(id, data)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
