/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 20/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const estoqueDAO = require('../../models/DAO/estoque/estoque.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const estoqueSchema = require('../../schemas/estoqueSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosEstoque = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(estoqueSchema, dados, customMessages)
}

const inserirEstoqueService = async function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosEstoque(dados)
        if (validacao) 
            return validacao

        let result = await estoqueDAO.insertEstoque(dados)
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

const atualizarEstoqueService = async function (dados, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarEstoqueService(id)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosEstoque(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await estoqueDAO.updateEstoque(dados)
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

const listarEstoqueService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await estoqueDAO.selectAllEstoques()
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.estoque = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarEstoqueService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) 
            return validacaoId

        let result = await estoqueDAO.selectByIdEstoque(id)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.estoque = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirEstoqueService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarEstoqueService(id)
        if (!buscarID.status) 
            return buscarID

        let result = await estoqueDAO.deleteEstoque(id)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirEstoqueService,
    atualizarEstoqueService,
    listarEstoqueService,
    buscarEstoqueService,
    excluirEstoqueService
}
