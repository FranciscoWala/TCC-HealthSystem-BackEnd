/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 20/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const doencaCronicaDAO = require('../../models/DAO/doencas_cronicas/doenca_cronica.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const doencaCronicasSchema = require('../../schemas/doencaCronicaSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosDoencaCronica = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(doencaCronicasSchema, dados, customMessages)
}

const inserirDoencaCronicaService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosDoencaCronica(dados)
        if (validacao) 
            return validacao

        let result = await doencaCronicaDAO.insertDoencaCronica(dados, transaction)
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

const atualizarDoencaCronicaService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarDoencaCronicaService(id, transaction)
        if (!buscarID.status) 
            return buscarID

        let validacao = validarDadosDoencaCronica(dados)
        if (validacao) 
            return validacao

        dados.id = Number(id)
        let result = await doencaCronicaDAO.updateDoencaCronica(dados, transaction)
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

const listarDoencaCronicaService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await doencaCronicaDAO.selectAllDoencasCronicas(transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.doencas_cronicas = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarDoencaCronicaService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId) 
            return validacaoId

        let result = await doencaCronicaDAO.selectByIdDoencasCronicas(id, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.doencas_cronicas = result
                
                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirDoencaCronicaService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarDoencaCronicaService(id, transaction)
        if (!buscarID.status) 
            return buscarID

        let result = await doencaCronicaDAO.deleteDoencaCronica(id, transaction)
        if (result) 
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

//Revisar este código
const buscarDoencaCronicaPorNomeService = async function (nome, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages));

    try {
        // Validação básica do nome
        if (typeof nome !== 'string' || !nome.trim()) {
            return customMessages.ERROR_INVALID_DATA;
        }

        let result = await doencaCronicaDAO.selectByNomeDoencasCronicas(
            nome.trim(),
            transaction
        );

        if (result === false) {
            return customMessages.ERROR_INTERNAL_SERVER_MODEL;
        }

        if (result) {
            customMessages.DEFAULT_MESSAGE.status =
                customMessages.SUCCESS_RESPONSE.status;

            customMessages.DEFAULT_MESSAGE.status_code =
                customMessages.SUCCESS_RESPONSE.status_code;

            customMessages.DEFAULT_MESSAGE.response.doencas_cronicas = [result];

            return customMessages.DEFAULT_MESSAGE;
        }

        return customMessages.ERROR_NOT_FOUND;

    } catch (error) {
        console.log(error);
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE;
    }
}


module.exports = {
    inserirDoencaCronicaService,
    atualizarDoencaCronicaService,
    listarDoencaCronicaService,
    buscarDoencaCronicaService,
    excluirDoencaCronicaService,
    buscarDoencaCronicaPorNomeService
}
