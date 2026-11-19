/*******************************************************************************************
 * Objetivo: Realizar a leitura de receitas médicas utilizando OCR
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 16/11/2026
 * Versão: 1.0
********************************************************************************************/

const axios = require('axios')
const FormData = require('form-data')

const extrairTextoReceitaService = async function (buffer, mimetype) {
    try {
        let textos = []

        for (let engine of [1, 2]) {
            try {
                let form = new FormData()

                form.append('base64Image', `data:${mimetype};base64,${buffer.toString('base64')}`)
                form.append('language', 'por')
                form.append('OCREngine', String(engine))
                form.append('isTable', 'true')
                form.append('scale', 'true')

                let response = await axios.post(
                    'https://api.ocr.space/parse/image',
                    form,
                    {
                        headers: {
                            'Content-Type': form.getHeaders()['content-type'],
                            'apikey': process.env.OCR_SPACE_API_KEY
                        },
                        timeout: 30000
                    }
                )

                if (response.data &&
                    response.data.IsErroredOnProcessing == false &&
                    Array.isArray(response.data.ParsedResults)) {

                    let texto = ''

                    for (let resultado of response.data.ParsedResults) {
                        if (resultado.ParsedText)
                            texto += resultado.ParsedText + '\n'
                    }

                    if (texto.trim()) {
                        textos.push({
                            engine: engine,
                            texto: texto.trim()
                        })
                    }
                }

            } catch (error) {
                console.log(`Erro no OCR Engine ${engine}:`, error.message)
            }
        }

        if (textos.length == 0)
            return false

        let textoFinal = ''

        for (let resultado of textos) {
            textoFinal += `LEITURA OCR ENGINE ${resultado.engine}:\n`
            textoFinal += resultado.texto + '\n\n'
        }

        return textoFinal.trim()

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    extrairTextoReceitaService
}