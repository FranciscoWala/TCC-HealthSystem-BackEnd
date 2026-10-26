
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de HISTORICO MEDICAMENTO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 22/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const historicoMedicamentoService = require('../../services/historico_medicamento/service_historico_medicamento.js')

const inserirNovoHistoricoMedicamento = async function (historicoMedicamento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await historicoMedicamentoService.inserirHistoricoMedicamentoService(historicoMedicamento)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarHistoricoMedicamento = async function (historicoMedicamento, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await historicoMedicamentoService.atualizarHistoricoMedicamentoService(historicoMedicamento, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarHistoricoMedicamento = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await historicoMedicamentoService.listarHistoricoMedicamentoService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarHistoricoMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await historicoMedicamentoService.buscarHistoricoMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirHistoricoMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await historicoMedicamentoService.excluirHistoricoMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoHistoricoMedicamento,
    atualizarHistoricoMedicamento,
    listarHistoricoMedicamento,
    buscarHistoricoMedicamento,
    excluirHistoricoMedicamento
}
