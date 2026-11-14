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
const vinculoPacienteService = require('../../services/vinculo_paciente/service_vinculo_paciente.js')

const knexConection = require('../../models/global_knex/global_knex.js')

const gerarCodigoVinculo = async function (idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!process.env.CODIGO_VINCULO_SECRET)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        let result = await knexConection.transaction(async function (transaction) {
            let usuarioBloqueado = await transaction('tbl_usuarios')
                .where('id', idUsuario)
                .forUpdate()
                .first()

            if (!usuarioBloqueado) {
                let error = new Error('USUÁRIO NÃO ENCONTRADO')
                error.resposta = customMessages.ERROR_NOT_FOUND
                throw error
            }

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
                    if (!codigoAnterior.utilizado && new Date(codigoAnterior.data_expiracao) > new Date()) {
                        let dadosAtualizacao = {
                            codigo_hash: codigoAnterior.codigo_hash,
                            tipo: codigoAnterior.tipo,
                            id_usuario: codigoAnterior.id_usuario,
                            data_expiracao: codigoAnterior.data_expiracao,
                            utilizado: true,
                            tentativas: codigoAnterior.tentativas
                        }

                        let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(dadosAtualizacao, codigoAnterior.id, transaction)

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

                codigoHash = crypto.createHmac('sha256', process.env.CODIGO_VINCULO_SECRET).update(codigo).digest('hex')

                let dadosCodigo = {
                    codigo_hash: codigoHash,
                    tipo: 'VINCULO',
                    id_usuario: Number(idUsuario),
                    data_expiracao: dataExpiracao
                }

                let inserirCodigo = await codigoVerificacaoService.inserirCodigoVerificacaoService(dadosCodigo, transaction)

                if (inserirCodigo.status) {
                    codigoCadastrado = true
                    break
                }

                if (inserirCodigo.error_code != 'CODIGO_DUPLICADO') {
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

const validarCodigoVinculo = async function (idPaciente, codigo) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (!process.env.CODIGO_VINCULO_SECRET)
            return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER

        if (!Number.isSafeInteger(Number(idPaciente)) || Number(idPaciente) < 1)
            return customMessages.ERROR_BAD_REQUEST

        if (typeof codigo != 'string' || !/^[0-9]{6}$/.test(codigo))
            return customMessages.ERROR_BAD_REQUEST

        let codigoHash = crypto.createHmac('sha256', process.env.CODIGO_VINCULO_SECRET).update(codigo).digest('hex')

        let result = await knexConection.transaction(async function (transaction) {

            let pacienteBloqueado = await transaction('tbl_usuarios')
                .where('id', idPaciente)
                .forUpdate()
                .first()

            if (!pacienteBloqueado) {
                let error = new Error('PACIENTE NÃO ENCONTRADO')
                error.resposta = customMessages.ERROR_NOT_FOUND
                throw error
            }

            let buscarRoles = await usuarioService.buscarRolesAtivasUsuarioService(idPaciente, transaction)

            if (!buscarRoles.status || buscarRoles.response.roles.length != 1) {
                let error = new Error('ROLE DO PACIENTE INVÁLIDA')
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

            if (String(role).trim().toUpperCase() != 'PACIENTE') {
                let error = new Error('USUÁRIO NÃO É PACIENTE')
                error.resposta = customMessages.ERROR_FORBIDDEN
                throw error
            }

            let buscarVinculo = await vinculoPacienteService.buscarVinculoPorIdPacienteService(idPaciente, transaction)

            if (buscarVinculo.status) {
                let error = new Error('PACIENTE JÁ POSSUI CUIDADOR')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                error.resposta.message = 'Paciente já possui um cuidador vinculado.'
                throw error
            }

            if (buscarVinculo.status_code != 404) {
                let error = new Error('NÃO FOI POSSÍVEL VERIFICAR O VÍNCULO')
                error.resposta = buscarVinculo
                throw error
            }

            let buscarCodigo = await codigoVerificacaoService.buscarCodigoPorHashTipoService(codigoHash, 'VINCULO', transaction)

            if (!buscarCodigo.status) {
                if (buscarCodigo.status_code == 404) {
                    let error = new Error('CÓDIGO INVÁLIDO')
                    error.resposta = customMessages.ERROR_BAD_REQUEST
                    error.resposta.message = 'Código de vínculo inválido.'
                    throw error
                }

                let error = new Error('NÃO FOI POSSÍVEL BUSCAR O CÓDIGO')
                error.resposta = buscarCodigo
                throw error
            }

            let dadosCodigo = buscarCodigo.response.codigos_verificacao[0]

            let idCuidador = Number(dadosCodigo.id_usuario)

            let cuidadorBloqueado = await transaction('tbl_usuarios')
                .where('id', idCuidador)
                .forUpdate()
                .first()

            if (!cuidadorBloqueado) {
                let error = new Error('CUIDADOR NÃO ENCONTRADO')
                error.resposta = customMessages.ERROR_NOT_FOUND
                throw error
            }

            // Consulta novamente após o bloqueio para evitar
            // utilizar um código invalidado por outra requisição.
            buscarCodigo = await codigoVerificacaoService.buscarCodigoPorHashTipoBloqueadoService(codigoHash, 'VINCULO', transaction)

            if (!buscarCodigo.status) {
                let error = new Error('NÃO FOI POSSÍVEL REVALIDAR O CÓDIGO')
                error.resposta = buscarCodigo
                throw error
            }

            dadosCodigo = buscarCodigo.response.codigos_verificacao[0]

            if (dadosCodigo.utilizado || new Date(dadosCodigo.data_expiracao) <= new Date()) {
                let error = new Error('CÓDIGO EXPIRADO OU UTILIZADO')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                error.resposta.message = 'Código expirado ou já utilizado.'
                throw error
            }

            if (Number(dadosCodigo.tentativas) >= 5) {
                let error = new Error('LIMITE DE TENTATIVAS')
                error.resposta = customMessages.ERROR_FORBIDDEN
                error.resposta.message = 'Limite de tentativas atingido.'
                throw error
            }

            let buscarRolesCuidador = await usuarioService.buscarRolesAtivasUsuarioService(idCuidador, transaction)

            if (!buscarRolesCuidador.status || buscarRolesCuidador.response.roles.length != 1) {
                let error = new Error('ROLE DO CUIDADOR INVÁLIDA')
                error.resposta = customMessages.ERROR_FORBIDDEN
                throw error
            }

            let idRoleCuidador = buscarRolesCuidador.response.roles[0].id_role

            let buscarRoleCuidador = await roleService.buscarRoleService(idRoleCuidador, transaction)

            if (!buscarRoleCuidador.status) {
                let error = new Error('NÃO FOI POSSÍVEL BUSCAR A ROLE DO CUIDADOR')
                error.resposta = buscarRoleCuidador
                throw error
            }

            let roleCuidador = buscarRoleCuidador.response.role[0].role

            if (String(roleCuidador).trim().toUpperCase() != 'CUIDADOR') {
                let error = new Error('USUÁRIO NÃO É CUIDADOR')
                error.resposta = customMessages.ERROR_FORBIDDEN
                throw error
            }

            let dadosVinculo = {
                id_paciente: Number(idPaciente),
                id_cuidador: idCuidador
            }

            let inserirVinculo = await vinculoPacienteService.inserirVinculoPacienteService(dadosVinculo, transaction)

            if (!inserirVinculo.status) {
                let error = new Error('NÃO FOI POSSÍVEL CADASTRAR O VÍNCULO')
                error.resposta = inserirVinculo
                throw error
            }

            let dadosAtualizacao = {
                codigo_hash: dadosCodigo.codigo_hash,
                tipo: dadosCodigo.tipo,
                id_usuario: dadosCodigo.id_usuario,
                data_expiracao: dadosCodigo.data_expiracao,
                utilizado: true,
                tentativas: dadosCodigo.tentativas
            }

            let atualizarCodigo = await codigoVerificacaoService.atualizarCodigoVerificacaoService(dadosAtualizacao, dadosCodigo.id, transaction)

            if (!atualizarCodigo.status) {
                let error = new Error('NÃO FOI POSSÍVEL INVALIDAR O CÓDIGO')
                error.resposta = atualizarCodigo
                throw error
            }

            return {
                id_paciente: Number(idPaciente),
                id_cuidador: idCuidador
            }
        })

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
        customMessages.DEFAULT_MESSAGE.message = 'Vínculo realizado com sucesso!'
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
    gerarCodigoVinculo,
    validarCodigoVinculo
}