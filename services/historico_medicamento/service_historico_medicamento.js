/*******************************************************************************************
 * Objetivo: Regras de negócio e chamada ao DAO
 * Data: 22/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const historicoMedicamentoDAO = require('../../models/DAO/historico_medicamento/historico_medicamento.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const historicoMedicamentoSchema = require('../../schemas/historicoMedicamentoSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosHistoricoMedicamento = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(historicoMedicamentoSchema, dados, customMessages)
}

const inserirHistoricoMedicamentoService = async function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosHistoricoMedicamento(dados)
        if (validacao)
            return validacao

        let result = await historicoMedicamentoDAO.insertHistoricoMedicamento(dados)
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
        console.log('ERRO NA SERVICE DE HISTORICO:')
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const atualizarHistoricoMedicamentoService = async function (dados, id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarHistoricoMedicamentoService(id)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDadosHistoricoMedicamento(dados)
        if (validacao)
            return validacao

        dados.id = Number(id)
        let result = await historicoMedicamentoDAO.updateHistoricoMedicamento(dados, id)
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

const listarHistoricoMedicamentoService = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await historicoMedicamentoDAO.getHistoricoMedicamento()
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.historico_medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarHistoricoMedicamentoService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await historicoMedicamentoDAO.getHistoricoMedicamentoByID(id)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.historico_medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarHistoricoPorIdHorarioService = async function (idHorario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(idHorario, customMessages)
        if (validarID)
            return validarID

        let result = await historicoMedicamentoDAO.selectByIdHorarioHistoricoMedicamento(idHorario)

        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
            customMessages.DEFAULT_MESSAGE.response.historico = result

            return customMessages.DEFAULT_MESSAGE
        } else {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirHistoricoMedicamentoService = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarHistoricoMedicamentoService(id)
        if (!buscarID.status)
            return buscarID

        let result = await historicoMedicamentoDAO.deleteHistoricoMedicamentoByID(id)
        if (result)
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirHistoricoMedicamentoService,
    atualizarHistoricoMedicamentoService,
    listarHistoricoMedicamentoService,
    buscarHistoricoMedicamentoService,
    buscarHistoricoPorIdHorarioService,
    excluirHistoricoMedicamentoService
}