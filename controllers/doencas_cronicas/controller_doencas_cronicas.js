/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de DOENÇAS CRONICAS
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const doencaCronicaService = require('../../services/doencas_cronicas/service_doencas_cronicas.js')

const inserirNovaDoencaCronica = async function (doencaCronica, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await doencaCronicaService.inserirDoencaCronicaService(doencaCronica)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarDoencaCronica = async function (doencaCronica, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await doencaCronicaService.atualizarDoencaCronicaService(doencaCronica, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarDoencaCronica = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await doencaCronicaService.listarDoencaCronicaService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDoencaCronica = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await doencaCronicaService.buscarDoencaCronicaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirDoencaCronica = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await doencaCronicaService.excluirDoencaCronicaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaDoencaCronica,
    atualizarDoencaCronica,
    listarDoencaCronica,
    buscarDoencaCronica,
    excluirDoencaCronica
}