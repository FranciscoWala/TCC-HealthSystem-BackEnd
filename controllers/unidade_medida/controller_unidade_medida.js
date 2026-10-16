/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da UNIDADE DE MEDIDA
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 16/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA DAO
const unidadeMedidaDAO = require('../../models/DAO/unidade_medida/unidade_medida.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const validarDados = require('../../utils/validarDados.js')
const unidadeMedidaSchema = require('../../schemas/unidadeMedidaSchema.js')

const validarDadosUnidadeMedida = function (unidadeMedida) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(unidadeMedidaSchema, unidadeMedida, customMessages)
}

const inserirNovaUnidadeMedida = async function (unidadeMedida, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = validarDadosUnidadeMedida(unidadeMedida)

            if (validar)
                return validar
            else {
                let result = await unidadeMedidaDAO.insertUnidadeMedida(unidadeMedida)

                if (result) {
                    unidadeMedida.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = unidadeMedida

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

const atualizarUnidadeMedida = async function (unidadeMedida, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarUnidadeMedida(id)

            if (resultBuscarID.status) {
                let validar = await validarDadosUnidadeMedida(unidadeMedida)

                if (validar)
                    return validar
                else {
                    unidadeMedida.id = Number(id)

                    let result = await unidadeMedidaDAO.updateUnidadeMedida(unidadeMedida)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = unidadeMedida

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

const listarUnidadeMedida = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await unidadeMedidaDAO.selectAllUnidadeMedida()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count           = result.length
                customMessages.DEFAULT_MESSAGE.response.unidade_medida  = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUnidadeMedida = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id, customMessages)

        if (validarID) {
            return validarID
        } else {
            let result = await unidadeMedidaDAO.selectByIdUnidadeMedida(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.unidade_medida  = result

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

const excluirUnidadeMedida = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarUnidadeMedida(id)

        if (resultBuscarID.status) {
            let result = await unidadeMedidaDAO.deleteUnidadeMedida(id)

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
    inserirNovaUnidadeMedida,
    atualizarUnidadeMedida,
    listarUnidadeMedida,
    buscarUnidadeMedida,
    excluirUnidadeMedida
}