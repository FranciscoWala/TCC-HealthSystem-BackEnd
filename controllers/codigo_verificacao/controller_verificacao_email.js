/****************************************************************************
    Objetivo: Controller responsável pela geração do código de verificação
    Data: 12/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*****************************************************************************/

const crypto = require('crypto')
const knexConection = require('../../models/global_knex/global_knex.js')

const configMessages = require('../../utils/messages/configMessages.js')
const codigoVerificacaoService = require('../../services/codigo_verificacao/service_codigo_verificacao.js')
const usuariosService = require('../../services/usuarios/service_usuario.js')
const enviarEmail = require('../../utils/enviar_email/enviarEmail.js')

const gerarCodigoVerificacaoEmail = async function (email) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!email || typeof email != 'string')
            return customMessages.ERROR_BAD_REQUEST

        email = email.trim().toLowerCase()

        let dadosEmail = {
            email: email
        }

        let usuarioExistente = await usuariosService.buscarUsuarioPorEmailService(dadosEmail)

        if (usuarioExistente.status)
            return customMessages.ERROR_BAD_REQUEST

        if (usuarioExistente.status_code != 404)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let codigo = crypto.randomInt(0, 1000000).toString().padStart(6, '0')

        let codigoHash = crypto.createHmac('sha256', process.env.CODIGO_VINCULO_SECRET)
            .update(`VERIFICACAO_EMAIL:${email}:${codigo}`)
            .digest('hex')

        let dataExpiracao = new Date(Date.now() + 10 * 60 * 1000)

        let result = await knexConection.transaction(async function (transaction) {
            let codigosAnteriores = await codigoVerificacaoService.buscarCodigosPorEmailTipoService(email, 'VERIFICACAO_EMAIL', transaction)

            if (!codigosAnteriores.status)
                throw new Error('ERRO AO BUSCAR CÓDIGOS')

            for (let codigoAnterior of codigosAnteriores.response.codigos_verificacao) {
                if (!codigoAnterior.utilizado) {
                    let invalidarCodigo = {
                        codigo_hash: codigoAnterior.codigo_hash,
                        tipo: codigoAnterior.tipo,
                        id_usuario: codigoAnterior.id_usuario,
                        email: codigoAnterior.email,
                        data_expiracao: codigoAnterior.data_expiracao,
                        utilizado: true,
                        tentativas: codigoAnterior.tentativas
                    }

                    let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(invalidarCodigo, codigoAnterior.id, transaction)

                    if (!atualizarCodigo.status)
                        throw new Error('ERRO AO INVALIDAR CÓDIGO')
                }
            }

            let validarCodigo = {
                codigo_hash: codigoHash,
                tipo: 'VERIFICACAO_EMAIL',
                id_usuario: null,
                email: email,
                data_expiracao: dataExpiracao
            }

            let inserirCodigo = await codigoVerificacaoService.inserirCodigoVerificacaoService(validarCodigo, transaction)

            if (!inserirCodigo.status)
                throw new Error('ERRO AO INSERIR CÓDIGO')

            return true
        })

        if (result) {
            let mensagem = `Seu código de verificação do MedTime é: ${codigo}. Ele expira em 10 minutos.`

            let emailEnviado = await enviarEmail.enviarEmail(email, 'Código de verificação - MedTime', mensagem)

            if (!emailEnviado) {
                await knexConection.transaction(async function (transaction) {
                    let codigoSalvo = await codigoVerificacaoService.buscarCodigoPorHashTipoBloqueadoService(
                        codigoHash,
                        'VERIFICACAO_EMAIL',
                        transaction
                    )

                    if (!codigoSalvo.status)
                        throw new Error('ERRO AO BUSCAR CÓDIGO')

                    let codigoAtual = codigoSalvo.response.codigos_verificacao[0]

                    let invalidarCodigo = {
                        codigo_hash: codigoAtual.codigo_hash,
                        tipo: codigoAtual.tipo,
                        id_usuario: codigoAtual.id_usuario,
                        email: codigoAtual.email,
                        data_expiracao: codigoAtual.data_expiracao,
                        utilizado: true,
                        tentativas: codigoAtual.tentativas
                    }

                    let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(
                        invalidarCodigo,
                        codigoAtual.id,
                        transaction
                    )

                    if (!atualizarCodigo.status)
                        throw new Error('ERRO AO INVALIDAR CÓDIGO')
                })

                return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
            }

            customMessages.DEFAULT_MESSAGE.status = true
            customMessages.DEFAULT_MESSAGE.status_code = 200
            customMessages.DEFAULT_MESSAGE.message = 'Código enviado para o e-mail informado.'

            return customMessages.DEFAULT_MESSAGE
        }

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarCodigoVerificacaoEmail = async function (email, codigo, transaction = null, consumirCodigo = false) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!email || typeof email != 'string' || typeof codigo != 'string')
            return customMessages.ERROR_BAD_REQUEST

        email = email.trim().toLowerCase()

        if (!/^\d{6}$/.test(codigo))
            return customMessages.ERROR_BAD_REQUEST

        if (!process.env.CODIGO_VINCULO_SECRET)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let codigoHash = crypto.createHmac('sha256', process.env.CODIGO_VINCULO_SECRET).update(`VERIFICACAO_EMAIL:${email}:${codigo}`).digest('hex')

        let validarCodigo = async function (connection) {
            let buscarCodigo = await codigoVerificacaoService.buscarCodigoPorEmailTipoBloqueadoService(email, 'VERIFICACAO_EMAIL', connection)

            if (!buscarCodigo.status)
                return buscarCodigo

            let codigoAtual = buscarCodigo.response.codigos_verificacao[0]

            if (!codigoAtual)
                return customMessages.ERROR_BAD_REQUEST

            if (codigoAtual.utilizado || new Date(codigoAtual.data_expiracao).getTime() <= Date.now())
                return customMessages.ERROR_BAD_REQUEST

            if (codigoAtual.tentativas >= 5)
                return customMessages.ERROR_BAD_REQUEST

            let codigoCorreto = false

            if (codigoAtual.codigo_hash.length == codigoHash.length) {
                codigoCorreto = crypto.timingSafeEqual(
                    Buffer.from(codigoAtual.codigo_hash, 'hex'),
                    Buffer.from(codigoHash, 'hex')
                )
            }

            let dadosCodigo = {
                codigo_hash: codigoAtual.codigo_hash,
                tipo: codigoAtual.tipo,
                id_usuario: codigoAtual.id_usuario,
                email: codigoAtual.email,
                data_expiracao: codigoAtual.data_expiracao,
                utilizado: codigoCorreto && consumirCodigo,
                tentativas: codigoAtual.tentativas + 1
            }

            if (!codigoCorreto || consumirCodigo) {
                let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(dadosCodigo, codigoAtual.id, connection)

                if (!atualizarCodigo.status)
                    throw new Error('ERRO AO ATUALIZAR CÓDIGO')
            }

            if (!codigoCorreto)
                return customMessages.ERROR_BAD_REQUEST

            customMessages.DEFAULT_MESSAGE.status = true
            customMessages.DEFAULT_MESSAGE.status_code = 200
            customMessages.DEFAULT_MESSAGE.message = 'Código válido.'

            return customMessages.DEFAULT_MESSAGE
        }

        if (transaction)
            return await validarCodigo(transaction)

        return await knexConection.transaction(async function (connection) {
            return await validarCodigo(connection)
        })

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    gerarCodigoVerificacaoEmail,
    validarCodigoVerificacaoEmail
}