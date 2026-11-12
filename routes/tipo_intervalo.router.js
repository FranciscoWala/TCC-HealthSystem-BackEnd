/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 16/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerTipoIntervalo = require('../controllers/tipo_intervalo/controller_tipo_intervalo.js')
const verificarToken = require('../middleware/auth.js')

//                          ENDPOINTS TIPO DE INTERVALO
router.get('/', verificarToken.verificarToken, async function (request, response) {
    let result = await controllerTipoIntervalo.listarTipoIntervalo()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router