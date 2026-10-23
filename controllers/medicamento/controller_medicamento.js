/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD do MEDICAMENTO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const medicamentoService = require('../../services/medicamento/service_medicamento.js')

const inserirNovoMedicamento = async function (medicamento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await medicamentoService.inserirMedicamentoService(medicamento)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarMedicamento = async function (medicamento, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await medicamentoService.atualizarMedicamentoService(medicamento, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarMedicamento = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await medicamentoService.listarMedicamentoService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await medicamentoService.buscarMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await medicamentoService.excluirMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoMedicamento,
    atualizarMedicamento,
    listarMedicamento,
    buscarMedicamento,
    excluirMedicamento
}