/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do USUARIO no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

//IMPORT DA BIBLIOTECA PARA MANIPULAR DADOS NO BD MYSQL
const knex = require('knex')

//IMPORT DO ARQUIVO DE CONFIGURAÇÃO PARA ACESSO AO BD
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

//CRIAR A CONEXÃO COM O BANCO DE DADOS CONFORME A CONFIGURAÇÃO
const knexConection = knex(knexDataBaseConfig.development)

const insertUsuario = async function (usuario) {
    try {
        let sql = `insert into tbl_usuarios (
            nome,
            email,
            senha,
            data_nascimento
        ) values (
            '${usuario.nome}',
            '${usuario.email}',
            '${usuario.senha}', 
            '${usuario.data_nascimento}' 
        );`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        return false
    }
}

const updateUsuario = async function (usuario) {
    try {
        let sql = `update tbl_usuarios set
                        nome = '${usuario.nome}',
                        email = '${usuario.email}',
                        senha = '${usuario.senha}',
                        data_nascimento = '${usuario.data_nascimento}'
                    where id = ${usuario.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllUsuarios = async function () {
    try {
        let sql = `select * from tbl_usuarios order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdUsuario = async function (id) {
    try {
        let sql = `select * from tbl_usuarios where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectUsuarioByEmail = async function(email){
    try {
        let sql = `select * from vw_dados_usuarios_JWT where email ='${email}';`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result))
            return result[0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectDadosUsuarios = async function () {
    try {
        let sql = `select * from vw_dados_usuarios;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteUsuario = async function (id) {
    try {
        let sql = `delete from tbl_usuarios where id = ${id};`

        let result = knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertUsuario,
    updateUsuario,
    selectAllUsuarios,
    selectByIdUsuario,
    selectUsuarioByEmail,
    selectDadosUsuarios,
    deleteUsuario
}