/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 25/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const router = express.Router()

const receitaMedicaController = require('../controllers/receita_medica/controller_receita_medica.js')
const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

//                          ENDPOINTS RECEITA MEDICA
router.get('/usuario/:idUsuario', verificarToken.verificarToken, authorization.verficarPermissao('VISUALIZAR_MEDICAMENTOS'), authorization.verificarRelacao(), async function (request, response) {
        let idUsuario = request.params.idUsuario

        let result = await receitaMedicaController.listarReceitaMedica(idUsuario)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router