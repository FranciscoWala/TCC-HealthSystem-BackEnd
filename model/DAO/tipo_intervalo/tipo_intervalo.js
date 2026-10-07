/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do TIPO INTERVALO no banco de dados
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

const insertTipoIntervalo = async function (tipoIntervalo) {
    try {
        let sql = `insert into tbl_tipo_intervalo (
            tipo_intervalo
        ) values (
            '${tipoIntervalo.tipo_intervalo}' 
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

const updateTipoIntervalo = async function (tipoIntervalo) {
    try {
        let sql = `update tbl_tipo_intervalo set
                        tipo_intervalo = '${tipoIntervalo.tipo_intervalo}'
                    where id = ${tipoIntervalo.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllTipoIntervalo = async function () {
    try {
        let sql = `select * from tbl_tipo_intervalo order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdTipoIntervalo = async function (id) {
    try {
        let sql = `select * from tbl_tipo_intervalo where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteTipoIntervalo = async function (id) {
    try {
        let sql = `delete from tbl_tipo_intervalo where id = ${id}`

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
    insertTipoIntervalo,
    updateTipoIntervalo,
    selectAllTipoIntervalo,
    selectByIdTipoIntervalo,
    deleteTipoIntervalo
}