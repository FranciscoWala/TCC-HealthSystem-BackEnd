/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 22/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const contatoEmergenciaUsuarioDAO = require('../../models/DAO/contato_emergencia_usuarios/contato_emergencia_usuarios.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const contatoEmergenciaUsuarioSchema = require('../../schemas/contatoEmergenciaUsuarioSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosContatoEmergenciaUsuario = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(contatoEmergenciaUsuarioSchema, dados, customMessages)
}

const inserirContatoEmergenciaUsuarioService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosContatoEmergenciaUsuario(dados)
        if (validacao) 
            return validacao

        let result = await contatoEmergenciaUsuarioDAO.insertContatoEmergenciaUsuario(dados, transaction)
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

const atualizarContatoEmergenciaUsuarioService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarContatoEmergenciaUsuarioService(id, transaction)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosContatoEmergenciaUsuario(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await contatoEmergenciaUsuarioDAO.updateContatoEmergenciaUsuario(dados, id, transaction)
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

const listarContatoEmergenciaUsuarioService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await contatoEmergenciaUsuarioDAO.selectContatoEmergenciaUsuario(transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.contato_emergencia_usuarios = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarContatoEmergenciaUsuarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) 
            return validacaoId

        let result = await contatoEmergenciaUsuarioDAO.selectContatosEmergenciaByID(id, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.contato_emergencia_usuarios = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirContatoEmergenciaUsuarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarContatoEmergenciaUsuarioService(id, transaction)
        if (!buscarID.status) 
            return buscarID

        let result = await contatoEmergenciaUsuarioDAO.deleteContatoEmergenciaUsuarioByID(id, transaction)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirContatoEmergenciaUsuarioService,
    atualizarContatoEmergenciaUsuarioService,
    listarContatoEmergenciaUsuarioService,
    buscarContatoEmergenciaUsuarioService,
    excluirContatoEmergenciaUsuarioService
}
