
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio da EXCLUSÃO DE MEDICAMENTOS DO USUÁRIO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 28/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')

const medicamentoService = require('../../services/medicamento/service_medicamento.js')
const receitaMedicaService = require('../../services/receita_medica/service_receita_medica.js')
const estoqueService = require('../../services/estoque/service_estoque.js')

const knexConection = require('../../models/global_knex/global_knex.js')

const excluirMedicamentoUsuario = async function (idReceitaMedica, idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await knexConection.transaction(async function (transaction) {

            let buscarReceita = await receitaMedicaService.buscarReceitaMedicaService(idReceitaMedica, transaction)

            if (!buscarReceita.status) {
                let error = new Error('Não foi possível encontrar a receita médica.')
                error.resposta = buscarReceita
                throw error
            }

            let receitaMedica = buscarReceita.response.receita_medica[0]

            if (receitaMedica.id_usuario != idUsuario) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_USUARIO']

                let error = new Error('A receita médica não pertence ao usuário.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            let idMedicamento = receitaMedica.id_medicamento
            let idEstoque = receitaMedica.id_estoque
            let medicamentoParticular = receitaMedica.id_usuario_medicamento

            if (medicamentoParticular != null && receitaMedica.id_usuario_medicamento != idUsuario) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_MEDICAMENTO']

                let error = new Error('O medicamento não pertence ao usuário.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            let excluirReceita = await receitaMedicaService.excluirReceitaMedicaService(idReceitaMedica, transaction)

            if (!excluirReceita.status) {
                let error = new Error('Não foi possível excluir a receita médica.')
                error.resposta = excluirReceita
                throw error
            }

            let excluirEstoque = await estoqueService.excluirEstoqueService(idEstoque, transaction)

            if (!excluirEstoque.status) {
                let error = new Error('Não foi possível excluir o estoque.')
                error.resposta = excluirEstoque
                throw error
            }

            if (medicamentoParticular) {
                let excluirMedicamento = await medicamentoService.excluirMedicamentoService(idMedicamento, idUsuario, transaction)

                if (!excluirMedicamento.status) {
                    let error = new Error('Não foi possível excluir o medicamento.')
                    error.resposta = excluirMedicamento
                    throw error
                }
            }

            return customMessages.SUCCESS_DELETE_ITEM
        })

        return result

    } catch (error) {
        if (error.resposta)
            return error.resposta

        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    excluirMedicamentoUsuario
}
