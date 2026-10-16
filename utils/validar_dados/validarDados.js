/************************************************************************** 
    Objetivo: Arquivo responsável pela validação de dados padronizadas
    data: 15/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
***************************************************************************/

const idSchema = require('../../schemas/idSchema.js')

const validarDados = function (schema, dados, customMessages) {
    const { error } = schema.validate(dados, { abortEarly: false })

    if (error) {
        let errorMessages = []

        for (let detalhes of error.details) {
            errorMessages.push(detalhes.message)
        }

        customMessages.ERROR_BAD_REQUEST.field = errorMessages

        return customMessages.ERROR_BAD_REQUEST
    }

    return false
}

const validarIDs = function (id, customMessages) {
    const { error } = idSchema.validate(id, { abortEarly: false })

    if (error) {
        let errorMessages = []

        for (let detalhes of error.details)
            errorMessages.push(detalhes.message)

        customMessages.ERROR_BAD_REQUEST.field = errorMessages
    }

    return false
}

module.exports = {
    validarDados,
    validarIDs
}