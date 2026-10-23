/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD da UNIDADE DE MEDIDA
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const unidadeMedidaService = require('../../services/unidade_medida/service_unidade_medida.js')

const inserirNovaUnidadeMedida = async function (unidadeMedida, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await unidadeMedidaService.inserirUnidadeMedidaService(unidadeMedida)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarUnidadeMedida = async function (unidadeMedida, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await unidadeMedidaService.atualizarUnidadeMedidaService(unidadeMedida, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarUnidadeMedida = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await unidadeMedidaService.listarUnidadeMedidaService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUnidadeMedida = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await unidadeMedidaService.buscarUnidadeMedidaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUnidadeMedida = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await unidadeMedidaService.excluirUnidadeMedidaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaUnidadeMedida,
    atualizarUnidadeMedida,
    listarUnidadeMedida,
    buscarUnidadeMedida,
    excluirUnidadeMedida
}
