
/***************************************************************************************************
    Objetivo: Arquivo responsável pela interação com o banco de dados da tabela usuario_google
    Data: 09/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
****************************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertUsuarioGoogle = async function (usuarioGoogle, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuarioGoogle(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            usuarioGoogle.google_id,
            usuarioGoogle.id_usuario,
            null
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectUsuarioGoogleByGoogleId = async function (googleId, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuarioGoogle(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_GOOGLE_ID',
            googleId,
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

const selectUsuarioGoogleByIdUsuario = async function (idUsuario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuarioGoogle(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID_USUARIO',
            null,
            idUsuario,
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

const deleteUsuarioGoogle = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuarioGoogle(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            null,
            id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertUsuarioGoogle,
    selectUsuarioGoogleByGoogleId,
    selectUsuarioGoogleByIdUsuario,
    deleteUsuarioGoogle
}
