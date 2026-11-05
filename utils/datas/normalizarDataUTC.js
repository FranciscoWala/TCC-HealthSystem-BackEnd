
/**************************************************************************
 * Objetivo: Arquivo responsável por normalizar datas UTC para o MySQL
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 30/10/2026
 * Versão: 1.0
***************************************************************************/

// Converter uma data ISO para o formato DATETIME do MySQL em UTC
const normalizarDataUTC = function (data) {
    try {
        if (typeof data !== 'string')
            return false

        // Exigir uma data ISO com fuso horário explícito
        let formatoISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i

        if (!formatoISO.test(data))
            return false

        let dataConvertida = new Date(data)

        if (isNaN(dataConvertida.getTime()))
            return false

        let dataFormatada = dataConvertida.toISOString()

        // Remover milissegundos e o indicador Z
        return dataFormatada.substring(0, 19).replace('T', ' ')

    } catch (error) {
        return false
    }
}

module.exports = normalizarDataUTC
