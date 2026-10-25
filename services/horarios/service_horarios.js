
/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 22/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const horariosDAO = require('../../models/DAO/horarios/horarios.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const horarioSchema = require('../../schemas/horarioSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosHorario = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(horarioSchema, dados, customMessages)
}

const inserirHorarioService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosHorario(dados)
        if (validacao)
            return validacao

        let result = await horariosDAO.insertHorario(dados, transaction)
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

const atualizarHorarioService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarHorarioService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDadosHorario(dados)
        if (validacao)
            return validacao

        dados.id = Number(id)
        let result = await horariosDAO.updateHorario(dados, transaction)
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

const listarHorarioService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await horariosDAO.selectAllHorarios(transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.horarios = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarHorarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await horariosDAO.selectByIdHorario(id, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.horarios = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

// Listar horários de medicamentos não tomados
const listarHorariosNaoTomadosService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await horariosDAO.selectHorariosNaoTomados(transaction)

        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
            customMessages.DEFAULT_MESSAGE.response.count = result.length
            customMessages.DEFAULT_MESSAGE.response.horarios = result

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirHorarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarHorarioService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let result = await horariosDAO.deleteHorario(id, transaction)
        if (result)
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirHorarioService,
    atualizarHorarioService,
    listarHorarioService,
    buscarHorarioService,
    listarHorariosNaoTomadosService,
    excluirHorarioService
}
