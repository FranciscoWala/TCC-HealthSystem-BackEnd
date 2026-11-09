const usuarioDAO = require("../models/DAO/usuarios/usuario.js")
const authenticate = require("./authenticate.js")

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

        // Validação temporária de senha para testes
        if (senha !== usuario[0].senha)
            return response.status(401).json({
                message: "EMAIL OU SENHA INVÁLIDOS"
            })

        // Validação de senha temporariamente pendente
        // const validarSenha = await bcrypt.compare(senha, usuario[0].senha)

        // if (!validarSenha)
        //     return response.status(401).json({
        //         message: "EMAIL OU SENHA INVÁLIDOS"
        //     })

        let payload = {
            id: usuario[0].id,
            // role: usuario[0].role
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