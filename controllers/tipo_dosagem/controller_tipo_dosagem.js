/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da TIPO DE DOSAGEM
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 16/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const tipoDosagemDAO = require('../../models/DAO/tipo_dosagem/tipo_dosagem.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const validarDados = require('../../utils/validar_dados/validarDados.js')
const tipoDosagemSchema = require('../../schemas/tipoDosagemSchema.js')

const validarDadosTipoDosagem = function (tipoDosagem) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(tipoDosagemSchema, tipoDosagem, customMessages)
}

const inserirNovoTipoDosagem = async function (tipoDosagem, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = validarDadosTipoDosagem(tipoDosagem)

            if (validar)
                return validar
            else {
                let result = await tipoDosagemDAO.insertTipoDosagem(tipoDosagem)

                if (result) {
                    tipoDosagem.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = tipoDosagem

                    return customMessages.DEFAULT_MESSAGE
                } else
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarTipoDosagem = async function (tipoDosagem, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarTipoDosagem(id)

            if (resultBuscarID.status) {
                let validar = await validarDadosTipoDosagem(tipoDosagem)

                if (validar)
                    return validar
                else {
                    tipoDosagem.id = Number(id)

                    let result = await tipoDosagemDAO.updateTipoDosagem(tipoDosagem)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = tipoDosagem

                        return customMessages.DEFAULT_MESSAGE
                    } else
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL
                }
            } else
                return resultBuscarID
        } else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarTipoDosagem = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await tipoDosagemDAO.selectAllTipoDosagem()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count           = result.length
                customMessages.DEFAULT_MESSAGE.response.tipo_dosagem    = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarTipoDosagem = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id, customMessages)

        if (validarID) {
            return validarID
        } else {
            let result = await tipoDosagemDAO.selectByIdTipoDosagem(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.tipo_dosagem    = result

                    return customMessages.DEFAULT_MESSAGE
                } else
                    return customMessages.ERROR_NOT_FOUND
            } else
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirTipoDosagem = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarTipoDosagem(id)

        if (resultBuscarID.status) {
            let result = await tipoDosagemDAO.deleteTipoDosagem(id)

            if (result)
                return customMessages.SUCCESS_DELETE_ITEM
            else
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
        } else
            return resultBuscarID
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