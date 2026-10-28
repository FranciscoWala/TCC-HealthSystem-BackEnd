/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de RECEITA_MEDICA no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/


const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)


async function insertReceitamedica(receitaMedica) {

    try {
        let sql =
            `insert into tbl_receita_medica(
           id_usuario, 
           id_medicamento,
           frequencia,
           dosagem,
           data_hora_inicio,
           id_unidade_medida,
           id_tipo_intervalo,
           descricao 
        ).values(
            ${receitaMedica.id_usuario},
            ${receitaMedica.id_medicamento},
            ${receitaMedica.frequencia},
            ${receitaMedica.dosagem},
            ${receitaMedica.data_hora_inicio},
            ${receitaMedica.id_unidade_medida},
            ${receitaMedica.id_tipo_intervalo},
            ${receitaMedica.descricao}
        );`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        console.log(error)
        return false + oila
    }
}

async function updateReceitaMedica(receitaMedica, id) {

    try {
        let sql =
            `
        update tbl_receita_medica
            set 
                id_usuario = ${receitaMedica.id_usuario},
                id_medicamento = ${receitaMedica.id_medicamento},
                frequencia = ${receitaMedica.frequencia},
                dosagem = ${receitaMedica.dosagem},
                data_hora_inicio = ${receitaMedica.data_hora_inicio},
                id_unidade_medida = ${receitaMedica.id_unidade_medida},
                id_tipo_intervalo = ${receitaMedica.id_tipo_intervalo},
                descricao = ${receitaMedica.descricao}
            where id = ${id};
    `

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error);
        return false
    }
}

async function getReceitaMedica() {

    try {
        let sql =
            `
            select * from tbl_receita_medica;    
        `

        let result = await knexConection.raw(sql)

        if (result)
            return result[0]
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function getReceitaMedicaByID(id) {

    try {
        let sql =
            `
        select * from tbl_receita_medica where id = ${id}
    `

        let result = await knexConection.raw(sql)

        if (result)
            return result[0]
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function getReceitaMedicaByIDUsuarioAndIDMedicamento(idUsuario, idMedicamento) {
    try {
        let sql = `
             select * from tbl_receita_medica
                where id_usuario=${idUsuario} and id_medicamento=${idMedicamento}
        `

        let result = await knexConection.raw(sql)

        if(result)
            return result[0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }    
}

async function deleteReceitaMedicaByID(id) {
    try {
        let sql =
            `
        delete from tbl_contato_de_emergencia where id = ${id}
    `

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertReceitamedica,
    updateReceitaMedica,
    getReceitaMedicaByID,
    getReceitaMedica,
    getReceitaMedicaByIDUsuarioAndIDMedicamento,
    deleteReceitaMedicaByID
}