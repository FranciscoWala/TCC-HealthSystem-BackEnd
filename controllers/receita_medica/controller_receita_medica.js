/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de RECEITA MEDICA
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const receitaMedicaService = require('../../services/receita_medica/service_receita_medica.js')

const inserirNovaReceitaMedica = async function (receitaMedica, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await receitaMedicaService.inserirReceitaMedicaService(receitaMedica)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarReceitaMedica = async function (receitaMedica, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await receitaMedicaService.atualizarReceitaMedicaService(receitaMedica, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarReceitaMedica = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await receitaMedicaService.listarReceitaMedicaService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarReceitaMedica = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await receitaMedicaService.buscarReceitaMedicaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirReceitaMedica = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await receitaMedicaService.excluirReceitaMedicaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaReceitaMedica,
    atualizarReceitaMedica,
    listarReceitaMedica,
    buscarReceitaMedica,
    excluirReceitaMedica
}