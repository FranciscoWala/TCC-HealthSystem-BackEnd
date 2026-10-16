/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da UNIDADE DE MEDIDA no banco de dados
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

const insertUnidadeMedida = async function (unidadeMedida) {
    try {
        let sql = `insert into tbl_unidade_medida (
            unidade_medida,
            sigla
        ) values (
            '${unidadeMedida.unidade_medida}',
            '${unidadeMedida.sigla}'
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

const updateUnidadeMedida = async function (unidadeMedida) {
    try {
        let sql = `update tbl_unidade_medida set
                        unidade_medida = '${unidadeMedida.unidade_medida}',
                        sigla = '${unidadeMedida.sigla}'
                    where id = ${unidadeMedida.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllUnidadeMedida = async function () {
    try {
        let sql = `select * from tbl_unidade_medida order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdUnidadeMedida = async function (id) {
    try {
        let sql = `select * from tbl_unidade_medida where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteUnidadeMedida = async function (id) {
    try {
        let sql = `delete from tbl_unidade_medida where id = ${id}`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertUnidadeMedida,
    updateUnidadeMedida,
    selectAllUnidadeMedida,
    selectByIdUnidadeMedida,
    deleteUnidadeMedida
}