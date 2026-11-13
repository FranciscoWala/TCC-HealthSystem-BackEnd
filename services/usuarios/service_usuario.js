/*******************************************************************************************
 * Objetivo: Chamada ao DAO e validação dos dados com o retorno de mensagens
 * Data: 20/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const usuarioDAO = require('../../models/DAO/usuarios/usuario.js')

// IMPORT DO SCHEMA DE VALIDAÇÃO
const usuarioSchema = require('../../schemas/usuarioSchema.js')
const usuarioCadastroGoogleSchema = require('../../schemas/usuarioCadastroGoogleSchema.js')
const validarDados = require('../../utils/validar_dados/validarDados.js')

const validarDadosUsuario = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(usuarioSchema, dados, customMessages)
}

const validarDadosCadastroGoogle = function (dados) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    return validarDados.validarDados(usuarioCadastroGoogleSchema, dados, customMessages)
}

const inserirUsuarioGoogleService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosCadastroGoogle(dados)
        if (validacao)
            return validacao

        let result = await usuarioDAO.insertUsuario(dados, transaction)
        if (result) {
            dados.id = result
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = dados

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const inserirUsuarioService = async function (dados, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacao = validarDadosUsuario(dados)
        if (validacao)
            return validacao

        let result = await usuarioDAO.insertUsuario(dados, transaction)
        if (result) {
            dados.id = result
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = dados

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const atualizarUsuarioService = async function (dados, id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarUsuarioService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let validacao = validarDadosUsuario(dados)
        if (validacao)
            return validacao

        dados.id = Number(id)
        console.log(dados);
        
        let result = await usuarioDAO.updateUsuario(dados,transaction)
        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_UPDATE_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = dados

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const listarUsuarioService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await usuarioDAO.selectAllUsuarios(transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.usuario = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarUsuarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)
        if (validacaoId)
            return validacaoId

        let result = await usuarioDAO.selectByIdUsuario(id, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.usuario = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarUsuarioPorEmailService = async function (email, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let validarEmail = validarDados.validarDados(
            usuarioSchema.extract('email'),
            email.email,
            customMessages
        )
        if (validarEmail)
            return validarEmail

        let result = await usuarioDAO.selectUsuarioByEmail(email, transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.usuario = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const excluirUsuarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscarID = await buscarUsuarioService(id, transaction)
        if (!buscarID.status)
            return buscarID

        let result = await usuarioDAO.deleteUsuario(id, transaction)
        if (result)
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const listarDadosUsuariosService = async function (transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let result = await usuarioDAO.selectDadosUsuarios(transaction)
        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.usuario = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const buscarRolesAtivasUsuarioService = async (idUsuario, transaction = null) => {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await usuarioDAO.buscarRolesAtivasDoUsuario(idUsuario, transaction)

        if(result){
            if(result.length > 0){
                customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count = result.length
                customMessages.DEFAULT_MESSAGE.response.roles = result

                return customMessages.DEFAULT_MESSAGE
            }else{
                return customMessages.ERROR_NOT_FOUND
            }
        }else{
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

async function desativarUsuarioService(idUsuario, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        let buscaUsuario = await buscarUsuarioService(idUsuario, transaction)
        if(!buscaUsuario.status)
            return buscaUsuario

        let result = await usuarioDAO.desactivateUsuario(idUsuario, transaction)

        if(result)
            return customMessages.SUCCESS_DELETE_ITEM
        else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        console.log("ERROR IN USUARIO SERVICE: " + error)
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const verificarEmailUsuarioService = async function (id, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)

        if (validacaoId)
            return validacaoId

        let result = await usuarioDAO.verificarEmailUsuario(id, transaction)

        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

const atualizarSenhaUsuarioService = async function (id, senha, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validacaoId = validarDados.validarIDs(id, customMessages)

        if (validacaoId)
            return validacaoId

        if (typeof senha != 'string' || senha.length < 8 || senha.length > 72)
            return customMessages.ERROR_BAD_REQUEST

        let result = await usuarioDAO.updateSenhaUsuario(id, senha, transaction)

        if (result) {
            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_UPDATE_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_UPDATE_ITEM.status_code

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_SERVICE
    }
}

module.exports = {
    inserirUsuarioGoogleService,
    inserirUsuarioService,
    atualizarUsuarioService,
    listarUsuarioService,
    buscarUsuarioService,
    excluirUsuarioService,
    buscarUsuarioPorEmailService,
    listarDadosUsuariosService,
    buscarRolesAtivasUsuarioService,
    desativarUsuarioService,
    verificarEmailUsuarioService,
    atualizarSenhaUsuarioService
}
