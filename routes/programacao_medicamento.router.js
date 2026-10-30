/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 25/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerProgramacaoMedicamento = require('../controllers/programacao_medicamento/controller_programacao_medicamento.js')

//                          ENDPOINTS PROGRAMAÇÃO MEDICAMENTO
router.get('/:id_receita_medica', async function (request, response) {
    let idReceitaMedica = request.params.id_receita_medica

    let result = await controllerProgramacaoMedicamento.buscarProgramacaoMedicamentoPorIdReceita(idReceitaMedica)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router