/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do VINCULO DO PACIENTE no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertVinculoPaciente = async function (vinculoPaciente, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            null,
            vinculoPaciente.id_paciente,
            vinculoPaciente.id_cuidador,
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

const updateVinculoPaciente = async function (vinculoPaciente, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            vinculoPaciente.data_vinculo,
            vinculoPaciente.id_paciente,
            vinculoPaciente.id_cuidador,
            vinculoPaciente.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllVinculosPacientes = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdVinculoPaciente = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
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

const deleteVinculoPaciente = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
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
        console.log(error)
        return false
    }
}

const selectVinculoPacienteByIDPacienteAndIDCuidador = async function (idPaciente, idCuidador) {
    try {
        let sql = `select * from tbl_vinculo_paciente where id_paciente = ? and id_cuidador = ?;`

        let result = await knexConection.raw(sql, [idPaciente, idCuidador])

        if (result)
            return result[0]
        else
            return false

    } catch (error) {
        console.log(error)
        throw error
    }
}

const selectByIdPacienteVinculoPaciente = async function (idPaciente, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID_PACIENTE',
            null,
            idPaciente,
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

const selectByIdCuidadorVinculoPaciente = async function (idCuidador, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procVinculoPaciente(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID_CUIDADOR',
            null,
            null,
            idCuidador,
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
    insertVinculoPaciente,
    updateVinculoPaciente,
    selectAllVinculosPacientes,
    selectByIdVinculoPaciente,
    deleteVinculoPaciente,

    selectVinculoPacienteByIDPacienteAndIDCuidador,
    selectByIdPacienteVinculoPaciente,
    selectByIdCuidadorVinculoPaciente
}