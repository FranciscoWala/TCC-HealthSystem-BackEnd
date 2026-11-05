/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 25/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const programacaoMedicamentoDAO = require('../../models/DAO/programacao_medicamento/programacao_medicamento.js')

const tipoIntervaloService = require('../tipo_intervalo/service_tipo_intervalo.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const programacaoMedicamentoSchema = require('../../schemas/programacaoMedicamentoSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosProgramacaoMedicamento = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(programacaoMedicamentoSchema, dados, customMessages)
}

const inserirProgramacaoMedicamentoService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosProgramacaoMedicamento(dados)
        if (validacao)
            return validacao

        let tipoIntervalo = await tipoIntervaloService.buscarTipoIntervaloService(dados.id_tipo_intervalo, transaction)

        if (!tipoIntervalo.status) {
            if (tipoIntervalo.status_code == 404) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_TIPO_INTERVALO']
                return customMessages.ERROR_BAD_REQUEST
            }

            return tipoIntervalo
        }

        let result = await programacaoMedicamentoDAO.insertProgramacaoMedicamento(dados, transaction)
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

const atualizarProgramacaoMedicamentoService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarProgramacaoMedicamentoService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDados.validarDados(
            programacaoMedicamentoSchema
                .extract('data_hora_fim')
                .required()
                .invalid(null),
            dados.data_hora_fim,
            customMessages
        )
        if (validacao)
            return validacao

        dados.id = Number(id)
        let result = await programacaoMedicamentoDAO.updateProgramacaoMedicamento(dados, transaction)
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

const atualizarDadosProgramacaoMedicamentoService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let buscarID = await buscarProgramacaoMedicamentoService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDados.validarDados(
            programacaoMedicamentoSchema.extract('frequencia'),
            dados.frequencia,
            customMessages
        )
        if (validacao)
            return validacao

        validacao = validarDados.validarDados(
            programacaoMedicamentoSchema.extract('data_hora_inicio'),
            dados.data_hora_inicio,
            customMessages
        )
        if (validacao)
            return validacao

        validacao = validarDados.validarDados(
            programacaoMedicamentoSchema.extract('id_tipo_intervalo'),
            dados.id_tipo_intervalo,
            customMessages
        )
        if (validacao)
            return validacao

        let tipoIntervalo = await tipoIntervaloService.buscarTipoIntervaloService(dados.id_tipo_intervalo, transaction)

        if (!tipoIntervalo.status) {
            if (tipoIntervalo.status_code == 404) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_TIPO_INTERVALO']
                return customMessages.ERROR_BAD_REQUEST
            }

            return tipoIntervalo
        }

        dados.id = Number(id)

        let result = await programacaoMedicamentoDAO.updateDadosProgramacaoMedicamento(dados, transaction)

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

const atualizarFimProgramacaoMedicamentoService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let buscarID = await buscarProgramacaoMedicamentoService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDados.validarDados(
            programacaoMedicamentoSchema
                .extract('data_hora_fim')
                .required()
                .invalid(null),
            dados.data_hora_fim,
            customMessages
        )

        if (validacao)
            return validacao

        let result = await programacaoMedicamentoDAO.updateFimProgramacaoMedicamento(id, dados.data_hora_fim, transaction)

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

const listarProgramacaoMedicamentoService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await programacaoMedicamentoDAO.selectProgramacaoMedicamento(transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.programacao_medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarProgramacaoMedicamentoService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await programacaoMedicamentoDAO.selectByIdProgramacaoMedicamento(id, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.programacao_medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarProgramacaoPorIdReceitaService = async function (idReceitaMedica, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(idReceitaMedica, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await programacaoMedicamentoDAO.selectProgramacaoMedicamentoByIdReceita(idReceitaMedica, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.programacao_medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarProgramacaoPorIdUsuarioService = async function (idUsuario, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(idUsuario, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await programacaoMedicamentoDAO.selectByIdUsuarioProgramacaoMedicamento(idUsuario, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.programacao_medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}


const excluirProgramacaoMedicamentoService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarProgramacaoMedicamentoService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let result = await programacaoMedicamentoDAO.deleteProgramacaoMedicamento(id, transaction)
        if (result)
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirProgramacaoMedicamentoService,
    atualizarProgramacaoMedicamentoService,
    atualizarDadosProgramacaoMedicamentoService,
    atualizarFimProgramacaoMedicamentoService,
    listarProgramacaoMedicamentoService,
    buscarProgramacaoMedicamentoService,
    buscarProgramacaoPorIdReceitaService,
    buscarProgramacaoPorIdUsuarioService,
    excluirProgramacaoMedicamentoService,
}
