/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da ROLE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 09/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA DAO
const tipoIntervaloDAO = require('../../models/DAO/tipo_intervalo/tipo_intervalo.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const validarDados = require('../../utils/validarDados.js')
const tipoIntervaloSchema = require('../../schemas/tipoIntervaloSchema.js')
const idSchema = require('../../schemas/idSchema.js')

const validarDadosTipoIntervalo = async function (tipoIntervalo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados(tipoIntervaloSchema, tipoIntervalo, customMessages)
}

const inserirNovoTipoIntervalo = async function (tipoIntervalo, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDadosTipoIntervalo(tipoIntervalo)

            if (validar)
                return validar
            else {
                let result = await tipoIntervaloDAO.insertTipoIntervalo(tipoIntervalo)

                if (result) {
                    tipoIntervalo.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = tipoIntervalo

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

const atualizarTipoIntervalo = async function (tipoIntervalo, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarTipoIntervalo(id)

            if (resultBuscarID.status) {
                let validar = await validarDadosTipoIntervalo(tipoIntervalo)

                if (validar)
                    return validar
                else {
                    tipoIntervalo.id = Number(id)

                    let result = await tipoIntervaloDAO.updateTipoIntervalo(tipoIntervalo)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = tipoIntervalo

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

const listarTipoIntervalo = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await tipoIntervaloDAO.selectAllTipoIntervalo()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count           = result.length
                customMessages.DEFAULT_MESSAGE.response.tipo_intervalo  = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarTipoIntervalo = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        const { error } = idSchema.validate(id)

        if (error) {
            customMessages.ERROR_BAD_REQUEST.field = error.details[0].message
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await tipoIntervaloDAO.selectByIdTipoIntervalo(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                   = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code              = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.tipo_intervalo  = result

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

const excluirTipoIntervalo = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarTipoIntervalo(id)

        if (resultBuscarID.status) {
            let result = await tipoIntervaloDAO.deleteTipoIntervalo(id)

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
    inserirNovoTipoIntervalo,
    atualizarTipoIntervalo,
    listarTipoIntervalo,
    buscarTipoIntervalo,
    excluirTipoIntervalo
}