/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da TIPO DE DOSAGEM
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const tipoDosagemService = require('../../services/tipo_dosagem/service_tipo_dosagem.js')

const inserirNovoTipoDosagem = async function (tipoDosagem, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await tipoDosagemService.inserirTipoDosagemService(tipoDosagem)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarTipoDosagem = async function (tipoDosagem, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await tipoDosagemService.atualizarTipoDosagemService(tipoDosagem, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarTipoDosagem = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await tipoDosagemService.listarTipoDosagemService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarTipoDosagem = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await tipoDosagemService.buscarTipoDosagemService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirTipoDosagem = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await tipoDosagemService.excluirTipoDosagemService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoTipoDosagem,
    atualizarTipoDosagem,
    listarTipoDosagem,
    buscarTipoDosagem,
    excluirTipoDosagem
}