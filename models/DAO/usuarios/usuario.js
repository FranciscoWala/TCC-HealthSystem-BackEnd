/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do USUARIO no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertUsuario = async function (usuario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            usuario.nome,
            usuario.email,
            usuario.senha,
            usuario.cpf,
            usuario.data_nascimento,
            null
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false
    } catch (error) {
        return false
    }
}

const updateUsuario = async function (usuario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            usuario.nome,
            usuario.email,
            usuario.senha,
            usuario.cpf,
            usuario.data_nascimento,
            usuario.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllUsuarios = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdUsuario = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectDadosUsuarios = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_DADOS_USUARIOS',
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectUsuarioByEmail = async function(email, transaction = null) {
    try {
        let connection = transaction || knexConection
        
        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_EMAIL',
            null,
            email.email,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteUsuario = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuario(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const buscarRolesAtivasDoUsuario = async (idUsuario, transaction = null) => {
    try {
        let connection = transaction || knexConection

        let sql = `select * from tbl_usuarios_role where id_usuarios=${idUsuario} and ativo=1;`
        
        let result = await knexConection.raw(sql)

        if(result)
            return result[0]
        else 
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertUsuario,
    updateUsuario,
    selectAllUsuarios,
    selectByIdUsuario,
    selectDadosUsuarios,
    selectUsuarioByEmail,
    deleteUsuario,
    buscarRolesAtivasDoUsuario
}