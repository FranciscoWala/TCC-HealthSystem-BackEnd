/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de DOENÇAS CRONICAS
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 09/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA DAO
const doencaCronicaDAO = require('../../model/DAO/doencas_cronicas/doenca_cronica.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const doencaCronicasSchema = require('../../schemas/doencaCronicaSchema.js')
const idSchema = require('../../schemas/idSchema.js')

const validarDados = async function (doencaCronica) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    const { error } = doencaCronicasSchema.validate(doencaCronica)

    if (error) {
        customMessages.ERROR_BAD_REQUEST.field = error.details[0].message
        return customMessages.ERROR_BAD_REQUEST
    }

    return false
}

const inserirNovaDoencaCronica = async function (doencaCronica, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = await validarDados(doencaCronica)

            if (validar)
                return validar
            else {
                let result = await doencaCronicaDAO.insertDoencaCronica(doencaCronica)

                if (result) {
                    doencaCronica.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = doencaCronica

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

const atualizarDoencaCronica = async function (doencaCronica, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarDoencaCronica(id)

            if (resultBuscarID.status) {
                let validar = await validarDados(doencaCronica)

                if (validar)
                    return validar
                else {
                    doencaCronica.id = Number(id)

                    let result = await doencaCronicaDAO.updateDoencaCronica(doencaCronica)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = doencaCronica

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

const listarDoencaCronica = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await doencaCronicaDAO.selectAllDoencasCronicas()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status                       = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code                  = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count               = result.length
                customMessages.DEFAULT_MESSAGE.response.doencas_cronicas    = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDoencaCronica = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        const { error } = idSchema.validate(id)

        if (error) {
            customMessages.ERROR_BAD_REQUEST.field = error.details[0].message
            return customMessages.ERROR_BAD_REQUEST
        } else {
            let result = await doencaCronicaDAO.selectByIdDoencasCronicas(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                       = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code                  = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.doencas_cronicas    = result

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

const excluirDoencaCronica = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarDoencaCronica(id)

        if (resultBuscarID.status) {
            let result = await doencaCronicaDAO.deleteDoencaCronica(id)

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
    inserirNovaDoencaCronica,
    atualizarDoencaCronica,
    listarDoencaCronica,
    buscarDoencaCronica,
    excluirDoencaCronica
}