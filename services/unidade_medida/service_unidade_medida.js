/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 16/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const unidadeMedidaDAO = require('../../models/DAO/unidade_medida/unidade_medida.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const unidadeMedidaSchema = require('../../schemas/unidadeMedidaSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

// Função para validar os dados
const validarDadosUnidadeMedida = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(unidadeMedidaSchema, dados, customMessages)
}

// Inserir um novo registro
const inserirUnidadeMedidaService = async function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosUnidadeMedida(dados)
        if (validacao)
             return validacao

        let result = await unidadeMedidaDAO.insertUnidadeMedida(dados)
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

// Atualizar um registro
const atualizarUnidadeMedidaService = async function (dados, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarUnidadeMedidaService(id)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosUnidadeMedida(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await unidadeMedidaDAO.updateUnidadeMedida(dados)
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

// Listar registros
const listarUnidadeMedidaService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await unidadeMedidaDAO.selectAllUnidadeMedida()
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.unidade_medida = result
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

// Buscar um registro pelo ID
const buscarUnidadeMedidaService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) return validacaoId

        let result = await unidadeMedidaDAO.selectByIdUnidadeMedida(id)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.unidade_medida = result
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

// Excluir um registro
const excluirUnidadeMedidaService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarUnidadeMedidaService(id)
        if (!buscarID.status) 
            return buscarID

        let result = await unidadeMedidaDAO.deleteUnidadeMedida(id)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirUnidadeMedidaService,
    atualizarUnidadeMedidaService,
    listarUnidadeMedidaService,
    buscarUnidadeMedidaService,
    excluirUnidadeMedidaService
}