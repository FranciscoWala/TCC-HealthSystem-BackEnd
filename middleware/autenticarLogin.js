const authenticate = require("./authenticate.js")
const usuarioDAO = require("../model/DAO/usuarios/usuario.js")
const bcrypt = require("bcrypt")

async function autenticarLogin(request, response) {

    try {
        const { email, senha } = request.body
        

        if (!email || !senha) {
            return response.status(400).json({ message: "É necessário fornecer e-mail e senha" })
        }


        const usuario = await usuarioDAO.selectUsuarioByEmail(email)


        if (!usuario || usuario.length === 0)
            return response
                .status(401)
                .json(
                    { message: "EMAIL OU SENHA INVÁLIDOS" }
                )

        //A linha 29 está presente apenas a caráter de testes.
        // A senha do usuário já virá criptografada do banco, antes criptografada no front e depois armazenada no banco
        const senhaCriptografada = await bcrypt.hash(usuario[0].senha, 10)
        const validarSenha = await bcrypt.compare(senha, senhaCriptografada)

        if (!validarSenha)
            return response
                .status(401)
                .json(
                    { message: "EMAIL OU SENHA INVÁLIDOS" }
                )



        let payload = {
            id: usuario[0].id,
            role: usuario[0].role
        }

        let jwt = await authenticate.createJWT(payload)
        usuario[0].jwt = jwt

        delete usuario[0].senha
        delete usuario[0].permissoes

        return usuario
    } catch (error) {
        console.log(error)
        return response.status(500).json({ message: "INTERNAL SERVER ERROR" })
    }
}

module.exports = { autenticarLogin }