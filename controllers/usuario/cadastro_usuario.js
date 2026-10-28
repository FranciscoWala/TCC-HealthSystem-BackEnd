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
const contatoEmergenciaService = require('../../services/contatos_de_emergencia/service_contatos_emergencia.js')
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
*/
function validarDadosUsuario(dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(usuarioSchema, dados, customMessages)
}



async function cadastrarUsuario(dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validacao = validarDadosUsuario(dados)

            if (validacao)
                return validacao

            let result = await knexConection.transaction(async (transaction) => {

                let idUsuario = await realizarCadastroUsuario(dados, transaction)

                await cadastrarDoencasCronicas(dados, transaction)
                await inserirContatosEmergencia(dados, transaction)
                await atribuirRoleAoUsuario(transaction, idUsuario, dados)

            })

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = result

            return customMessages.DEFAULT_MESSAGE
        }else{
            return customMessages.ERROR_CONTENT_TYPE
        }


    } catch (error) {
        console.log(error);
        return false
    }
}

async function realizarCadastroUsuario(dados, transaction) {
    let dadosPessoais = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        data_nascimento: dados["data_nascimento"]
    }

    let cadastrarUsuario = await usuarioService.inserirUsuarioService(
        dadosPessoais, transaction
    )

    if (!cadastrarUsuario.status) {
        let error = new Error("NÃO FOI POSSÍVEL REALIZAR O CADASTRO DO USUÁRIO")
        error.resposta = cadastrarUsuario
        throw error
    }else{
        return cadastrarUsuario.response.id
    }
}

async function cadastrarDoencasCronicas(dados, transaction) {

    let doencasCronicas = dados["doencas_cronicas"]

    if (Array.isArray(doencasCronicas)) {

        for (const doenca_cronica of doencasCronicas) {
            let inserirDoencasCronicas = await doencasCronicasService
                .inserirDoencaCronicaService(
                    doenca_cronica, transaction
                )

            if (!inserirDoencasCronicas.status) {
                let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR DOENÇA_CRONICA AO USUÁRIO")
                error.resposta = inserirDoencasCronicas
                throw error
            }
        }
    }
}

async function inserirContatosEmergencia(dados, transaction) {
    let contatos_emergencia = dados["contatos_emergencia"]

    if (Array.isArray(contatos_emergencia)) {

        for (const contato of contatos_emergencia) {
            let inserirContato = await 
                contatoEmergenciaService.inserirContatoEmergenciaService(
                    contato, transaction
                )


            if (!inserirContato.status) {
                let error = new Error("NÃO FOI POSSÍVEL INSERIR O CONTATO DE EMERGÊNCIA")
                error.resposta = inserirContato
                throw error
            }
        }
    }
}

async function buscarRole(dados) {    
    let rolesUsuario = dados["usuario_role"]

    if(Array.isArray(rolesUsuario)){
        for (const roleID of rolesUsuario) {
            await roleService.buscarRoleService(roleID)
        }
    }
}

async function atribuirRoleAoUsuario(transaction, idUsuario, dados) {
    
    await buscarRole(dados)
    
    let dadosRelacao = {
        ativo: 1,
        data_ativacao: new Date(),
        id_usuario: idUsuario,
        id_role: idRole
    }
    
    let atribuir = await usuarioRoleService.inserirUsuarioRoleService(dadosRelacao, transaction)

    if (!atribuir.status) {
        let error = new Error("NÃO FOI POSSÍVEL ATRIBUIR ROLE AO USUÁRIO")
        error.resposta = cadastrarUsuario
        throw error
    }
}


