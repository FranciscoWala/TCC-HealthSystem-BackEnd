/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de CONTATOS_DE_EMERGENCIA no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)


async function insertContatoEmergencia(contatoEmergencia){
    let sql = 
        `insert into tbl_contato_de_emergencia(
           nome, 
           telefone 
        )values(
            '${contatoEmergencia.nome}',
            '${contatoEmergencia.telefone}'
        );`

    let result = await knexConection.raw(sql)

    if (result)
        return result[0].insertId
    else
        return false
}

async function updateContatoEmergencia(contatoEmergencia) {
    let sql = 
    `
        update tbl_contato_de_emergencia
            set 
                nome = '${contatoEmergencia.nome}',
                telefone = '${contatoEmergencia.telefone}'
            where id = ${contatoEmergencia.id};
    `

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else
        return false
}

async function getContatosEmergencia() {
    let sql = 
    `
        select * from tbl_contato_de_emergencia;    
    `

    let result = await knexConection.raw(sql)

    if(Array.isArray(result))
        return result[0]
    else
        return false
}

async function getContatosEmergenciaByID(id) {
    let sql =
    `
        select * from tbl_contato_de_emergencia where id = ${id}
    `

    let result = await knexConection.raw(sql)

    if(Array.isArray(result))
        return result[0]
    else 
        return false
}

async function deleteContatoEmergenciaByID(id) {
    let sql =
    `
        delete from tbl_contato_de_emergencia where id = ${id}
    `

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else
        return false
}

module.exports = {
    insertContatoEmergencia,
    updateContatoEmergencia,
    getContatosEmergencia,
    getContatosEmergenciaByID,
    deleteContatoEmergenciaByID
}