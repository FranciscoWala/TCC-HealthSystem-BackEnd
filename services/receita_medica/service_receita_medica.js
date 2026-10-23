/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 20/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const receitaMedicaDAO = require('../../models/DAO/receita_medica/receita_medica.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const receitaMedicaSchema = require('../../schemas/receitaMedicaSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosReceitaMedica = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(receitaMedicaSchema, dados, customMessages)
}

const inserirReceitaMedicaService = async function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosReceitaMedica(dados)
        if (validacao) 
            return validacao

        let result = await receitaMedicaDAO.insertReceitamedica(dados)
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

const atualizarReceitaMedicaService = async function (dados, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarReceitaMedicaService(id)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosReceitaMedica(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await receitaMedicaDAO.updateReceitaMedica(dados, id)
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

const listarReceitaMedicaService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await receitaMedicaDAO.getReceitaMedica()
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.receita_medica = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarReceitaMedicaService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) 
            return validacaoId

        let result = await receitaMedicaDAO.getReceitaMedicaByID(id)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.receita_medica = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirReceitaMedicaService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarReceitaMedicaService(id)
        if (!buscarID.status) 
            return buscarID

        let result = await receitaMedicaDAO.deleteReceitaMedicaByID(id)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirReceitaMedicaService,
    atualizarReceitaMedicaService,
    listarReceitaMedicaService,
    buscarReceitaMedicaService,
    excluirReceitaMedicaService
}
