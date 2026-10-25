/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do TIPO INTERVALO no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertTipoIntervalo = async function (tipoIntervalo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procTipoIntervalo(?, ?, ?);`

        let result = await connection.raw(sql, ['INSERT', tipoIntervalo.tipo_intervalo, null])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateTipoIntervalo = async function (tipoIntervalo, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procTipoIntervalo(?, ?, ?);`

        let result = await connection.raw(sql, ['UPDATE', tipoIntervalo.tipo_intervalo, tipoIntervalo.id])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllTipoIntervalo = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procTipoIntervalo(?, ?, ?)`

        let result = await connection.raw(sql, ['SELECT_ALL', null, null])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdTipoIntervalo = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procTipoIntervalo(?, ?, ?)`

        let result = await connection.raw(sql, ['SELECT_BY_ID', null, id])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteTipoIntervalo = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procTipoIntervalo(?, ?, ?)`

        let result = await connection.raw(sql, ['DELETE', null, id])

        if (result)
            return true
        else
            return false
    } catch (error) {
        
        return false
    }
}

module.exports = {
    insertTipoIntervalo,
    updateTipoIntervalo,
    selectAllTipoIntervalo,
    selectByIdTipoIntervalo,
    deleteTipoIntervalo
}