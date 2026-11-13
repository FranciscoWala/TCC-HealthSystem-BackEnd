const usuarioDAO = require("../models/DAO/usuarios/usuario.js")
const authenticate = require("./authenticate.js")
const usuarioService = require('../services/usuarios/service_usuario.js')

const bcrypt = require('bcrypt')

async function autenticarLogin(request, response) {
    try {
        const { email, senha } = request.body

        if (!email || !senha)
            return response.status(400).json({
                message: "É necessário fornecer e-mail e senha"
            })

        const usuario = await usuarioDAO.selectUsuarioByEmail({ email })

        if (!usuario || usuario.length === 0)
            return response.status(401).json({
                message: "EMAIL OU SENHA INVÁLIDOS"
            })

        let validarSenha = await bcrypt.compare(senha, usuario[0].senha)

        if (!validarSenha)
            return response.status(401).json({
                message: "EMAIL OU SENHA INVÁLIDOS"
            })

        if (usuario[0].ativo != 1)
            return response.status(403).json({
                message: "USUÁRIO INATIVO"
            })

        let buscarRoles = await usuarioService.buscarRolesAtivasUsuarioService(usuario[0].id)

        if (!buscarRoles.status)
            return response.status(buscarRoles.status_code).json(buscarRoles)

        let roles = buscarRoles.response.roles

        if (roles.length != 1)
            return response.status(403).json({
                message: "USUÁRIO DEVE POSSUIR APENAS UMA ROLE ATIVA"
            })

        let payload = {
            id: usuario[0].id,
            role: roles[0].id_role
        }

        let jwt = await authenticate.createJWT(payload)

        usuario[0].jwt = jwt

        delete usuario[0].senha
        delete usuario[0].permissoes

        return response.status(200).json(usuario[0])

    } catch (error) {
        console.log(error)
        return response.status(500).json({
            message: "INTERNAL SERVER ERROR"
        })
    }
}

module.exports = { autenticarLogin }