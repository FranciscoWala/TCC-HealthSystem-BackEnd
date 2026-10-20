/*******************************************************************************************
 * Objetivo: Regras de negócio e chamada ao DAO
 * Data: 16/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const tipoIntervaloDAO = require('../../models/DAO/tipo_intervalo/tipo_intervalo.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const tipoIntervaloSchema = require('../../schemas/tipoIntervaloSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosTipoIntervalo = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(tipoIntervaloSchema, dados, customMessages)
}

const inserirTipoIntervaloService = async function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosTipoIntervalo(dados)
        if (validacao) 
            return validacao

        let result = await tipoIntervaloDAO.insertTipoIntervalo(dados)
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

const atualizarTipoIntervaloService = async function (dados, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {

        let buscarID = await buscarTipoIntervaloService(id)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosTipoIntervalo(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await tipoIntervaloDAO.updateTipoIntervalo(dados)
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

const listarTipoIntervaloService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await tipoIntervaloDAO.selectAllTipoIntervalo()
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.tipoIntervalo = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarTipoIntervaloService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) 
            return validacaoId

        let result = await tipoIntervaloDAO.selectByIdTipoIntervalo(id)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.tipoIntervalo = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirTipoIntervaloService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarTipoIntervaloService(id)
        if (!buscarID.status) 
            return buscarID

        let result = await tipoIntervaloDAO.deleteTipoIntervalo(id)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirTipoIntervaloService,
    atualizarTipoIntervaloService,
    listarTipoIntervaloService,
    buscarTipoIntervaloService,
    excluirTipoIntervaloService
}
