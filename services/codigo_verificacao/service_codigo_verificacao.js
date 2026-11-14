/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 12/11/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const codigoVerificacaoDAO = require('../../models/DAO/codigo_verificacao/codigo_verificacao.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const codigoVerificacaoSchema = require('../../schemas/codigoVerificacaoSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosCodigoVerificacao = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(codigoVerificacaoSchema, dados, customMessages)
}

const inserirCodigoVerificacaoService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosCodigoVerificacao(dados)
        if (validacao)
            return validacao

        let result = await codigoVerificacaoDAO.insertCodigoVerificacao(dados, transaction)

        if (result == 'CODIGO_DUPLICADO') {
            customMessages.ERROR_BAD_REQUEST.message = 'CÓDIGO DUPLICADO'
            customMessages.ERROR_BAD_REQUEST.error_code = 'CODIGO_DUPLICADO'

            return customMessages.ERROR_BAD_REQUEST
        }

        if (result) {
            dados.id = result

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = { id: result }

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const atualizarCodigoVerificacaoService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarCodigoVerificacaoService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDadosCodigoVerificacao(dados)
        if (validacao)
            return validacao

        dados.id = Number(id)

        let result = await codigoVerificacaoDAO.updateCodigoVerificacao(dados, transaction)
        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = { id: Number(id) }

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarCodigoVerificacaoService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await codigoVerificacaoDAO.selectByIdCodigoVerificacao(id, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.codigo_verificacao = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarCodigosUsuarioTipoService = async function (idUsuario, tipo, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(idUsuario, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await codigoVerificacaoDAO.selectByUsuarioTipoCodigoVerificacao(idUsuario, tipo, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.codigos_verificacao = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarCodigoPorHashTipoService = async function (codigoHash, tipo, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await codigoVerificacaoDAO.selectByHashTipoCodigoVerificacao(codigoHash, tipo, transaction)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.codigos_verificacao = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarCodigoPorHashTipoBloqueadoService = async function (codigoHash, tipo, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!codigoHash || !tipo)
            return customMessages.ERROR_BAD_REQUEST

        let result = await codigoVerificacaoDAO.selectByHashTipoCodigoVerificacaoBloqueado(codigoHash, tipo, transaction)

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.codigos_verificacao = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarCodigosPorEmailTipoService = async function (email, tipo, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!email || !tipo)
            return customMessages.ERROR_BAD_REQUEST

        let result = await codigoVerificacaoDAO.selectByEmailTipoCodigoVerificacao(email, tipo, transaction)

        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
            customMessages.DEFAULT_MESSAGE.response.codigos_verificacao = result

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarCodigoPorEmailTipoBloqueadoService = async function (email, tipo, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!email || !tipo)
            return customMessages.ERROR_BAD_REQUEST

        let result = await codigoVerificacaoDAO.selectByEmailTipoBloqueadoCodigoVerificacao(email, tipo, transaction)

        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
            customMessages.DEFAULT_MESSAGE.response.codigos_verificacao = result

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirCodigoVerificacaoService,
    atualizarCodigoVerificacaoService,
    buscarCodigoVerificacaoService,
    buscarCodigosUsuarioTipoService,
    buscarCodigoPorHashTipoService,
    buscarCodigoPorHashTipoBloqueadoService,

    buscarCodigosPorEmailTipoService,
    buscarCodigoPorEmailTipoBloqueadoService
}