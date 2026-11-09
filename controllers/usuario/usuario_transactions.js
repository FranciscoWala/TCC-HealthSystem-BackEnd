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

//Solução temporária (necessário refatorar o schema do usuário para adicionar novos atributos)
function validarDadosUsuario(dados) {
    return false
}



async function cadastrarUsuarioTransaction(dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let result = await knexConection.transaction(async (transaction) => {

                let idUsuario = await realizarCadastroUsuario(dados, transaction)

                await cadastrarDoencasCronicasRefat(dados, transaction, idUsuario)
                await inserirContatosEmergencia(dados, transaction, idUsuario)
                await atribuirRoleAoUsuario(transaction, idUsuario, dados['usuario_role'])

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
        console.log(error);
        return false
    }
}

async function atualizarUsuarioTransaction(dados, contentType, idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = await validarDadosUsuario(dados)
            let buscaUsuario = await usuarioService.buscarUsuarioService(idUsuario)

            if (validacao)
                return validacao

            if (!buscaUsuario.status)
                return buscaUsuario

            let result = await knexConection.transaction(async (transaction) => {
                await atualizarCadastroUsuario(dados, transaction)
                await atualizarDoencasCronicas(dados, transaction)
                await atualizarContatosEmergencia(dados, transaction)
                await gerenciarAtualizacaoRoles(transaction, idUsuario, dados)
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
    let novasRoles = dados["usuario_role"] || []
    let rolesAntigas = []

    let buscaRolesAntigas = await usuarioService.buscarRolesAtivasUsuarioService(idUsuario)

    if (buscaRolesAntigas.status) {
        rolesAntigas = buscaRolesAntigas.response.roles;
    } else if (buscaRolesAntigas.status_code === 404) {
        throw new Error("NÃO FOI POSSÍVEL BUSCAR AS ROLES ATUAIS DO USUÁRIO");
    }


    let rolesParaDesativar = rolesAntigas.filter(
        role => !novasRoles.includes(role.id_role)
    )

    let idsAntigos = rolesAntigas.map(role => role.id_role)
    let rolesInserir = novasRoles.filter(
        roleID => !idsAntigos.includes(roleID)
    )

    if (rolesParaDesativar.length > 0) {
        for (const role of rolesParaDesativar) {
            let dadosDesativacao = {
                ativo: 0,
                data_desativacao: new Date(),
                id_usuarios: idUsuario,
                id_role: role.id_role
            }

            let inativar = await usuarioRoleService.atualizarUsuarioRoleService(dadosDesativacao, role.id, transaction)

            if (!inativar.status) {
                let error = new Error(`NÃO FOI POSSÍVEL INATIVAR A ROLE ${role.id_role}`);
                error.resposta = inativar;
                throw error;
            }
        }

        if (rolesInserir.length > 0) {
            await atribuirRoleAoUsuario(transaction, idUsuario, rolesInserir, usuarioRoleService.inserirUsuarioRoleService)
        }
    }
}

async function atualizarCadastroUsuario(dados, transaction) {
    let dadosPessoais = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        data_nascimento: dados["data_nascimento"]
    }

    let atualizarUsuario = await usuarioService.atualizarUsuarioService(
        dadosPessoais, transaction
    )

    if (!atualizarUsuario.status) {
        let error = new Error("NÃO FOI POSSÍVEL REALIZAR O CADASTRO DO USUÁRIO")
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
    let dadosPessoais = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        cpf: dados.cpf,
        data_nascimento: dados["data_nascimento"]
    }

    let cadastrarUsuario = await usuarioService.inserirUsuarioService(
        dadosPessoais, transaction
    )

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

async function buscarRole(rolesUsuario) {
    let result

    if (Array.isArray(rolesUsuario)) {
        for (const roleID of rolesUsuario) {
            result = await roleService.buscarRoleService(roleID)

            if (!result.status)
                return false
        }
    }
}

async function atribuirRoleAoUsuario(transaction, idUsuario, rolesUsuario) {
    await buscarRole(rolesUsuario)

    if (Array.isArray(rolesUsuario)) {
        for (const role of rolesUsuario) {
            let dadosRelacao = {
                ativo: 1,
                data_ativacao: new Date(),
                data_desativacao: null,
                id_usuarios: Number(idUsuario),
                id_role: Number(role['id_role'])
            }

            let atribuir = await usuarioRoleService.inserirUsuarioRoleService(dadosRelacao, transaction);

            if (!atribuir.status) {
                let error = new Error(`NÃO FOI POSSÍVEL ATRIBUIR A ROLE ${role['id_role']} AO USUÁRIO`);
                error.resposta = atribuir;
                throw error;
            }
        }
    }
}



module.exports = {
    cadastrarUsuarioTransaction,
    atualizarUsuarioTransaction,
    desativarUsuarioTransaction
}