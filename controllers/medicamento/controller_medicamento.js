/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD do MEDICAMENTO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 16/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const medicamentoDAO = require('../../models/DAO/medicamentos/medicamentos.js')

// IMPORT DAS CONTROLLERS
const controllerUnidadeMedida = require('../unidade_medida/controller_unidade_medida.js')
const controllerTipoDosagem = require('../tipo_dosagem/controller_tipo_dosagem.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const validarDados = require('../../utils/validar_dados/validarDados.js')
const medicamentoSchema = require('../../schemas/medicamentoSchema.js')

const validarDadosMedicamento = function (medicamento) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(medicamentoSchema, medicamento, customMessages)
}

const inserirNovoMedicamento = async function (medicamento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = validarDadosMedicamento(medicamento)

            if (validar)
                return validar
            else {
                let result = await medicamentoDAO.insertMedicamento(medicamento)

                if (result) {
                    medicamento.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = medicamento

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

const atualizarMedicamento = async function (medicamento, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarMedicamento(id)

            if (resultBuscarID.status) {
                let validar = await validarDadosMedicamento(medicamento)

                if (validar)
                    return validar
                else {
                    medicamento.id = Number(id)

                    let result = await medicamentoDAO.updateMedicamento(medicamento)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = medicamento

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

const listarMedicamento = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await medicamentoDAO.selectAllMedicamentos()

        if (result) {
            if (result.length > 0) {
                for (let medicamento of result) {
                    let resultUnidadeMedida = await controllerUnidadeMedida.buscarUnidadeMedida(medicamento.id_unidade_medida_embalagem)

                    if (resultUnidadeMedida.status) {
                        medicamento.unidade_medida_embalagem = resultUnidadeMedida.response.unidade_medida

                        delete medicamento.id_unidade_medida_embalagem
                    }

                    let resultTipoDosagem = await controllerTipoDosagem.buscarTipoDosagem(medicamento.id_tipo_dosagem)

                    if (resultTipoDosagem.status) {
                        medicamento.tipo_dosagem = resultTipoDosagem.response.tipo_dosagem

                        delete medicamento.id_tipo_dosagem
                    }
                }

                customMessages.DEFAULT_MESSAGE.status               = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code          = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count       = result.length
                customMessages.DEFAULT_MESSAGE.response.medicamento = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id, customMessages)

        if (validarID) {
            return validarID
        } else {
            let result = await medicamentoDAO.selectByIdMedicamento(id)

            if (result) {
                if (result.length > 0) {
                    for (let medicamento of result) {
                        let resultUnidadeMedida = await controllerUnidadeMedida.buscarUnidadeMedida(medicamento.id_unidade_medida_embalagem)
    
                        if (resultUnidadeMedida.status) {
                            medicamento.unidade_medida_embalagem = resultUnidadeMedida.response.unidade_medida
    
                            delete medicamento.id_unidade_medida_embalagem
                        }
    
                        let resultTipoDosagem = await controllerTipoDosagem.buscarTipoDosagem(medicamento.id_tipo_dosagem)
    
                        if (resultTipoDosagem.status) {
                            medicamento.tipo_dosagem = resultTipoDosagem.response.tipo_dosagem
    
                            delete medicamento.id_tipo_dosagem
                        }
                    }

                    customMessages.DEFAULT_MESSAGE.status               = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code          = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.medicamento = result

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

const excluirMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarMedicamento(id)

        if (resultBuscarID.status) {
            let result = await medicamentoDAO.deleteMedicamento(id)

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
    inserirNovoMedicamento,
    atualizarMedicamento,
    listarMedicamento,
    buscarMedicamento,
    excluirMedicamento
}