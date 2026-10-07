/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de HORARIO_MEDICAMENTO no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)


async function insertHistoricoMedicamento(historicoMedicamento) {

    try {
        let sql =
            `insert into tbl_historico_medicamento(
           hora_ingestao, 
           id_paciente,
           dosagem_ingerida,
           id_horario,
           status_ingestao 
        ).values(
            '${historicoMedicamento.hora_ingestao}',
            ${historicoMedicamento.id_paciente},
            ${historicoMedicamento.dosagem_ingerida},
            ${historicoMedicamento.id_horario},
            '${historicoMedicamento.status_ingestao}'
        );`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function updateHistoricoMedicamento(historicoMedicamento, id) {

    try {
        let sql =
            `
        update tbl_historico_medicamento
            set 
                hora_ingestao = '${historicoMedicamento.hora_ingestao}',
                id_paciente = ${historicoMedicamento.id_paciente},
                dosagem_ingerida = ${historicoMedicamento.dosagem_ingerida},
                id_horario = ${historicoMedicamento.id_horario},
                status_ingestao = '${historicoMedicamento.status_ingestao}'
            where id = ${id};
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

async function getHistoricoMedicamento() {

    try {
        let sql =
            `
        select * from tbl_historico_medicamento;    
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

async function getHistoricoMedicamentoByID(id) {

    try {
        let sql =
            `
        select * from tbl_historico where id = ${id}
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

async function deleteHistoricoMedicamentoByID(id) {

    try {
        let sql =
            `
        delete from tbl_historico_medicamento where id = ${id}
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

exports.modules = {
    insertHistoricoMedicamento,
    updateHistoricoMedicamento,
    getHistoricoMedicamento,
    getHistoricoMedicamentoByID,
    deleteHistoricoMedicamentoByID
}