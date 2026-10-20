/**********************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de CONTATOS DE EMERGÊNCIA,
 *  e também fazer a integração entre a API e a model
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
***********************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const contatoEmergenciaService = require('../../services/contatos_de_emergencia/service_contatos_emergencia.js')

const inserirNovoContatoEmergencia = async function (contatoEmergencia, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await contatoEmergenciaService.inserirContatoEmergenciaService(contatoEmergencia)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarContatoEmergencia = async function (contatoEmergencia, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await contatoEmergenciaService.atualizarContatoEmergenciaService(contatoEmergencia, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarContatoEmergencia = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await contatoEmergenciaService.listarContatoEmergenciaService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarContatoEmergencia = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await contatoEmergenciaService.buscarContatoEmergenciaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirContatoEmergencia = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await contatoEmergenciaService.excluirContatoEmergenciaService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoContatoEmergencia,
    atualizarContatoEmergencia,
    listarContatoEmergencia,
    buscarContatoEmergencia,
    excluirContatoEmergencia
}