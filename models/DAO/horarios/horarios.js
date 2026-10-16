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

const selectByIdHorarioCompleto = async function (id) {
    try {
        let sql = `
            select
                horario.id,
                horario.horario,
                medicamentos.nome as nome_medicamento,
                medicamentos.concentracao,
                unidade_medida.sigla as unidade_concentracao,
                tipo_dosagem.tipo_dosagem
            from tbl_horarios as horario
            inner join tbl_receita_medica as receita_medica
                on horario.id_receita_medica = receita_medica.id
            inner join tbl_medicamentos as medicamentos
                on receita_medica.id_medicamento = medicamentos.id
            inner join tbl_unidade_medida as unidade_medida
                on medicamentos.id_unidade_medida_embalagem = unidade_medida.id
            inner join tbl_tipo_dosagem as tipo_dosagem
                on medicamentos.id_tipo_dosagem = tipo_dosagem.id
            where horario.id = ${id};
        `

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
    selectByIdHorarioCompleto,
    deleteHorario
}