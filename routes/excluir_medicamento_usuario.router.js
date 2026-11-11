/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 28/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerExcluirMedicamentoUsuario = require('../controllers/excluir_medicamento_usuario/controller_excluir_medicamento_usuario.js')

const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

//                          ENDPOINTS EXCLUIR MEDICAMENTO USUARIO
router.delete('/:idReceitaMedica/:idUsuario', verificarToken.verificarToken,
    authorization.verficarPermissao('EXCLUIR_MEDICAMENTOS'),
    authorization.verificarRelacao(),
    async function (request, response) {

        let idReceitaMedica = request.params.idReceitaMedica
        let idUsuario = request.idPacienteAutorizado

        let result = await controllerExcluirMedicamentoUsuario.excluirMedicamentoUsuario(idReceitaMedica, idUsuario)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router