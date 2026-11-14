/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 16/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerTipoDosagem = require('../controllers/tipo_dosagem/controller_tipo_dosagem.js')
const verificarToken = require('../middleware/auth.js')

//                          ENDPOINTS TIPO DE DOSAGEM
router.get('/', verificarToken.verificarToken, async function (request, response) {
    let result = await controllerTipoDosagem.listarTipoDosagem()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router