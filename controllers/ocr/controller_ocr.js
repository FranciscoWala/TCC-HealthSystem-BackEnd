/*************************************************************************************************************************
 * Objetivo: Controller responsável pela regra de negócio do OCR
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 16/11/2026
 * Versão: 1.0
**************************************************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')

const ocrService = require('../../services/ocr/service_ocr.js')
const iaService = require('../../services/ocr/service_ia.js')

const tipoDosagemService = require('../../services/tipo_dosagem/service_tipo_dosagem.js')
const unidadeMedidaService = require('../../services/unidade_medida/service_unidade_medida.js')
const tipoIntervaloService = require('../../services/tipo_intervalo/service_tipo_intervalo.js')

const validarIdCatalogo = function (id, registros) {
    if (!Array.isArray(registros) || id == null)
        return null

    for (let registro of registros) {
        if (Number(registro.id) == Number(id))
            return Number(registro.id)
    }

    return null
}

const processarReceitaMedica = async function (imagem) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!imagem || !imagem.buffer) {
            customMessages.ERROR_BAD_REQUEST.field = ['IMAGEM']
            return customMessages.ERROR_BAD_REQUEST
        }

        if (imagem.mimetype != 'image/jpeg' && imagem.mimetype != 'image/png') {
            customMessages.ERROR_BAD_REQUEST.field = ['TIPO_IMAGEM']
            return customMessages.ERROR_BAD_REQUEST
        }

        let textoReceita = await ocrService.extrairTextoReceitaService(
            imagem.buffer,
            imagem.mimetype
        )

        console.log('TEXTO EXTRAÍDO PELO OCR:')
        console.log(textoReceita)

        if (!textoReceita) {
            customMessages.ERROR_BAD_REQUEST.field = ['TEXTO_RECEITA']
            return customMessages.ERROR_BAD_REQUEST
        }

        // CONSULTAR OS CATÁLOGOS ANTES DA IA
        let resultadoTipoDosagem = await tipoDosagemService.listarTipoDosagemService()
        let resultadoUnidadeMedida = await unidadeMedidaService.listarUnidadeMedidaService()
        let resultadoTipoIntervalo = await tipoIntervaloService.listarTipoIntervaloService()

        if (!resultadoTipoDosagem.status ||
            !resultadoUnidadeMedida.status ||
            !resultadoTipoIntervalo.status)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let tiposDosagem = resultadoTipoDosagem.response.tipo_dosagem
        let unidadesMedida = resultadoUnidadeMedida.response.unidade_medida
        let tiposIntervalo = resultadoTipoIntervalo.response.tipoIntervalo

        if (!Array.isArray(tiposDosagem) ||
            !Array.isArray(unidadesMedida) ||
            !Array.isArray(tiposIntervalo))
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        // ENVIAR AS OPÇÕES REAIS PARA A IA
        let catalogos = {
            tipos_dosagem: tiposDosagem,
            unidades_medida: unidadesMedida,
            tipos_intervalo: tiposIntervalo
        }

        let dadosReceita = await iaService.interpretarReceitaService(textoReceita, catalogos)

        if (!dadosReceita || !Array.isArray(dadosReceita.medicamentos))
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let medicamentos = []

        for (let dados of dadosReceita.medicamentos) {
            let camposPendentes = []

            let idTipoDosagem = validarIdCatalogo(dados.id_tipo_dosagem, tiposDosagem)

            let idUnidadeEmbalagem = validarIdCatalogo(dados.id_unidade_medida_embalagem, unidadesMedida)

            let idUnidadeDosagem = validarIdCatalogo(dados.id_unidade_medida, unidadesMedida)

            let idTipoIntervalo = validarIdCatalogo(dados.id_tipo_intervalo, tiposIntervalo)

            let medicamento = {
                medicamento: {
                    nome: dados.medicamento ?? null,
                    imagem: null,
                    concentracao: dados.concentracao ?? null,
                    id_unidade_medida_embalagem: idUnidadeEmbalagem,
                    id_tipo_dosagem: idTipoDosagem
                },
                receita_medica: {
                    dosagem: dados.dosagem ?? null,
                    id_unidade_medida: idUnidadeDosagem,
                    descricao: dados.descricao ?? null
                },
                programacao_medicamento: {
                    frequencia: dados.frequencia ?? null,
                    data_hora_inicio: null,
                    id_tipo_intervalo: idTipoIntervalo
                },
                estoque: {
                    quantidade_em_estoque: null
                },
                quantidade_prescrita: dados.quantidade_prescrita ?? null,
                campos_pendentes: camposPendentes
            }

            if (!medicamento.medicamento.nome)
                camposPendentes.push('medicamento.nome')

            if (medicamento.medicamento.concentracao == null)
                camposPendentes.push('medicamento.concentracao')

            if (idUnidadeEmbalagem == null)
                camposPendentes.push('medicamento.id_unidade_medida_embalagem')

            if (idTipoDosagem == null)
                camposPendentes.push('medicamento.id_tipo_dosagem')

            if (medicamento.receita_medica.dosagem == null)
                camposPendentes.push('receita_medica.dosagem')

            if (idUnidadeDosagem == null)
                camposPendentes.push('receita_medica.id_unidade_medida')

            if (medicamento.programacao_medicamento.frequencia == null)
                camposPendentes.push('programacao_medicamento.frequencia')

            if (idTipoIntervalo == null)
                camposPendentes.push('programacao_medicamento.id_tipo_intervalo')

            camposPendentes.push('medicamento.imagem')
            camposPendentes.push('programacao_medicamento.data_hora_inicio')
            camposPendentes.push('estoque.quantidade_em_estoque')

            medicamentos.push(medicamento)
        }

        customMessages.DEFAULT_MESSAGE.status = true
        customMessages.DEFAULT_MESSAGE.status_code = 200
        customMessages.DEFAULT_MESSAGE.message = 'Receita médica processada com sucesso.'
        customMessages.DEFAULT_MESSAGE.response = {
            medicamentos: medicamentos
        }

        return customMessages.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    processarReceitaMedica
}