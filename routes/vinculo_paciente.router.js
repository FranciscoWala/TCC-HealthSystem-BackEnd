/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 16/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const vinculoPacienteController = require('../controllers/vinculo_paciente/controller_vinculo_paciente.js')
const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

// ========== BUSCAR MEU CUIDADOR ==========
router.get('/meu_cuidador', verificarToken.verificarToken, async function (request, response) {
    let idPaciente = request.user.id
    let roleUsuario = request.user.role

    let result = await vinculoPacienteController.buscarMeuCuidador(idPaciente, roleUsuario)

    response.status(result.status_code)
    response.json(result)
})

// ========== BUSCAR MEUS PACIENTES ==========
router.get('/meus_pacientes', verificarToken.verificarToken,
    authorization.verficarPermissao('GERENCIAR_PACIENTES'), async function (request, response) {
        
    let idCuidador = request.user.id
    let roleUsuario = request.user.role

    let result = await vinculoPacienteController.buscarMeusPacientes(idCuidador, roleUsuario)

    response.status(result.status_code)
    response.json(result)
})

// ========== BUSCAR VÍNCULO DO PACIENTE ==========
router.get('/paciente/:idPaciente', verificarToken.verificarToken, async function (request, response) {
    let idPaciente = request.params.idPaciente
    let idUsuario = request.user.id
    let roleUsuario = request.user.role

    let result = await vinculoPacienteController.buscarVinculoPorPaciente(idPaciente, idUsuario, roleUsuario)

    response.status(result.status_code)
    response.json(result)
})

// ========== ENCERRAR VÍNCULO DO PACIENTE ==========
router.delete('/paciente/:idPaciente', verificarToken.verificarToken, async function (request, response) {
    let idPaciente = request.params.idPaciente
    let idUsuario = request.user.id
    let roleUsuario = request.user.role

    let result = await vinculoPacienteController.encerrarVinculoPaciente(idPaciente, idUsuario, roleUsuario)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router