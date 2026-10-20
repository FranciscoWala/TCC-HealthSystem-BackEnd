/*******************************************************************************************
 * Objetivo: Regras de negócio e chamada ao DAO
 * Data: 20/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const tipoDosagemDAO = require('../../models/DAO/tipo_dosagem/tipo_dosagem.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const tipoDosagemSchema = require('../../schemas/tipoDosagemSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosTipoDosagem = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(tipoDosagemSchema, dados, customMessages)
}

const inserirTipoDosagemService = async function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosTipoDosagem(dados)
        if (validacao) 
            return validacao

        let result = await tipoDosagemDAO.insertTipoDosagem(dados)
        if (result) {
            dados.id = result
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = dados
            
            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const atualizarTipoDosagemService = async function (dados, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarTipoDosagemService(id)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosTipoDosagem(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await tipoDosagemDAO.updateTipoDosagem(dados)
        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = dados
            
            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const listarTipoDosagemService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await tipoDosagemDAO.selectAllTipoDosagem()
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.tipo_dosagem = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarTipoDosagemService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) 
            return validacaoId

        let result = await tipoDosagemDAO.selectByIdTipoDosagem(id)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.tipo_dosagem = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirTipoDosagemService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarTipoDosagemService(id)
        if (!buscarID.status) 
            return buscarID

        let result = await tipoDosagemDAO.deleteTipoDosagem(id)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirTipoDosagemService,
    atualizarTipoDosagemService,
    listarTipoDosagemService,
    buscarTipoDosagemService,
    excluirTipoDosagemService
}
