/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 09/11/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const usuarioGoogleDAO = require('../../models/DAO/usuario_google/usuario_google.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const usuarioGoogleSchema = require('../../schemas/usuarioGoogleSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosUsuarioGoogle = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(usuarioGoogleSchema, dados, customMessages)
}

const inserirUsuarioGoogleService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosUsuarioGoogle(dados)
        if (validacao)
            return validacao

        let result = await usuarioGoogleDAO.insertUsuarioGoogle(dados, transaction)
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

const buscarUsuarioGooglePorGoogleIdService = async function (googleId, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDados.validarDados(
            usuarioGoogleSchema.extract('google_id'),
            googleId,
            customMessages
        )
        if (validacao)
            return validacao

        let result = await usuarioGoogleDAO.selectUsuarioGoogleByGoogleId(googleId, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.usuario_google = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarUsuarioGooglePorIdUsuarioService = async function (idUsuario, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(idUsuario, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await usuarioGoogleDAO.selectUsuarioGoogleByIdUsuario(idUsuario, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.usuario_google = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirUsuarioGoogleService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await usuarioGoogleDAO.deleteUsuarioGoogle(id, transaction)
        if (result)
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_NOT_FOUND
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirUsuarioGoogleService,
    buscarUsuarioGooglePorGoogleIdService,
    buscarUsuarioGooglePorIdUsuarioService,
    excluirUsuarioGoogleService
}