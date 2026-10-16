/*******************************************************************************************
 * Objetivo: Regras de negócio e chamada ao DAO
 * Data: 16/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')
const unidadeMedidaDAO = require('../../models/DAO/unidade_medida/unidade_medida.js')
const unidadeMedidaSchema = require('../../schemas/unidadeMedidaSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const inserirUnidadeMedidaService = async function (dadosUnidade) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = validarDados.validarDados(unidadeMedidaSchema, dadosUnidade, customMessages)

        if (validar)
            return validar
        else {
            let result = await unidadeMedidaDAO.insertUnidadeMedida(dadosUnidade)
            if (result) {
                dadosUnidade.id = result
                return { status: true, data: dadosUnidade }
            } else {
                return false
            }
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const listarUnidadeMedidaService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = unidadeMedidaDAO.selectAllUnidadeMedida()

        if (result && result.length > 0)
            return result

        return false
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarUnidadeMedidaService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id, customMessages)

        if (validarID)
            return validarID

        let result = unidadeMedidaDAO.selectByIdUnidadeMedida(id)

        if (result && result.length > 0)
            return result[0]

        return false
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const atualizarUnidadeMedidaService = async function (dadosUnidade, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id, customMessages)

        if (validarID)
            return validarID
        else {
            let validar = validarDados.validarDados(unidadeMedidaSchema, dadosUnidade, customMessages)

            if (validar)
                return validar

            dadosUnidade.id = Number(id)
            let result = await unidadeMedidaDAO.updateUnidadeMedida(dadosUnidade)
            if (result) {
                return { status: true, data: dadosUnidade }
            }

            return false
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirUnidadeMedidaService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id)

        if (validarID)
            return validarID

        let result = unidadeMedidaDAO.deleteUnidadeMedida(id)

        if (result)
            return { status: true, data: dadosUnidade }

        return false
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirUnidadeMedidaService,
    listarUnidadeMedidaService,
    buscarUnidadeMedidaService,
    atualizarUnidadeMedidaService,
    excluirUnidadeMedidaService
}