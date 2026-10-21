/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do MEDICAMENTO no banco de dados
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

const insertMedicamento = async function (medicamentos) {
    try {
        let sql = `call procMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'INSERT',
            medicamentos.nome,
            medicamentos.imagem,
            medicamentos.concentracao,
            medicamentos.id_unidade_medida_embalagem,
            medicamentos.id_tipo_dosagem,
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

const updateMedicamento = async function (medicamentos) {
    try {
        let sql = `call procMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'UPDATE',
            medicamentos.nome,
            medicamentos.imagem,
            medicamentos.concentracao,
            medicamentos.id_unidade_medida_embalagem,
            medicamentos.id_tipo_dosagem,
            medicamentos.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllMedicamentos = async function () {
    try {
        let sql = `call procMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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

const selectByIdMedicamento = async function (id) {
    try {
        let sql = `call procMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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

const deleteMedicamento = async function (id) {
    try {
        let sql = `call procMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = knexConection.raw(sql, [
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

module.exports = {
    insertMedicamento,
    updateMedicamento,
    selectAllMedicamentos,
    selectByIdMedicamento,
    deleteMedicamento
}