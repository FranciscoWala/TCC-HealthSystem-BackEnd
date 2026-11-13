/*******************************************************************************
    Objetivo: Controller responsável pela geração do código de redefinir senha
    Data: 12/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
********************************************************************************/

const crypto = require('crypto')
const bcrypt = require('bcrypt')
const knexConection = require('../../models/global_knex/global_knex.js')

const configMessages = require('../../utils/messages/configMessages.js')
const usuariosService = require('../../services/usuarios/service_usuario.js')
const codigoVerificacaoService = require('../../services/codigo_verificacao/service_codigo_verificacao.js')
const enviarEmail = require('../../utils/enviar_email/enviarEmail.js')

const gerarCodigoRedefinicaoSenha = async function (email) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!email || typeof email != 'string')
            return customMessages.ERROR_BAD_REQUEST

        email = email.trim().toLowerCase()

        let dadosEmail = {
            email: email
        }

        let buscarUsuario = await usuariosService.buscarUsuarioPorEmailService(dadosEmail)

        if (!buscarUsuario.status) {
            if (buscarUsuario.status_code != 404)
                return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

            customMessages.DEFAULT_MESSAGE.status = true
            customMessages.DEFAULT_MESSAGE.status_code = 200
            customMessages.DEFAULT_MESSAGE.message = 'Se o e-mail estiver cadastrado, enviaremos um código.'

            return customMessages.DEFAULT_MESSAGE
        }

        let usuario = buscarUsuario.response.usuario[0]

        let codigo = crypto.randomInt(0, 1000000).toString().padStart(6, '0')

        let codigoHash = crypto.createHmac('sha256', process.env.CODIGO_VINCULO_SECRET).update(`REDEFINICAO_SENHA:${email}:${codigo}`).digest('hex')

        let dataExpiracao = new Date(Date.now() + 10 * 60 * 1000)

        await knexConection.transaction(async function (transaction) {
            let codigosAnteriores = await codigoVerificacaoService.buscarCodigosPorEmailTipoService(email, 'REDEFINICAO_SENHA', transaction)

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

            let dadosCodigo = {
                codigo_hash: codigoHash,
                tipo: 'REDEFINICAO_SENHA',
                id_usuario: usuario.id,
                email: email,
                data_expiracao: dataExpiracao
            }

            let inserirCodigo = await codigoVerificacaoService.inserirCodigoVerificacaoService(dadosCodigo, transaction)

            if (!inserirCodigo.status)
                throw new Error('ERRO AO INSERIR CÓDIGO')
        })

        let mensagem = `Seu código para redefinir a senha do MedTime é: ${codigo}. Ele expira em 10 minutos.`

        let emailEnviado = await enviarEmail.enviarEmail(email, 'Redefinição de senha - MedTime', mensagem)

        if (!emailEnviado) {
            await knexConection.transaction(async function (transaction) {
                let buscarCodigo = await codigoVerificacaoService.buscarCodigoPorHashTipoBloqueadoService(codigoHash, 'REDEFINICAO_SENHA', transaction)

                if (!buscarCodigo.status)
                    throw new Error('ERRO AO BUSCAR CÓDIGO')

                let codigoAtual = buscarCodigo.response.codigos_verificacao[0]

                if (!codigoAtual || codigoAtual.email != email)
                    throw new Error('CÓDIGO NÃO ENCONTRADO')

                if (!codigoAtual.utilizado) {
                    let invalidarCodigo = {
                        codigo_hash: codigoAtual.codigo_hash,
                        tipo: codigoAtual.tipo,
                        id_usuario: codigoAtual.id_usuario,
                        email: codigoAtual.email,
                        data_expiracao: codigoAtual.data_expiracao,
                        utilizado: true,
                        tentativas: codigoAtual.tentativas
                    }

                    let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(invalidarCodigo, codigoAtual.id, transaction)

                    if (!atualizarCodigo.status)
                        throw new Error('ERRO AO INVALIDAR CÓDIGO')
                }
            })

            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
        }

        customMessages.DEFAULT_MESSAGE.status = true
        customMessages.DEFAULT_MESSAGE.status_code = 200
        customMessages.DEFAULT_MESSAGE.message = 'Se o e-mail estiver cadastrado, enviaremos um código.'

        return customMessages.DEFAULT_MESSAGE

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const redefinirSenha = async function (email, codigo, novaSenha) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (typeof email != 'string' || typeof codigo != 'string' || typeof novaSenha != 'string')
            return customMessages.ERROR_BAD_REQUEST

        email = email.trim().toLowerCase()

        if (!/^\d{6}$/.test(codigo) || novaSenha.length < 8 || Buffer.byteLength(novaSenha, 'utf8') > 72)
            return customMessages.ERROR_BAD_REQUEST

        if (!process.env.CODIGO_VINCULO_SECRET)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let codigoHash = crypto.createHmac('sha256', process.env.CODIGO_VINCULO_SECRET).update(`REDEFINICAO_SENHA:${email}:${codigo}`).digest('hex')

        let validarTentativa = await knexConection.transaction(async function (transaction) {
            let buscarCodigo = await codigoVerificacaoService.buscarCodigoPorEmailTipoBloqueadoService(email, 'REDEFINICAO_SENHA', transaction)

            if (!buscarCodigo.status)
                return buscarCodigo

            let codigoAtual = buscarCodigo.response.codigos_verificacao[0]

            if (!codigoAtual || codigoAtual.utilizado || new Date(codigoAtual.data_expiracao).getTime() <= Date.now() || codigoAtual.tentativas >= 5)
                return customMessages.ERROR_BAD_REQUEST

            let codigoCorreto = false

            if (/^[a-f0-9]{64}$/i.test(codigoAtual.codigo_hash)) {
                codigoCorreto = crypto.timingSafeEqual(
                    Buffer.from(codigoAtual.codigo_hash, 'hex'),
                    Buffer.from(codigoHash, 'hex')
                )
            }

            if (!codigoCorreto) {
                let dadosCodigo = {
                    codigo_hash: codigoAtual.codigo_hash,
                    tipo: codigoAtual.tipo,
                    id_usuario: codigoAtual.id_usuario,
                    email: codigoAtual.email,
                    data_expiracao: codigoAtual.data_expiracao,
                    utilizado: false,
                    tentativas: codigoAtual.tentativas + 1
                }

                let atualizar = await codigoVerificacaoService.atualizarCodigoVerificacaoService(dadosCodigo, codigoAtual.id, transaction)

                if (!atualizar.status)
                    throw new Error('ERRO AO REGISTRAR TENTATIVA')

                return customMessages.ERROR_BAD_REQUEST
            }

            return customMessages.SUCCESS_RESPONSE
        })

        if (!validarTentativa.status)
            return validarTentativa

        let senhaHash = await bcrypt.hash(novaSenha, 12)

        let result = await knexConection.transaction(async function (transaction) {
            let buscarCodigo = await codigoVerificacaoService.buscarCodigoPorEmailTipoBloqueadoService(email, 'REDEFINICAO_SENHA', transaction)

            if (!buscarCodigo.status)
                throw new Error('ERRO AO BUSCAR CÓDIGO')

            let codigoAtual = buscarCodigo.response.codigos_verificacao[0]

            if (!codigoAtual || codigoAtual.utilizado || new Date(codigoAtual.data_expiracao).getTime() <= Date.now() || 
                    codigoAtual.tentativas >= 5 || !/^[a-f0-9]{64}$/i.test(codigoAtual.codigo_hash))
                return customMessages.ERROR_BAD_REQUEST

            let codigoCorreto = crypto.timingSafeEqual(
                Buffer.from(codigoAtual.codigo_hash, 'hex'),
                Buffer.from(codigoHash, 'hex')
            )

            if (!codigoCorreto)
                return customMessages.ERROR_BAD_REQUEST

            let dadosEmail = {
                email: email
            }

            let buscarUsuario = await usuariosService.buscarUsuarioPorEmailService(dadosEmail, transaction)

            if (!buscarUsuario.status)
                return customMessages.ERROR_BAD_REQUEST

            let usuario = buscarUsuario.response.usuario[0]

            if (!usuario || usuario.id != codigoAtual.id_usuario)
                return customMessages.ERROR_BAD_REQUEST

            let atualizarSenha = await usuariosService.atualizarSenhaUsuarioService(usuario.id, senhaHash, transaction)

            if (!atualizarSenha.status)
                throw new Error('ERRO AO ATUALIZAR SENHA')

            let dadosCodigo = {
                codigo_hash: codigoAtual.codigo_hash,
                tipo: codigoAtual.tipo,
                id_usuario: codigoAtual.id_usuario,
                email: codigoAtual.email,
                data_expiracao: codigoAtual.data_expiracao,
                utilizado: true,
                tentativas: codigoAtual.tentativas
            }

            let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(dadosCodigo, codigoAtual.id, transaction)

            if (!atualizarCodigo.status)
                throw new Error('ERRO AO CONSUMIR CÓDIGO')

            customMessages.DEFAULT_MESSAGE.status = true
            customMessages.DEFAULT_MESSAGE.status_code = 200
            customMessages.DEFAULT_MESSAGE.message = 'Senha redefinida com sucesso.'

            return customMessages.DEFAULT_MESSAGE
        })

        return result

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    gerarCodigoRedefinicaoSenha,
    redefinirSenha
}