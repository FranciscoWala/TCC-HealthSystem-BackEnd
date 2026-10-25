/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de VINCULO PACIENTE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const vinculoPacienteService = require('../../services/vinculo_paciente/service_vinculo_paciente.js')

const inserirNovoVinculoPaciente = async function (vinculoPaciente, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await vinculoPacienteService.inserirVinculoPacienteService(vinculoPaciente)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarVinculoPaciente = async function (vinculoPaciente, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await vinculoPacienteService.atualizarVinculoPacienteService(vinculoPaciente, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarVinculoPaciente = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await vinculoPacienteService.listarVinculoPacienteService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarVinculoPaciente = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await vinculoPacienteService.buscarVinculoPacienteService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirVinculoPaciente = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await vinculoPacienteService.excluirVinculoPacienteService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoVinculoPaciente,
    atualizarVinculoPaciente,
    listarVinculoPaciente,
    buscarVinculoPaciente,
    excluirVinculoPaciente
}