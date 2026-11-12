/*************************************************************************
    Objetivo: Controller responsável pela geração do código de vínculo
    Data: 12/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
**************************************************************************/

const crypto = require('crypto')

const configMessages = require('../../utils/messages/configMessages.js')

const codigoVerificacaoService = require('../../services/codigo_verificacao/service_codigo_verificacao.js')
const usuarioService = require('../../services/usuarios/service_usuario.js')
const roleService = require('../../services/role/service_role.js')

const knexConection = require('../../models/global_knex/global_knex.js')

const gerarCodigoVinculo = async function (idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!process.env.CODIGO_VINCULO_SECRET)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let result = await knexConection.transaction(async function (transaction) {

            let buscarRoles = await usuarioService.buscarRolesAtivasUsuarioService(idUsuario, transaction)

            if (!buscarRoles.status || buscarRoles.response.roles.length != 1) {
                let error = new Error('ROLE DO USUÁRIO INVÁLIDA')
                error.resposta = customMessages.ERROR_FORBIDDEN
                throw error
            }

            let idRole = buscarRoles.response.roles[0].id_role

            let buscarRole = await roleService.buscarRoleService(idRole, transaction)

            if (!buscarRole.status) {
                let error = new Error('NÃO FOI POSSÍVEL BUSCAR A ROLE')
                error.resposta = buscarRole
                throw error
            }

            let role = buscarRole.response.role[0].role

            if (String(role).trim().toUpperCase() != 'CUIDADOR') {
                let error = new Error('USUÁRIO NÃO É CUIDADOR')
                error.resposta = customMessages.ERROR_FORBIDDEN
                throw error
            }

            let buscarCodigos = await codigoVerificacaoService.buscarCodigosUsuarioTipoService(idUsuario, 'VINCULO', transaction)

            if (!buscarCodigos.status && buscarCodigos.status_code != 404) {
                let error = new Error('NÃO FOI POSSÍVEL BUSCAR OS CÓDIGOS')
                error.resposta = buscarCodigos
                throw error
            }

            if (buscarCodigos.status) {
                for (const codigoAnterior of buscarCodigos.response.codigos_verificacao) {
                    if (!codigoAnterior.utilizado) {
                        let dadosAtualizacao = {
                            codigo_hash: codigoAnterior.codigo_hash,
                            tipo: codigoAnterior.tipo,
                            id_usuario: codigoAnterior.id_usuario,
                            data_expiracao: codigoAnterior.data_expiracao,
                            utilizado: true,
                            tentativas: codigoAnterior.tentativas
                        }

                        let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(
                            dadosAtualizacao, codigoAnterior.id, transaction
                        )

                        if (!atualizarCodigo.status) {
                            let error = new Error('NÃO FOI POSSÍVEL INVALIDAR O CÓDIGO ANTERIOR')
                            error.resposta = atualizarCodigo
                            throw error
                        }
                    }
                }
            }

            let codigo
            let codigoHash
            let codigoCadastrado = false

            let dataExpiracao = new Date(Date.now() + 10 * 60 * 1000)

            for (let tentativa = 0; tentativa < 10; tentativa++) {
                codigo = crypto.randomInt(0, 1000000).toString().padStart(6, '0')

                codigoHash = crypto
                    .createHmac('sha256', process.env.CODIGO_VINCULO_SECRET)
                    .update(codigo)
                    .digest('hex')

                let dadosCodigo = {
                    codigo_hash: codigoHash,
                    tipo: 'VINCULO',
                    id_usuario: Number(idUsuario),
                    data_expiracao: dataExpiracao
                }

                let inserirCodigo = await codigoVerificacaoService.inserirCodigoVerificacaoService(
                    dadosCodigo, transaction
                )

                if (inserirCodigo.status) {
                    codigoCadastrado = true
                    break
                }

                if (inserirCodigo.message != 'CÓDIGO DUPLICADO') {
                    let error = new Error('NÃO FOI POSSÍVEL CADASTRAR O CÓDIGO')
                    error.resposta = inserirCodigo
                    throw error
                }
            }

            if (!codigoCadastrado) {
                let error = new Error('NÃO FOI POSSÍVEL GERAR UM CÓDIGO DISPONÍVEL')
                error.resposta = customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
                throw error
            }

            return {
                codigo: codigo,
                data_expiracao: dataExpiracao
            }
        })

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Código de vínculo gerado com sucesso!'
        customMessages.DEFAULT_MESSAGE.response = result

        return customMessages.DEFAULT_MESSAGE

    } catch (error) {
        if (error.resposta)
            return error.resposta

        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    gerarCodigoVinculo
}