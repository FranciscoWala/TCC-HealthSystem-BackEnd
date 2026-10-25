
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
const horarioService = require('../../services/horarios/service_horarios.js')
const estoqueService = require('../../services/estoque/service_estoque.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const cadastroMedicamentoUsuarioSchema = require('../../schemas/cadastroMedicamentoUsuarioSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX
const knexConection = require('../../models/global_knex/global_knex.js')

const validarDadosCadastroMedicamentoUsuario = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(cadastroMedicamentoUsuarioSchema, dados, customMessages)
}

// Função para gerar os horários do medicamento
const gerarHorariosMedicamento = function (frequencia, horarioInicio) {
    let horarios = []

    let frequenciaSeparada = frequencia.split(':')
    let horarioSeparado = horarioInicio.split(':')

    let intervaloSegundos = Number(frequenciaSeparada[0]) * 3600 +
                            Number(frequenciaSeparada[1]) * 60 +
                            Number(frequenciaSeparada[2])

    let horarioInicialSegundos = Number(horarioSeparado[0]) * 3600 +
                                Number(horarioSeparado[1]) * 60 +
                                Number(horarioSeparado[2])

    if (intervaloSegundos <= 0 || 86400 % intervaloSegundos != 0)
        return false

    let quantidadeHorarios = 86400 / intervaloSegundos

    for (let contador = 0; contador < quantidadeHorarios; contador++) {
        let horarioSegundos = (horarioInicialSegundos + contador * intervaloSegundos) % 86400

        let horas = Math.floor(horarioSegundos / 3600)
        let minutos = Math.floor((horarioSegundos % 3600) / 60)
        let segundos = horarioSegundos % 60

        let horario = String(horas).padStart(2, '0') + ':' +
                      String(minutos).padStart(2, '0') + ':' +
                      String(segundos).padStart(2, '0')

        horarios.push(horario)
    }

    return horarios
}

// Cadastrar um tratamento para o usuário
const cadastrarMedicamentoUsuario = async function (dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Valida os dados recebidos
            let validacao = validarDadosCadastroMedicamentoUsuario(dados)

            if (validacao)
                return validacao

            // Prepara os horários do medicamento
            let horarios = gerarHorariosMedicamento(
                dados.receita_medica.frequencia,
                dados.receita_medica.data_hora_inicio
            )

            if (!horarios)
                return customMessages.ERROR_BAD_REQUEST

            // Inicia a transação
            let result = await knexConection.transaction(async function (transaction) {

                let idMedicamento

                // Verifica se o medicamento já existe no catálogo
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

                    idMedicamento = dados.id_medicamento

                } else {

                    // Prepara os dados do medicamento particular
                    let medicamento = {
                        nome: dados.medicamento.nome,
                        imagem: dados.medicamento.imagem,
                        concentracao: dados.medicamento.concentracao,
                        id_unidade_medida_embalagem: dados.medicamento.id_unidade_medida_embalagem,
                        id_tipo_dosagem: dados.medicamento.id_tipo_dosagem,
                        id_usuario: dados.receita_medica.id_usuario
                    }

                    // Cadastra o medicamento particular
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

                // Prepara os dados da receita médica
                let receitaMedica = {
                    id_usuario: dados.receita_medica.id_usuario,
                    id_medicamento: idMedicamento,
                    frequencia: dados.receita_medica.frequencia,
                    dosagem: dados.receita_medica.dosagem,
                    data_hora_inicio: dados.receita_medica.data_hora_inicio,
                    data_inicio: dados.receita_medica.data_inicio,
                    id_unidade_medida: dados.receita_medica.id_unidade_medida,
                    id_tipo_intervalo: dados.receita_medica.id_tipo_intervalo,
                    descricao: dados.receita_medica.descricao
                }

                // Cadastra a receita médica
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

                // Cadastra os horários do medicamento
                for (let horario of horarios) {

                    let dadosHorario = {
                        horario: horario,
                        id_receita_medica: idReceitaMedica
                    }

                    let cadastrarHorario = await horarioService.inserirHorarioService(
                        dadosHorario,
                        transaction
                    )

                    if (!cadastrarHorario.status) {
                        let error = new Error('Não foi possível cadastrar os horários.')
                        error.resposta = cadastrarHorario
                        throw error
                    }
                }

                // Prepara os dados do estoque
                let estoque = {
                    quantidade_em_estoque: dados.estoque.quantidade_em_estoque,
                    id_usuarios: dados.receita_medica.id_usuario,
                    id_medicamentos: idMedicamento
                }

                // Cadastra o estoque inicial
                let cadastrarEstoque = await estoqueService.inserirEstoqueService(
                    estoque,
                    transaction
                )

                if (!cadastrarEstoque.status) {
                    let error = new Error('Não foi possível cadastrar o estoque.')
                    error.resposta = cadastrarEstoque
                    throw error
                }

                // Prepara a resposta do cadastro
                let resposta = {
                    id_usuario: dados.receita_medica.id_usuario,
                    id_medicamento: idMedicamento,
                    id_receita_medica: idReceitaMedica,
                    horarios: horarios,
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

        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    cadastrarMedicamentoUsuario
}