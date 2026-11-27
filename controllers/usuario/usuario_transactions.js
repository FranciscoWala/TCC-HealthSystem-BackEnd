/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio do CADASTRO, EDIÇÃO E DESATIVAÇÃO DE USUÁRIO
 * Autor: Samuel Silva Moreira Dos Santos
 * Data: 28/12/2026
 * Versão: 1.1
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DOS ARQUIVOS DE VALIDAÇÃO
const validarDados = require('../../utils/validar_dados/validarDados.js')

// IMPORT DAS SERVICES
const usuarioService = require('../../services/usuarios/service_usuario.js')
const doencasCronicasService = require('../../services/doencas_cronicas/service_doencas_cronicas.js')
const doencaCronicaUsuarioService = require('../../services/doenca_cronica_usuario/service_doenca_cronica_usuario.js')
const contatoEmergenciaService = require('../../services/contatos_de_emergencia/service_contatos_emergencia.js')
const usuarioContatoEmergenciaService = require('../../services/contato_emergencia_usuarios/service_contato_emergencia_usuarios.js')
const roleService = require('../../services/role/service_role.js')
const usuarioRoleService = require('../../services/usuario_role/service_usuario_role.js')
const vinculoPacienteService = require('../../services/vinculo_paciente/service_vinculo_paciente.js')
const verificacaoEmailController = require('../codigo_verificacao/controller_verificacao_email.js')

const bcrypt = require('bcrypt')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX
const knexConection = require('../../models/global_knex/global_knex.js')

async function cadastrarUsuarioTransaction(dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (!dados || typeof dados.email != 'string' ||
                typeof dados.codigo != 'string' || !/^\d{6}$/.test(dados.codigo))
                return customMessages.ERROR_BAD_REQUEST

            dados.email = dados.email.trim().toLowerCase()

            let validarTentativa = await verificacaoEmailController.validarCodigoVerificacaoEmail(dados.email, dados.codigo)

            if (!validarTentativa.status)
                return validarTentativa

            let result = await knexConection.transaction(async function (transaction) {
                let validarCodigo = await verificacaoEmailController.validarCodigoVerificacaoEmail(dados.email, dados.codigo, transaction, true)

                if (!validarCodigo.status) {
                    let error = new Error('NÃO FOI POSSÍVEL VALIDAR O CÓDIGO')
                    error.resposta = validarCodigo
                    throw error
                }

                let idUsuario = await realizarCadastroUsuario(dados, transaction)

                let verificarEmail = await usuarioService.verificarEmailUsuarioService(idUsuario, transaction)

                if (!verificarEmail.status) {
                    let error = new Error('NÃO FOI POSSÍVEL VERIFICAR O E-MAIL')
                    error.resposta = verificarEmail
                    throw error
                }

                await cadastrarDoencasCronicasRefat(dados, transaction, idUsuario)
                await inserirContatosEmergencia(dados, transaction, idUsuario)
                await atribuirRoleAoUsuario(transaction, idUsuario, dados['usuario_role'])

                return {
                    id_usuario: idUsuario
                }
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

async function atualizarUsuarioTransaction(dados, contentType, idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (!dados || typeof dados != 'object' || Array.isArray(dados)) {
                customMessages.ERROR_BAD_REQUEST.field = ['DADOS']
                return customMessages.ERROR_BAD_REQUEST
            }

            if (!dados.usuario && !dados.usuario_role && !dados.contatos_emergencia && !dados.doencas_cronicas) {
                customMessages.ERROR_BAD_REQUEST.field = ['DADOS']
                return customMessages.ERROR_BAD_REQUEST
            }

            let result = await knexConection.transaction(async function (transaction) {

                let buscarUsuario = await usuarioService.buscarUsuarioService(idUsuario, transaction)

                if (!buscarUsuario.status) {
                    let error = new Error('Não foi possível encontrar o usuário.')
                    error.resposta = buscarUsuario
                    throw error
                }

                let usuarioAtual = buscarUsuario.response.usuario[0]

                if (dados.usuario) {
                    if (typeof dados.usuario != 'object' || Array.isArray(dados.usuario)) {
                        customMessages.ERROR_BAD_REQUEST.field = ['USUARIO']

                        let error = new Error('Dados do usuário inválidos.')
                        error.resposta = customMessages.ERROR_BAD_REQUEST
                        throw error
                    }

                    let senhaAtualizada = usuarioAtual.senha

                    if (dados.usuario.senha !== undefined && dados.usuario.senha !== null) {
                        if (typeof dados.usuario.senha != 'string' || !dados.usuario.senha.trim()) {
                            customMessages.ERROR_BAD_REQUEST.field = ['SENHA']

                            let error = new Error('Senha inválida.')
                            error.resposta = customMessages.ERROR_BAD_REQUEST
                            throw error
                        }

                        senhaAtualizada = await bcrypt.hash(dados.usuario.senha, 12)
                    }

                    let emailAtualizado = usuarioAtual.email

                    if (dados.usuario.email !== undefined && dados.usuario.email !== null) {
                        if (typeof dados.usuario.email != 'string' || !dados.usuario.email.trim()) {
                            customMessages.ERROR_BAD_REQUEST.field = ['EMAIL']

                            let error = new Error('E-mail inválido.')
                            error.resposta = customMessages.ERROR_BAD_REQUEST
                            throw error
                        }

                        emailAtualizado = dados.usuario.email.trim().toLowerCase()
                    }

                    let dataNascimentoAtual = usuarioAtual.data_nascimento instanceof Date
                        ? usuarioAtual.data_nascimento.toISOString().split('T')[0]
                        : usuarioAtual.data_nascimento

                    let dadosUsuario = {
                        nome: dados.usuario.nome ?? usuarioAtual.nome,
                        foto: dados.usuario.foto !== undefined ? dados.usuario.foto : usuarioAtual.foto,
                        email: emailAtualizado,
                        cpf: dados.usuario.cpf !== undefined ? dados.usuario.cpf : usuarioAtual.cpf,
                        telefone: dados.usuario.telefone !== undefined ? dados.usuario.telefone : usuarioAtual.telefone,
                        data_nascimento: dados.usuario.data_nascimento ?? dataNascimentoAtual
                    }

                    if (dados.usuario.senha !== undefined && dados.usuario.senha !== null) {
                        if (typeof dados.usuario.senha !== 'string' || !dados.usuario.senha.trim()) {
                            customMessages.ERROR_BAD_REQUEST.field = ['SENHA']

                            let error = new Error('Senha inválida.')
                            error.resposta = customMessages.ERROR_BAD_REQUEST
                            throw error
                        }

                        dadosUsuario.senha = await bcrypt.hash(dados.usuario.senha, 12)
                    }

                    let atualizarUsuario = await usuarioService.atualizarUsuarioService(
                        dadosUsuario, idUsuario, transaction
                    )

                    if (!atualizarUsuario.status) {
                        let error = new Error('Não foi possível atualizar os dados do usuário.')
                        error.resposta = atualizarUsuario
                        throw error
                    }
                }

                if (dados.usuario_role)
                    await gerenciarAtualizacaoRoles(transaction, idUsuario, dados.usuario_role)

                if (dados.contatos_emergencia)
                    await gerenciarAtualizacaoContatos(transaction, idUsuario, dados.contatos_emergencia)

                if (dados.doencas_cronicas)
                    await gerenciarAtualizacaoDoencas(transaction, idUsuario, dados.doencas_cronicas)

                return {
                    id_usuario: Number(idUsuario)
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

async function desativarUsuarioTransaction(idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let buscaUsuario = await usuarioService.buscarUsuarioService(idUsuario)

        if (!buscaUsuario.status)
            return buscaUsuario

        await knexConection.transaction(async (transaction) => {
            await desativarUsuario(idUsuario, transaction)
            await desativarRoleUsuario(idUsuario, transaction)
        })

        return customMessages.SUCCESS_DELETE_ITEM

    } catch (error) {
        if (error.resposta)
            return error.resposta

        console.log("ERROR IN USUARIO_TRANSACTIONS: " + error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function desativarRoleUsuario(idUsuario, transaction) {
    let desativarUsuarioRole = await usuarioRoleService.desativarUsuarioRoleService(idUsuario, transaction)

    if (!desativarUsuarioRole.status) {
        let error = new Error("NÃO FOI POSSÍVEL DESATIVAR ROLE DO USUÁRIO")
        error.resposta = desativarUsuarioRole
        throw error
    }
}

async function desativarUsuario(idUsuario, transaction) {
    let resultado = await usuarioService.desativarUsuarioService(idUsuario, transaction)

    if (!resultado.status) {
        let error = new Error("NÃO FOI POSSÍVEL DESATIVAR O USUÁRIO")
        error.resposta = resultado
        throw error
    }
}

async function gerenciarAtualizacaoRoles(transaction, idUsuario, novaRole) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    if (!novaRole || typeof novaRole != 'object' || Array.isArray(novaRole) ||
        !Number.isInteger(Number(novaRole.id_role)) || Number(novaRole.id_role) < 1) {
        customMessages.ERROR_BAD_REQUEST.field = ['ID_ROLE']

        let error = new Error('Role inválida.')
        error.resposta = customMessages.ERROR_BAD_REQUEST
        throw error
    }

    let buscarRole = await roleService.buscarRoleService(Number(novaRole.id_role))

    if (!buscarRole.status) {
        let error = new Error('Não foi possível encontrar a nova role.')
        error.resposta = buscarRole
        throw error
    }

    let buscarRolesAntigas = await usuarioService.buscarRolesAtivasUsuarioService(idUsuario, transaction)

    let roleAntiga = null

    if (buscarRolesAntigas.status) {
        if (buscarRolesAntigas.response.roles.length > 1) {
            customMessages.ERROR_BAD_REQUEST.field = ['USUARIO_ROLE']

            let error = new Error('O usuário possui mais de uma role ativa.')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        roleAntiga = buscarRolesAntigas.response.roles[0] ?? null

    } else if (buscarRolesAntigas.status_code != 404) {
        let error = new Error('Não foi possível buscar a role atual do usuário.')
        error.resposta = buscarRolesAntigas
        throw error
    }

    if (roleAntiga && roleAntiga.id_role == Number(novaRole.id_role))
        return

    let buscarVinculos = await vinculoPacienteService.listarVinculoPacienteService(transaction)

    if (!buscarVinculos.status && buscarVinculos.status_code != 404) {
        let error = new Error('Não foi possível buscar os vínculos do usuário.')
        error.resposta = buscarVinculos
        throw error
    }

    if (buscarVinculos.status) {
        for (const vinculo of buscarVinculos.response.vinculo_paciente) {
            if (vinculo.id_paciente == idUsuario || vinculo.id_cuidador == idUsuario) {
                customMessages.ERROR_BAD_REQUEST.field = ['VINCULO_PACIENTE']

                let error = new Error('Usuário possui vínculos com pacientes ou cuidadores.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }
        }
    }

    if (roleAntiga) {
        let dadosDesativacao = {
            ativo: 0,
            data_ativacao: roleAntiga.data_ativacao,
            data_desativacao: new Date(),
            id_usuarios: Number(idUsuario),
            id_role: roleAntiga.id_role
        }

        let inativar = await usuarioRoleService.atualizarUsuarioRoleService(
            dadosDesativacao, roleAntiga.id, transaction
        )

        if (!inativar.status) {
            let error = new Error('Não foi possível desativar a role antiga.')
            error.resposta = inativar
            throw error
        }
    }

    await atribuirRoleAoUsuario(transaction, idUsuario, novaRole)
}

async function gerenciarAtualizacaoContatos(transaction, idUsuario, contatos) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let contatosProcessados = []

    if (!Array.isArray(contatos)) {
        customMessages.ERROR_BAD_REQUEST.field = ['CONTATOS_EMERGENCIA']

        let error = new Error('Contatos de emergência inválidos.')
        error.resposta = customMessages.ERROR_BAD_REQUEST
        throw error
    }

    if (contatos.length == 0)
        return

    let buscarVinculos = await usuarioContatoEmergenciaService.listarContatoEmergenciaUsuarioService(transaction)

    if (!buscarVinculos.status && buscarVinculos.status_code != 404) {
        let error = new Error('Não foi possível buscar os vínculos dos contatos.')
        error.resposta = buscarVinculos
        throw error
    }

    let vinculos = buscarVinculos.status ? buscarVinculos.response.contato_emergencia_usuarios : []

    for (const contato of contatos) {
        if (!contato || typeof contato != 'object' || Array.isArray(contato)) {
            customMessages.ERROR_BAD_REQUEST.field = ['CONTATOS_EMERGENCIA']

            let error = new Error('Contato de emergência inválido.')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        if (contato.id != null) {
            let validacao = validarDados.validarIDs(contato.id, JSON.parse(JSON.stringify(configMessages)))

            if (validacao) {
                let error = new Error('ID do contato inválido.')
                error.resposta = validacao
                throw error
            }

            let idContato = Number(contato.id)

            if (contatosProcessados.includes(idContato)) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_CONTATO_EMERGENCIA']

                let error = new Error('Contato repetido na requisição.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            contatosProcessados.push(idContato)

            let pertenceUsuario = vinculos.some(function (vinculo) {
                return vinculo.id_usuarios == idUsuario &&
                    vinculo.id_contato_de_emergencia == idContato
            })

            if (!pertenceUsuario) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_CONTATO_EMERGENCIA']

                let error = new Error('O contato de emergência não pertence ao usuário.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            let buscarContato = await contatoEmergenciaService.buscarContatoEmergenciaService(idContato, transaction)

            if (!buscarContato.status) {
                let error = new Error('Não foi possível buscar o contato de emergência.')
                error.resposta = buscarContato
                throw error
            }

            let contatoAtual = buscarContato.response.contato_emergencia[0]

            let dadosContato = {
                nome: contato.nome ?? contatoAtual.nome,
                telefone: contato.telefone ?? contatoAtual.telefone
            }

            let atualizarContato = await contatoEmergenciaService.atualizarContatoEmergenciaService(
                dadosContato, idContato, transaction
            )

            if (!atualizarContato.status) {
                let error = new Error('Não foi possível atualizar o contato de emergência.')
                error.resposta = atualizarContato
                throw error
            }

        } else {
            let dadosContato = {
                nome: contato.nome,
                telefone: contato.telefone
            }

            let inserirContato = await contatoEmergenciaService.inserirContatoEmergenciaService(
                dadosContato, transaction
            )

            if (!inserirContato.status) {
                let error = new Error('Não foi possível cadastrar o contato de emergência.')
                error.resposta = inserirContato
                throw error
            }

            let dadosAtribuicao = {
                id_usuarios: Number(idUsuario),
                id_contato_de_emergencia: inserirContato.response.id
            }

            await atribuirContatoDeEmergencia(dadosAtribuicao, transaction)
        }
    }
}

async function gerenciarAtualizacaoDoencas(transaction, idUsuario, doencas) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let doencasProcessadas = []

    if (!Array.isArray(doencas)) {
        customMessages.ERROR_BAD_REQUEST.field = ['DOENCAS_CRONICAS']

        let error = new Error('Doenças crônicas inválidas.')
        error.resposta = customMessages.ERROR_BAD_REQUEST
        throw error
    }

    if (doencas.length == 0)
        return

    let buscarVinculos = await doencaCronicaUsuarioService.listarDoencaCronicaUsuarioService(transaction)

    if (!buscarVinculos.status && buscarVinculos.status_code != 404) {
        let error = new Error('Não foi possível buscar as doenças do usuário.')
        error.resposta = buscarVinculos
        throw error
    }

    let vinculosUsuario = (buscarVinculos.status ? buscarVinculos.response.doenca_cronica_usuario : [])
        .filter(function (vinculo) {
            return vinculo.id_usuarios == idUsuario
        })

    for (const doenca of doencas) {
        if (!doenca || typeof doenca != 'object' || Array.isArray(doenca) ||
            typeof doenca.nome_doenca != 'string' || !doenca.nome_doenca.trim()) {
            customMessages.ERROR_BAD_REQUEST.field = ['DOENCAS_CRONICAS']

            let error = new Error('Doença crônica inválida.')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        let idVinculo = null

        if (doenca.id != null) {
            let validacao = validarDados.validarIDs(doenca.id, JSON.parse(JSON.stringify(configMessages)))

            if (validacao) {
                let error = new Error('ID da doença inválido.')
                error.resposta = validacao
                throw error
            }

            idVinculo = Number(doenca.id)

            if (doencasProcessadas.includes(idVinculo)) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_DOENCA_CRONICA']

                let error = new Error('Doença repetida na requisição.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            let pertenceUsuario = vinculosUsuario.some(function (vinculo) {
                return vinculo.id == idVinculo
            })

            if (!pertenceUsuario) {
                customMessages.ERROR_BAD_REQUEST.field = ['ID_DOENCA_CRONICA']

                let error = new Error('A doença crônica não pertence ao usuário.')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            doencasProcessadas.push(idVinculo)
        }

        let idDoenca = await obterOuCadastrarDoenca(doenca.nome_doenca, transaction)

        let doencaJaVinculada = vinculosUsuario.some(function (vinculo) {
            return vinculo.id_doenca_cronica == idDoenca && (idVinculo == null || vinculo.id != idVinculo)
        })

        if (doencaJaVinculada) {
            customMessages.ERROR_BAD_REQUEST.field = ['DOENCAS_CRONICAS']

            let error = new Error('Doença crônica já vinculada ao usuário.')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        let dadosAtribuicao = {
            id_usuarios: Number(idUsuario),
            id_doenca_cronica: idDoenca
        }

        if (idVinculo != null) {
            let atualizarDoenca = await doencaCronicaUsuarioService.atualizarDoencaCronicaUsuarioService(
                dadosAtribuicao, idVinculo, transaction
            )

            if (!atualizarDoenca.status) {
                let error = new Error('Não foi possível atualizar a doença do usuário.')
                error.resposta = atualizarDoenca
                throw error
            }

            let vinculoAtualizado = vinculosUsuario.find(function (vinculo) {
                return vinculo.id == idVinculo
            })

            if (vinculoAtualizado)
                vinculoAtualizado.id_doenca_cronica = idDoenca

        } else {
            await atribuirUsuarioDoencaCronica(dadosAtribuicao, transaction)

            vinculosUsuario.push({
                id: null,
                id_usuarios: Number(idUsuario),
                id_doenca_cronica: idDoenca
            })
        }
    }
}

async function realizarCadastroUsuario(dados, transaction) {
    let senhaHash = await bcrypt.hash(dados.senha, 12)

    let dadosPessoais = {
        nome: dados.nome,
        foto: dados.foto ?? null,
        email: dados.email,
        senha: senhaHash,
        cpf: dados.cpf ?? null,
        telefone: dados.telefone ?? null,
        data_nascimento: dados["data_nascimento"]
    }

    let cadastrarUsuario = await usuarioService.inserirUsuarioService(dadosPessoais, transaction)

    if (!cadastrarUsuario.status) {
        let error = new Error("NÃO FOI POSSÍVEL REALIZAR O CADASTRO DO USUÁRIO")
        error.resposta = cadastrarUsuario
        throw error
    }

    return cadastrarUsuario.response.id
}

async function atribuirUsuarioDoencaCronica(dadosAtribuicao, transaction) {
    let result = await doencaCronicaUsuarioService.inserirDoencaCronicaUsuarioService(dadosAtribuicao, transaction)

    if (!result.status) {
        let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR DOENÇA_CRONICA AO USUÁRIO")
        error.resposta = result
        throw error
    }
}

async function cadastrarDoencasCronicasRefat(dados, transaction, idUsuario) {
    let doencasCronicas = dados['doencas_cronicas']

    if (!Array.isArray(doencasCronicas)) return

    let doencasProcessadas = new Set()

    for (const doenca of doencasCronicas) {
        if (!doenca || !doenca.trim()) {
            throw new Error("NOME DA DOENÇA CRÔNICA INVÁLIDO")
        }

        let nomeNormalizado = doenca.trim().toLowerCase()

        if (doencasProcessadas.has(nomeNormalizado)) {
            continue
        }

        doencasProcessadas.add(nomeNormalizado)

        let idDoenca = await obterOuCadastrarDoenca(doenca, transaction)

        let dadosAtribuicao = {
            id_usuarios: idUsuario,
            id_doenca_cronica: idDoenca
        }

        await atribuirUsuarioDoencaCronica(dadosAtribuicao, transaction)
    }
}

async function obterOuCadastrarDoenca(doenca, transaction) {
    let nomeDoenca = doenca.trim()

    let idDoenca = await verificarExistenciaDoenca(nomeDoenca, transaction)

    if (idDoenca) {
        return idDoenca
    }

    let cadastro = await doencasCronicasService.inserirDoencaCronicaService(
        { nome_doenca: nomeDoenca },
        transaction
    )

    if (!cadastro.status) {
        let error = new Error("NÃO FOI POSSÍVEL CADASTRAR A DOENÇA CRÔNICA")
        error.resposta = cadastro
        throw error
    }

    return cadastro.response.id
}

async function verificarExistenciaDoenca(nomeDoenca, transaction) {
    let busca = await doencasCronicasService.buscarDoencaCronicaPorNomeService(
        nomeDoenca,
        transaction
    )

    if (busca.status) {
        return busca.response.doencas_cronicas[0].id
    }

    if (busca.status_code === 404) {
        return null
    }

    let error = new Error("NÃO FOI POSSÍVEL VERIFICAR A EXISTÊNCIA DA DOENÇA CRÔNICA")
    error.resposta = busca
    throw error
}

async function inserirContatosEmergencia(dados, transaction, idUsuario) {
    let contatos_emergencia = dados['contatos_emergencias']

    if (Array.isArray(contatos_emergencia)) {
        for (const contato of contatos_emergencia) {
            let inserirContato = await contatoEmergenciaService.inserirContatoEmergenciaService(
                contato, transaction
            )

            if (!inserirContato.status) {
                let error = new Error("NÃO FOI POSSÍVEL INSERIR O CONTATO DE EMERGÊNCIA")
                error.resposta = inserirContato
                throw error
            }

            let dadosAtribuicao = {
                id_usuarios: idUsuario,
                id_contato_de_emergencia: inserirContato.response.id
            }

            await atribuirContatoDeEmergencia(dadosAtribuicao, transaction)
        }
    }
}

async function atribuirContatoDeEmergencia(dadosAtribuicao, transaction) {
    let result = await usuarioContatoEmergenciaService.inserirContatoEmergenciaUsuarioService(dadosAtribuicao, transaction)

    if (!result.status) {
        let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR CONTATO DE EMERGENCIA AO USUÁRIO")
        error.resposta = result
        throw error
    }
}

async function atribuirRoleAoUsuario(transaction, idUsuario, roleUsuario) {
    let buscar = await roleService.buscarRoleService(roleUsuario['id_role'])

    if (!buscar.status) {
        let error = new Error("ROLE NÃO ENCONTRADA")
        error.resposta = buscar
        throw error
    }

    let dadosRelacao = {
        ativo: 1,
        data_ativacao: new Date(),
        data_desativacao: null,
        id_usuarios: Number(idUsuario),
        id_role: Number(roleUsuario['id_role'])
    }

    let atribuir = await usuarioRoleService.inserirUsuarioRoleService(dadosRelacao, transaction)

    if (!atribuir.status) {
        let error = new Error(`NÃO FOI POSSÍVEL ATRIBUIR A ROLE ${roleUsuario['id_role']} AO USUÁRIO`)
        error.resposta = atribuir
        throw error
    }
}

module.exports = {
    cadastrarUsuarioTransaction,
    atualizarUsuarioTransaction,
    desativarUsuarioTransaction
}