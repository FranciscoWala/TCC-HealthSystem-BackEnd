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
        let sql = `insert into tbl_medicamentos (
            nome,
            imagem,
            concentracao,
            id_unidade_medida_embalagem,
            id_tipo_dosagem
        ) values (
            '${medicamentos.nome}',
            '${medicamentos.imagem}',
            '${medicamentos.concentracao}',
            ${medicamentos.id_unidade_medida_embalagem},
            ${medicamentos.id_tipo_dosagem}
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

const updateMedicamento = async function (medicamentos) {
    try {
        let sql = `update tbl_medicamentos set
                        nome = '${medicamentos.nome}',
                        imagem = '${medicamentos.imagem}',
                        concentracao = '${medicamentos.concentracao}',
                        id_unidade_medida_embalagem = ${medicamentos.id_unidade_medida_embalagem},
                        id_tipo_dosagem = ${medicamentos.id_tipo_dosagem}
                    where id = ${medicamentos.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllMedicamentos = async function () {
    try {
        let sql = `select * from tbl_medicamentos order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdMedicamento = async function (id) {
    try {
        let sql = `select * from tbl_medicamentos where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteMedicamento = async function (id) {
    try {
        let sql = `delete from tbl_medicamentos where id = ${id};`

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
    insertMedicamento,
    updateMedicamento,
    selectAllMedicamentos,
    selectByIdMedicamento,
    deleteMedicamento
}