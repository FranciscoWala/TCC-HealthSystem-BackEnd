/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio do CADASTRO DE USUÁRIO
 * Autor: Samuel Silva Moreira Dos Santos
 * Data: 28/12/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

//IMPORT DOS ARQUIVOS DE VALIDAÇÃO E SCHEMA DO USUÁRIO
const usuarioSchema = require('../../schemas/usuarioSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

//IMPORT DAS SERVICES
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

/*
    O que será feito:

    ao cadastrar o usuário deve-se:
        1. inserir os dados pessoais do usuário na tbl_usuarios
        2. inserir as doenças crônicas do usuário na tbl_doencas_cronicas
        3. inserir os contatos de emergência do usuário na tbl_contato_emergencia
        4. buscar role
        5. vincular o usuário a role

    ao atualizar os dados de cadastro do usuário deve-se:
        1.
        
        
    O que precisa concertar:
        1. Atribuir contato de emergência ao usuário na intermediária
        2. Atribuir doença crônica ao usuário na intermediária
*/

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

            let result = await knexConection.transaction(async function (transaction) {

                let buscarUsuario = await usuarioService.buscarUsuarioService(idUsuario, transaction)

                if (!buscarUsuario.status) {
                    let error = new Error('Não foi possível encontrar o usuário.')
                    error.resposta = buscarUsuario
                    throw error
                }

                if (dados.usuario) {
                    let usuarioAtual = buscarUsuario.response.usuario[0]

                    let dadosUsuario = {
                        nome: dados.usuario.nome ?? usuarioAtual.nome,
                        foto: dados.usuario.foto ?? usuarioAtual.foto,
                        email: dados.usuario.email ?? usuarioAtual.email,
                        senha: dados.usuario.senha ?? usuarioAtual.senha,
                        cpf: dados.usuario.cpf ?? usuarioAtual.cpf,
                        telefone: dados.usuario.telefone ?? usuarioAtual.telefone,
                        data_nascimento: dados.usuario.data_nascimento ?? usuarioAtual.data_nascimento
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
                    await gerenciarAtualizacaoRoles(transaction, idUsuario, dados)

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

        //Necessário fazer uma revisão nesta transaction. 
        // Talvez seja necessário colocar estes métodos internos dentro de funções que lançem erro para rollback  [**JÁ REALIZADO**]
        let result = await knexConection.transaction(async (transaction) => {
            await desativarUsuario(idUsuario, transaction) // Desativa o registro do usuário na tbl_usuarios
            await desativarRoleUsuario(idUsuario, transaction) // Desativa as Roles ativas do usuário
        })

        return customMessages.SUCCESS_DELETE_ITEM

    } catch (error) {
        console.log("ERROR IN USUARIO_TRANSACTIONS: " + error);
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//FUNÇÕES AUXILIARES

//Funções auxiliares para o safe delete do usuário
async function desativarRoleUsuario(idUsuario, transaction) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let desativarUsuarioRole = await usuarioRoleService.desativarUsuarioRoleService(idUsuario, transaction)

        if (!desativarUsuarioRole.status) {
            let error = new Error("NÃO FOI POSSÍVEL DESATIVAR ROLE DO USUÁRIO")
            error.resposta = desativarUsuarioRole
            throw error
        }
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function desativarUsuario(idUsuario, transaction) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let desativarUsuario = await usuarioService.desativarUsuarioService(idUsuario, transaction)

        if (!desativarUsuario.status) {
            let error = new Error("NÃO FOI POSSÍVEL DESATIVAR O USUÁRIO")
            error.resposta = desativarUsuario
            throw error
        }

    } catch (error) {
        console.log("ERROR IN USUARIO_TRANSACTIONS" + error);
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Funções auxiliares para atualizar o usuário 
async function gerenciarAtualizacaoRoles(transaction, idUsuario, dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    let novaRole = dados.usuario_role

    if (!novaRole || !Number.isInteger(Number(novaRole.id_role)) || Number(novaRole.id_role) < 1) {
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

    if (roleAntiga && roleAntiga.id_role == novaRole.id_role)
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


        let inativar = await usuarioRoleService.atualizarUsuarioRoleService(dadosDesativacao, roleAntiga.id, transaction)


        if (!inativar.status) {
            let error = new Error('Não foi possível desativar a role antiga.')
            error.resposta = inativar
            throw error
        }
    }

    await atribuirRoleAoUsuario(transaction, idUsuario, novaRole)
}

async function atualizarCadastroUsuario(dados, transaction, idUsuario) {
    let dadosPessoais = {
        nome: dados.nome,
        foto: dados.foto ?? null,
        email: dados.email,
        senha: dados.senha,
        cpf: dados.cpf ?? null,
        telefone: dados.telefone ?? null,
        data_nascimento: dados["data_nascimento"]
    }

    let atualizarUsuario = await usuarioService.atualizarUsuarioService(
        dadosPessoais, idUsuario, transaction
    )

    if (!atualizarUsuario.status) {
        let error = new Error("NÃO FOI POSSÍVEL ATUALIZAR O CADASTRO DO USUÁRIO")
        error.resposta = atualizarUsuario
        throw error
    } else {
        return atualizarUsuario.response.id
    }
}

async function atualizarDoencasCronicas(dados, transaction) {
    let doencasCronicas = dados["doencas_cronicas"]


    if (Array.isArray(doencasCronicas)) {
        for (const doenca_cronica of doencasCronicas) {
            let dadosDoencaCronica = {
                nome_doenca: doenca_cronica.nome_doenca
            }

            let atualizarDoencasCronicas = await doencasCronicasService.atualizarDoencaCronicaService(
                dadosDoencaCronica, doenca_cronica.id, transaction
            )

            if (!atualizarDoencasCronicas.status) {
                let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR DOENÇA_CRONICA AO USUÁRIO")
                error.resposta = atualizarDoencasCronicas
                throw error
            }
        }
    }
}

async function atualizarContatosEmergencia(dados, transaction) {
    let contatos_emergencia = dados["contatos_emergencia"]
    let dadosContatoEmergencia = {}

    if (Array.isArray(contatos_emergencia)) {

        for (const contato of contatos_emergencia) {
            dadosContatoEmergencia = {
                nome: contato.nome,
                telefone: contato.telefone
            }

            let inserirContato = await
                contatoEmergenciaService.atualizarContatoEmergenciaService(
                    dadosContatoEmergencia, contato.id, transaction
                )

            if (!inserirContato.status) {
                let error = new Error("NÃO FOI POSSÍVEL INSERIR O CONTATO DE EMERGÊNCIA")
                error.resposta = inserirContato
                throw error
            }
        }
    }
}

//Funções auxiliares do cadastro do usuário
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
    } else {
        return cadastrarUsuario.response.id
    }
}
/**
 *  Esta função esta apenas adicionando a doença cronica a tbl_doenca_cronica,
 * porém não vincula ao usuário na tbl_doencas_cronicas_usuarios e nem verifica a existência de uma doença já cadastrada (CORRIGIR)
 *  
 * CORREÇÃO:
 *      1. Adicionar validação de doença já cadastrada (considere criar uma função para)
 *          ao fazer isso:
 *              1. Se a doença já foi cadastrada, será somente atribuida ao usuário
 *              2. Se não existir, somente cadastra no banco
 *      2. Vincular as doencças ao usuário na tbl_doencas_usuario (considere criar uma função exclusiva para)
 */
async function cadastrarDoencasCronicas(dados, transaction, idUsuario) {

    let doencasCronicas = dados['doencas_cronicas']
    let dadosAtribuicao

    if (Array.isArray(doencasCronicas)) {

        for (const doenca_cronica of doencasCronicas) {
            let inserirDoencasCronicas = await doencasCronicasService
                .inserirDoencaCronicaService(
                    doenca_cronica, transaction
                )

            dadosAtribuicao = {
                id_usuarios: idUsuario,
                id_doenca_cronica: inserirDoencasCronicas.response.id
            }

            if (!inserirDoencasCronicas.status) {
                let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR DOENÇA_CRONICA AO USUÁRIO")
                error.resposta = inserirDoencasCronicas
                throw error
            }

            await atribuirUsuarioDoencaCronica(dadosAtribuicao, transaction)
        }
    }
}

async function atribuirUsuarioDoencaCronica(dadosAtribuicao, transaction) {
    try {
        let result = await doencaCronicaUsuarioService.inserirDoencaCronicaUsuarioService(dadosAtribuicao, transaction)

        if (!result.status) {
            let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR DOENÇA_CRONICA AO USUÁRIO")
            error.resposta = result
            throw error
        }

    } catch (error) {
        console.log("ERROR IN ATRIBUIR DOENCA CRONICA: " + error);
        throw error
    }
}

//Revisar código
async function cadastrarDoencasCronicasRefat(dados, transaction, idUsuario) {

    let doencasCronicas = dados['doencas_cronicas'];

    if (!Array.isArray(doencasCronicas)) return;

    // Evita processar a mesma doença duas vezes
    // dentro da própria requisição
    let doencasProcessadas = new Set();

    for (const doenca of doencasCronicas) {

        if (!doenca || !doenca.trim()) {
            throw new Error("NOME DA DOENÇA CRÔNICA INVÁLIDO");
        }

        let nomeNormalizado = doenca
            .trim()
            .toLowerCase();

        if (doencasProcessadas.has(nomeNormalizado)) {
            continue;
        }

        doencasProcessadas.add(nomeNormalizado);

        // Obtém o ID existente ou cadastra uma nova doença
        let idDoenca = await obterOuCadastrarDoenca(
            doenca,
            transaction
        );

        // Prepara o relacionamento entre usuário e doença
        let dadosAtribuicao = {
            id_usuarios: idUsuario,
            id_doenca_cronica: idDoenca
        };

        // Vincula a doença ao usuário
        await atribuirUsuarioDoencaCronica(
            dadosAtribuicao,
            transaction
        );
    }
}

async function obterOuCadastrarDoenca(doenca, transaction) {

    let nomeDoenca = doenca.trim();

    // 1. Verifica se a doença já existe
    let idDoenca = await verificarExistenciaDoenca(
        nomeDoenca,
        transaction
    );

    // 2. Se existir, reutiliza o ID
    if (idDoenca) {
        return idDoenca;
    }

    // 3. Se não existir, realiza o cadastro
    let cadastro = await doencasCronicasService
        .inserirDoencaCronicaService(
            { nome_doenca: nomeDoenca },
            transaction
        );

    if (!cadastro.status) {
        let error = new Error(
            "NÃO FOI POSSÍVEL CADASTRAR A DOENÇA CRÔNICA"
        );

        error.resposta = cadastro;
        throw error;
    }

    // 4. Retorna o ID da doença recém-cadastrada
    return cadastro.response.id;
}


//Realizar a lógica posteriormente
// async function verificarExistênciaDoenca(doenca) {
//     try {


//     } catch (error) {
//         console.log(error)
//         throw error
//     }
// }
//Revisar código
async function verificarExistenciaDoenca(nomeDoenca, transaction) {
    try {
        let busca = await doencasCronicasService
            .buscarDoencaCronicaPorNomeService(
                nomeDoenca,
                transaction
            );

        if (busca.status) {
            return busca.response.doencas_cronicas[0].id;
        }

        // Doença não encontrada
        if (busca.status_code === 404) {
            return null;
        }

        // Qualquer outro erro precisa interromper a transaction
        let error = new Error(
            "NÃO FOI POSSÍVEL VERIFICAR A EXISTÊNCIA DA DOENÇA CRÔNICA"
        );

        error.resposta = busca;
        throw error;

    } catch (error) {
        console.log(error);
        throw error;
    }
}
//Revisar código
async function verificarExistenciaDoenca(nomeDoenca, transaction) {
    try {
        let busca = await doencasCronicasService
            .buscarDoencaCronicaPorNomeService(
                nomeDoenca,
                transaction
            );

        if (busca.status) {
            return busca.response.doencas_cronicas[0].id;
        }

        // Doença não encontrada
        if (busca.status_code === 404) {
            return null;
        }

        // Qualquer outro erro precisa interromper a transaction
        let error = new Error(
            "NÃO FOI POSSÍVEL VERIFICAR A EXISTÊNCIA DA DOENÇA CRÔNICA"
        );

        error.resposta = busca;
        throw error;

    } catch (error) {
        console.log(error);
        throw error;
    }
}
async function inserirContatosEmergencia(dados, transaction, idUsuario) {
    let contatos_emergencia = dados['contatos_emergencias']
    let dadosAtribuicao

    if (Array.isArray(contatos_emergencia)) {

        for (const contato of contatos_emergencia) {
            let inserirContato = await
                contatoEmergenciaService.inserirContatoEmergenciaService(
                    contato, transaction
                )

            dadosAtribuicao = {
                id_usuarios: idUsuario,
                id_contato_de_emergencia: inserirContato.response.id
            }

            if (!inserirContato.status) {
                let error = new Error("NÃO FOI POSSÍVEL INSERIR O CONTATO DE EMERGÊNCIA")
                error.resposta = inserirContato
                throw error
            }

            await atribuirContatoDeEmergencia(dadosAtribuicao, transaction)
        }
    }
}

async function atribuirContatoDeEmergencia(dadosAtribuicao, transaction) {
    try {
        let result = await usuarioContatoEmergenciaService.inserirContatoEmergenciaUsuarioService(dadosAtribuicao, transaction)

        if (!result.status) {
            let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR CONTATO DE EMERGENCIA AO USUÁRIO")
            error.resposta = result
            throw error
        }
    } catch (error) {
        throw error
    }
}

async function buscarRole(roleUsuario) {
    let result = await roleService.buscarRoleService(roleUsuario['id_role'])

    if (!result.status)
        return false

    return true
}

async function atribuirRoleAoUsuario(transaction, idUsuario, roleUsuario) {
    let buscar = await buscarRole(roleUsuario)

    if (!buscar) {
        let error = new Error("ROLE NÃO ENCONTRADA")
        throw error
    }

    let dadosRelacao = {
        ativo: 1,
        data_ativacao: new Date(),
        data_desativacao: null,
        id_usuarios: Number(idUsuario),
        id_role: Number(roleUsuario['id_role'])
    }

    let atribuir = await usuarioRoleService.inserirUsuarioRoleService(dadosRelacao, transaction);

    if (!atribuir.status) {
        let error = new Error(`NÃO FOI POSSÍVEL ATRIBUIR A ROLE ${roleUsuario['id_role']} AO USUÁRIO`);
        error.resposta = atribuir;
        throw error;
    }
}

async function gerenciarAtualizacaoContatos(transaction, idUsuario, contatos) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let contatosProcessados = []

    if (!Array.isArray(contatos)) {
        let error = new Error('CONTATOS DE EMERGÊNCIA INVÁLIDOS')
        error.resposta = customMessages.ERROR_BAD_REQUEST
        throw error
    }

    for (const contato of contatos) {
        if (!contato || typeof contato != 'object' || Array.isArray(contato)) {
            let error = new Error('CONTATO DE EMERGÊNCIA INVÁLIDO')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        if (contato.id != null) {
            let validacao = validarDados.validarIDs(contato.id, customMessages)

            if (validacao) {
                let error = new Error('ID DO CONTATO INVÁLIDO')
                error.resposta = validacao
                throw error
            }

            let idContato = Number(contato.id)

            if (contatosProcessados.includes(idContato)) {
                let error = new Error('CONTATO REPETIDO')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            contatosProcessados.push(idContato)

            let buscarVinculos = await usuarioContatoEmergenciaService.listarContatoEmergenciaUsuarioService(transaction)

            if (!buscarVinculos.status) {
                let error = new Error('NÃO FOI POSSÍVEL BUSCAR OS VÍNCULOS DOS CONTATOS')
                error.resposta = buscarVinculos
                throw error
            }

            let pertenceUsuario = false

            for (const vinculo of buscarVinculos.response.contato_emergencia_usuarios) {
                if (vinculo.id_usuarios == idUsuario &&
                    vinculo.id_contato_de_emergencia == idContato) {
                    pertenceUsuario = true
                    break
                }
            }

            if (!pertenceUsuario) {
                let error = new Error('CONTATO NÃO PERTENCE AO USUÁRIO')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            let buscarContato = await contatoEmergenciaService.buscarContatoEmergenciaService(idContato, transaction)

            if (!buscarContato.status) {
                let error = new Error('NÃO FOI POSSÍVEL BUSCAR O CONTATO')
                error.resposta = buscarContato
                throw error
            }

            let contatoAtual = buscarContato.response.contato_emergencia[0]

            let dadosContato = {
                nome: contato.nome ?? contatoAtual.nome,
                telefone: contato.telefone ?? contatoAtual.telefone
            }

            let atualizarContato = await contatoEmergenciaService.atualizarContatoEmergenciaService(dadosContato, idContato, transaction)

            if (!atualizarContato.status) {
                let error = new Error('NÃO FOI POSSÍVEL ATUALIZAR O CONTATO')
                error.resposta = atualizarContato
                throw error
            }

        } else {
            let dadosContato = {
                nome: contato.nome,
                telefone: contato.telefone
            }

            let inserirContato = await contatoEmergenciaService.inserirContatoEmergenciaService(dadosContato, transaction)

            if (!inserirContato.status) {
                let error = new Error('NÃO FOI POSSÍVEL CADASTRAR O CONTATO')
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
        let error = new Error('DOENÇAS CRÔNICAS INVÁLIDAS')
        error.resposta = customMessages.ERROR_BAD_REQUEST
        throw error
    }

    for (const doenca of doencas) {
        if (!doenca || typeof doenca.nome_doenca != 'string' || !doenca.nome_doenca.trim()) {
            let error = new Error('DOENÇA CRÔNICA INVÁLIDA')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        if (doenca.id != null) {
            let validacao = validarDados.validarIDs(doenca.id, customMessages)

            if (validacao) {
                let error = new Error('ID DA DOENÇA INVÁLIDO')
                error.resposta = validacao
                throw error
            }

            let idVinculo = Number(doenca.id)

            if (doencasProcessadas.includes(idVinculo)) {
                let error = new Error('DOENÇA REPETIDA')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            doencasProcessadas.push(idVinculo)
        }

        let idDoenca = await obterOuCadastrarDoenca(doenca.nome_doenca, transaction)

        let buscarVinculos = await doencaCronicaUsuarioService.listarDoencaCronicaUsuarioService(transaction)

        if (!buscarVinculos.status && buscarVinculos.status_code != 404) {
            let error = new Error('NÃO FOI POSSÍVEL BUSCAR AS DOENÇAS DO USUÁRIO')
            error.resposta = buscarVinculos
            throw error
        }

        let vinculos = buscarVinculos.status ? buscarVinculos.response.doenca_cronica_usuario : []

        let pertenceUsuario = false
        let doencaJaVinculada = false

        for (const vinculo of vinculos) {
            if (vinculo.id_usuarios == idUsuario) {

                if (doenca.id != null && vinculo.id == doenca.id)
                    pertenceUsuario = true

                if (vinculo.id_doenca_cronica == idDoenca &&
                    vinculo.id != doenca.id)
                    doencaJaVinculada = true
            }
        }

        if (doencaJaVinculada) {
            let error = new Error('DOENÇA JÁ VINCULADA AO USUÁRIO')
            error.resposta = customMessages.ERROR_BAD_REQUEST
            throw error
        }

        let dadosAtribuicao = {
            id_usuarios: Number(idUsuario),
            id_doenca_cronica: idDoenca
        }

        if (doenca.id != null) {
            if (!pertenceUsuario) {
                let error = new Error('DOENÇA NÃO PERTENCE AO USUÁRIO')
                error.resposta = customMessages.ERROR_BAD_REQUEST
                throw error
            }

            let atualizarDoenca = await doencaCronicaUsuarioService.atualizarDoencaCronicaUsuarioService(dadosAtribuicao, doenca.id, transaction)

            if (!atualizarDoenca.status) {
                let error = new Error('NÃO FOI POSSÍVEL ATUALIZAR A DOENÇA DO USUÁRIO')
                error.resposta = atualizarDoenca
                throw error
            }

        } else {
            await atribuirUsuarioDoencaCronica(dadosAtribuicao, transaction)
        }
    }
}

module.exports = {
    cadastrarUsuarioTransaction,
    atualizarUsuarioTransaction,
    desativarUsuarioTransaction
}