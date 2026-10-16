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
        let sql = `insert into tbl_horarios (
            horario,
            id_receita_medica
        ) values (
            '${horario.horario}',
            ${horario.id_receita_medica}
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

const updateHorario = async function (horario) {
    try {
        let sql = `update tbl_horarios set
                        horario = '${horario.horario}',
                        id_receita_medica = ${horario.id_receita_medica}
                    where id = ${horario.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllHorarios = async function () {
    try {
        let sql = `select * from tbl_horarios order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdHorario = async function (id) {
    try {
        let sql = `select * from tbl_horarios where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteHorario = async function (id) {
    try {
        let sql = `delete from tbl_horarios where id = ${id};`

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
    insertHorario,
    updateHorario,
    selectAllHorarios,
    selectByIdHorario,
    deleteHorario
}