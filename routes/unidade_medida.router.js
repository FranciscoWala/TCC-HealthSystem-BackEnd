/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 16/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerUnidadeMedida = require('../controllers/unidade_medida/controller_unidade_medida.js')
const verificarToken = require('../middleware/auth.js')

//                          ENDPOINTS UNIDADE DE MEDIDA
router.get('/', verificarToken.verificarToken, async function (request, response) {
    let result = await controllerUnidadeMedida.listarUnidadeMedida()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router