/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do TIPO DE INTERVALO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const tipoIntervaloService = require('../../services/tipo_intervalo/service_tipo_intervalo.js')

const inserirNovoTipoIntervalo = async function (tipoIntervalo, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await tipoIntervaloService.inserirTipoIntervaloService(tipoIntervalo)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarTipoIntervalo = async function (tipoIntervalo, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await tipoIntervaloService.atualizarTipoIntervaloService(tipoIntervalo, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarTipoIntervalo = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await tipoIntervaloService.listarTipoIntervaloService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarTipoIntervalo = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await tipoIntervaloService.buscarTipoIntervaloService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirTipoIntervalo = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await tipoIntervaloService.excluirTipoIntervaloService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoTipoIntervalo,
    atualizarTipoIntervalo,
    listarTipoIntervalo,
    buscarTipoIntervalo,
    excluirTipoIntervalo
}