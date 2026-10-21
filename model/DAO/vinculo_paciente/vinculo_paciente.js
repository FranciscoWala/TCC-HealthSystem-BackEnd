/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do VINCULO DO PACIENTE no banco de dados
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

const insertVinculoPaciente = async function (vinculoPaciente) {
    try {
        let sql = `insert into tbl_vinculo_paciente (
            data_vinculo,
            id_paciente,
            id_cuidador
        ) values (
            '${vinculoPaciente.data_vinculo}',
            ${vinculoPaciente.id_paciente},
            ${vinculoPaciente.id_cuidador}
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

const updateVinculoPaciente = async function (vinculoPaciente) {
    try {
        let sql = `update tbl_vinculo_paciente set
                        data_vinculo = '${vinculoPaciente.data_vinculo}',
                        id_paciente = ${vinculoPaciente.id_paciente},
                        id_cuidador = ${vinculoPaciente.id_cuidador}
                    where id = ${vinculoPaciente.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllVinculosPacientes = async function () {
    try {
        let sql = `select * from tbl_vinculo_paciente order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdVinculoPaciente = async function (id) {
    try {
        let sql = `select * from tbl_vinculo_paciente where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteVinculoPaciente = async function (id) {
    try {
        let sql = `delete from tbl_vinculo_paciente where id = ${id};`

        let result = knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectVinculoPacienteByIDPacienteAndIDCuidador = async function (idPaciente, idCuidador) {
    try {
        let sql = `select * from tbl_vinculo_paciente where id_paciente=${idPaciente} and id_cuidador=${idCuidador};`

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

module.exports = {
    insertVinculoPaciente,
    updateVinculoPaciente,
    selectAllVinculosPacientes,
    selectByIdVinculoPaciente,
    deleteVinculoPaciente,

    selectVinculoPacienteByIDPacienteAndIDCuidador
}