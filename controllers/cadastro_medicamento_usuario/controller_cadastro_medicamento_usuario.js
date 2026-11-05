
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio do CADASTRO DE MEDICAMENTOS DO USUÁRIO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DAS SERVICES
const medicamentoService = require('../../services/medicamento/service_medicamento.js')
const receitaMedicaService = require('../../services/receita_medica/service_receita_medica.js')
const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')
const estoqueService = require('../../services/estoque/service_estoque.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const cadastroMedicamentoUsuarioSchema = require('../../schemas/cadastroMedicamentoUsuarioSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

// IMPORT DA FUNÇÃO DE NORMALIZAÇÃO DE DATAS
const normalizarDataUTC = require('../../utils/datas/normalizarDataUTC.js')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX
const knexConection = require('../../models/global_knex/global_knex.js')

const validarDadosCadastroMedicamentoUsuario = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(cadastroMedicamentoUsuarioSchema, dados, customMessages)
}

const cadastrarMedicamentoUsuario = async function (dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = validarDadosCadastroMedicamentoUsuario(dados)

            if (validacao)
                return validacao

            let dataInicioFormatada = normalizarDataUTC(dados.programacao_medicamento.data_hora_inicio)

            if (!dataInicioFormatada) {
                customMessages.ERROR_BAD_REQUEST.field = ['DATA_HORA_INICIO']
                return customMessages.ERROR_BAD_REQUEST
            }

            let result = await knexConection.transaction(async function (transaction) {


                let idMedicamento

                if (dados.id_medicamento) {

                    let buscarMedicamento = await medicamentoService.buscarMedicamentoService(
                        dados.id_medicamento,
                        dados.receita_medica.id_usuario,
                        transaction
                    )

                    if (!buscarMedicamento.status) {
                        let error = new Error('Não foi possível encontrar o medicamento.')
                        error.resposta = buscarMedicamento
                        throw error
                    }

                    let medicamentoEncontrado = buscarMedicamento.response.medicamento[0]

                    if (medicamentoEncontrado.id_usuario != null) {
                        customMessages.ERROR_BAD_REQUEST.field = ['MEDICAMENTO_PARTICULAR']

                        let error = new Error('Medicamentos particulares não podem ser reutilizados.')
                        error.resposta = customMessages.ERROR_BAD_REQUEST
                        throw error
                    }

                    idMedicamento = dados.id_medicamento
                } else {
                    let medicamento = {
                        nome: dados.medicamento.nome,
                        imagem: dados.medicamento.imagem,
                        concentracao: dados.medicamento.concentracao,
                        id_unidade_medida_embalagem: dados.medicamento.id_unidade_medida_embalagem,
                        id_tipo_dosagem: dados.medicamento.id_tipo_dosagem,
                        id_usuario: dados.receita_medica.id_usuario
                    }

                    let cadastrarMedicamento = await medicamentoService.inserirMedicamentoService(
                        medicamento,
                        transaction
                    )

                    if (!cadastrarMedicamento.status) {
                        let error = new Error('Não foi possível cadastrar o medicamento.')
                        error.resposta = cadastrarMedicamento
                        throw error
                    }

                    idMedicamento = cadastrarMedicamento.response.id
                }

                let estoque = {
                    quantidade_em_estoque: dados.estoque.quantidade_em_estoque,
                    id_usuarios: dados.receita_medica.id_usuario,
                    id_medicamentos: idMedicamento
                }

                let cadastrarEstoque = await estoqueService.inserirEstoqueService(
                    estoque,
                    transaction
                )

                if (!cadastrarEstoque.status) {
                    let error = new Error('Não foi possível cadastrar o estoque.')
                    error.resposta = cadastrarEstoque
                    throw error
                }

                let idEstoque = cadastrarEstoque.response.id

                let receitaMedica = {
                    id_usuario: dados.receita_medica.id_usuario,
                    id_medicamento: idMedicamento,
                    dosagem: dados.receita_medica.dosagem,
                    id_unidade_medida: dados.receita_medica.id_unidade_medida,
                    id_estoque: idEstoque,
                    descricao: dados.receita_medica.descricao ?? null
                }

                let cadastrarReceita = await receitaMedicaService.inserirReceitaMedicaService(
                    receitaMedica,
                    transaction
                )

                if (!cadastrarReceita.status) {
                    let error = new Error('Não foi possível cadastrar a receita médica.')
                    error.resposta = cadastrarReceita
                    throw error
                }

                let idReceitaMedica = cadastrarReceita.response.id

                let programacaoMedicamento = {
                    frequencia: dados.programacao_medicamento.frequencia,
                    data_hora_inicio: dataInicioFormatada,
                    data_hora_fim: null,
                    id_tipo_intervalo: dados.programacao_medicamento.id_tipo_intervalo,
                    id_receita_medica: idReceitaMedica
                }

                let cadastrarProgramacao = await programacaoMedicamentoService.inserirProgramacaoMedicamentoService(
                    programacaoMedicamento,
                    transaction
                )

                if (!cadastrarProgramacao.status) {
                    let error = new Error('Não foi possível cadastrar a programação do medicamento.')
                    error.resposta = cadastrarProgramacao
                    throw error
                }

                let resposta = {
                    id_usuario: dados.receita_medica.id_usuario,
                    id_medicamento: idMedicamento,
                    id_estoque: idEstoque,
                    id_receita_medica: idReceitaMedica,
                    id_programacao_medicamento: cadastrarProgramacao.response.id,
                    quantidade_em_estoque: dados.estoque.quantidade_em_estoque
                }

                return resposta
            })

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
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
    cadastrarMedicamentoUsuario
}