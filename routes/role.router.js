/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 09/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerRole = require('../controllers/role/controller_role.js')

//                          ENDPOINTS ROLE
router.get('/', async function (request, response) {
    let result = await controllerRole.listarRole()

    response.status(result.status_code)
    response.json(result)
})

module.exports = router