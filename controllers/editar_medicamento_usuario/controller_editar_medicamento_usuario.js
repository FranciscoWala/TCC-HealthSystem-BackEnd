
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio da EDIÇÃO DE MEDICAMENTOS DO USUÁRIO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 28/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')

const medicamentoService = require('../../services/medicamento/service_medicamento.js')
const receitaMedicaService = require('../../services/receita_medica/service_receita_medica.js')
const estoqueService = require('../../services/estoque/service_estoque.js')
const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')

const controllerAlterarProgramacao = require('../alterar_programacao_medicamento/controller_alterar_programacao_medicamento.js')

const knexConection = require('../../models/global_knex/global_knex.js')

const editarMedicamentoUsuario = async function (idReceitaMedica, idUsuario, dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

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
                let medicamentoParticular = receitaMedica.id_usuario_medicamento != null

                if (medicamentoParticular && receitaMedica.id_usuario_medicamento != idUsuario) {
                    customMessages.ERROR_BAD_REQUEST.field = ['ID_MEDICAMENTO']

                    let error = new Error('O medicamento não pertence ao usuário.')
                    error.resposta = customMessages.ERROR_BAD_REQUEST
                    throw error
                }

                if (dados.medicamento) {

                    if (!medicamentoParticular) {
                        customMessages.ERROR_BAD_REQUEST.field = ['MEDICAMENTO_GLOBAL']

                        let error = new Error('Medicamentos globais não podem ser editados.')
                        error.resposta = customMessages.ERROR_BAD_REQUEST
                        throw error
                    }

                    let buscarMedicamento = await medicamentoService.buscarMedicamentoService(idMedicamento, idUsuario, transaction)

                    if (!buscarMedicamento.status) {
                        let error = new Error('Não foi possível encontrar o medicamento.')
                        error.resposta = buscarMedicamento
                        throw error
                    }

                    let medicamentoAtual = buscarMedicamento.response.medicamento[0]

                    let dadosMedicamento = {
                        nome: dados.medicamento.nome ?? medicamentoAtual.nome,
                        imagem: dados.medicamento.imagem ?? medicamentoAtual.imagem,
                        concentracao: dados.medicamento.concentracao ?? medicamentoAtual.concentracao,
                        id_unidade_medida_embalagem: dados.medicamento.id_unidade_medida_embalagem ?? medicamentoAtual.id_unidade_medida_embalagem,
                        id_tipo_dosagem: dados.medicamento.id_tipo_dosagem ?? medicamentoAtual.id_tipo_dosagem,
                        id_usuario: idUsuario
                    }

                    let atualizarMedicamento = await medicamentoService.atualizarMedicamentoService(dadosMedicamento, idMedicamento, transaction)

                    if (!atualizarMedicamento.status) {
                        let error = new Error('Não foi possível atualizar o medicamento.')
                        error.resposta = atualizarMedicamento
                        throw error
                    }
                }

                if (dados.receita_medica) {

                    let dadosReceita = {
                        id_usuario: receitaMedica.id_usuario,
                        id_medicamento: receitaMedica.id_medicamento,
                        dosagem: dados.receita_medica.dosagem ?? receitaMedica.dosagem,
                        id_unidade_medida: dados.receita_medica.id_unidade_medida ?? receitaMedica.id_unidade_medida,
                        id_estoque: receitaMedica.id_estoque,
                        descricao: dados.receita_medica.descricao ?? receitaMedica.descricao
                    }

                    let atualizarReceita = await receitaMedicaService.atualizarReceitaMedicaService(dadosReceita, idReceitaMedica, transaction)

                    if (!atualizarReceita.status) {
                        let error = new Error('Não foi possível atualizar a receita médica.')
                        error.resposta = atualizarReceita
                        throw error
                    }
                }

                if (dados.estoque) {

                    let dadosEstoque = {
                        quantidade_em_estoque: dados.estoque.quantidade_em_estoque,
                        id_usuarios: receitaMedica.id_usuario,
                        id_medicamentos: receitaMedica.id_medicamento
                    }

                    let atualizarEstoque = await estoqueService.atualizarEstoqueService(
                        dadosEstoque,
                        idEstoque,
                        transaction
                    )

                    if (!atualizarEstoque.status) {
                        let error = new Error('Não foi possível atualizar o estoque.')
                        error.resposta = atualizarEstoque
                        throw error
                    }
                }

                if (dados.programacao_medicamento) {

                    let buscarProgramacoes = await programacaoMedicamentoService.buscarProgramacaoPorIdReceitaService(idReceitaMedica, transaction)

                    if (!buscarProgramacoes.status) {
                        let error = new Error('Não foi possível encontrar as programações.')
                        error.resposta = buscarProgramacoes
                        throw error
                    }

                    let programacaoAtual = buscarProgramacoes.response.programacao_medicamento.find(function (programacao) {
                        return programacao.data_hora_fim == null
                    })

                    if (!programacaoAtual) {
                        customMessages.ERROR_BAD_REQUEST.field = ['PROGRAMACAO_ATIVA']

                        let error = new Error('Não foi possível encontrar a programação ativa.')
                        error.resposta = customMessages.ERROR_BAD_REQUEST
                        throw error
                    }

                    let alterarProgramacao = await controllerAlterarProgramacao.alterarProgramacaoMedicamento(
                        programacaoAtual.id_programacao_medicamento,
                        dados.programacao_medicamento,
                        contentType,
                        transaction
                    )

                    if (!alterarProgramacao.status) {
                        let error = new Error('Não foi possível alterar a programação.')
                        error.resposta = alterarProgramacao
                        throw error
                    }
                }

                return {
                    id_usuario: idUsuario,
                    id_receita_medica: idReceitaMedica,
                    id_medicamento: idMedicamento,
                    id_estoque: idEstoque
                }
            })

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = result

            return customMessages.DEFAULT_MESSAGE

        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        if (error.resposta)
            return error.resposta

        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    editarMedicamentoUsuario
}
