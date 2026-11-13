/***********************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do CÓDIGO DE VERIFICAÇÃO no banco de dados
 *          MySQL
 * Data: 12/11/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
************************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertCodigoVerificacao = async function (codigoVerificacao, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            codigoVerificacao.codigo_hash,
            codigoVerificacao.tipo,
            codigoVerificacao.id_usuario ?? null,
            codigoVerificacao.email ?? null,
            codigoVerificacao.data_expiracao,
            null,
            null,
            null
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY')
            return 'CODIGO_DUPLICADO'

        return false
    }
}

const updateCodigoVerificacao = async function (codigoVerificacao, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            codigoVerificacao.codigo_hash,
            codigoVerificacao.tipo,
            codigoVerificacao.id_usuario ?? null,
            codigoVerificacao.email ?? null,
            codigoVerificacao.data_expiracao,
            codigoVerificacao.utilizado,
            codigoVerificacao.tentativas,
            codigoVerificacao.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllCodigosVerificacao = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
            null,
            null,
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

const selectByIdCodigoVerificacao = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
            null,
            null,
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

const selectByUsuarioTipoCodigoVerificacao = async function (idUsuario, tipo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_USUARIO_TIPO',
            null,
            tipo,
            idUsuario,
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

const selectByHashTipoCodigoVerificacao = async function (codigoHash, tipo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_HASH_TIPO',
            codigoHash,
            tipo,
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

const deleteCodigoVerificacao = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        console.log('ERRO AO EXCLUIR CÓDIGO DE VERIFICAÇÃO:', error)
        return false
    }
}

const selectByHashTipoCodigoVerificacaoBloqueado = async function (codigoHash, tipo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_HASH_TIPO_BLOQUEADO',
            codigoHash,
            tipo,
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
        console.log('ERRO AO BUSCAR CÓDIGO POR HASH BLOQUEADO:', error)
        return false
    }
}

const selectByEmailTipoCodigoVerificacao = async function (email, tipo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_EMAIL_TIPO',
            null,
            tipo,
            null,
            email,
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

const selectByEmailTipoBloqueadoCodigoVerificacao = async function (email, tipo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procCodigoVerificacao(?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_EMAIL_TIPO_BLOQUEADO',
            null,
            tipo,
            null,
            email,
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

module.exports = {
    insertCodigoVerificacao,
    updateCodigoVerificacao,
    selectAllCodigosVerificacao,
    selectByIdCodigoVerificacao,
    selectByUsuarioTipoCodigoVerificacao,
    selectByHashTipoCodigoVerificacao,
    selectByHashTipoCodigoVerificacaoBloqueado,
    deleteCodigoVerificacao,

    // Selects de codigo email
    selectByEmailTipoCodigoVerificacao,
    selectByEmailTipoBloqueadoCodigoVerificacao
}