/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados dos HORÁRIOS no banco de dados
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

const insertHorario = async function (horario) {
    try {
        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'INSERT',
            horario.horario,
            horario.id_receita_medica,
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

const updateHorario = async function (horario) {
    try {
        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'UPDATE',
            horario.horario,
            horario.id_receita_medica,
            horario.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllHorarios = async function () {
    try {
        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdHorario = async function (id) {
    try {
        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'SELECT_BY_ID',
            null,
            null,
            id
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        console.log('ERRO SELECT_BY_ID HORARIO:', error)
        return false
    }
}

const selectHorariosNaoTomados = async function () {
    try {
        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'SELECT_NAO_TOMADOS',
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

const deleteHorario = async function (id) {
    try {
        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'DELETE',
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

module.exports = {
    insertHorario,
    updateHorario,
    selectAllHorarios,
    selectByIdHorario,
    selectHorariosNaoTomados,
    deleteHorario
}