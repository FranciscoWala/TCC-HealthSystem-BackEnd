const authenticate = require("./authenticate.js")
const usuarioDAO = require("../model/DAO/usuarios/usuario.js")
const bcrypt = require("bcrypt")

async function autenticarLogin(request, response, next) {

   const {email, senha} = request.body

    const usuario = await usuarioDAO.selectUsuarioByEmail(email)

    //A linha 13 está presente apenas a caráter de testes.
    // A senha do usuário já virá criptografada do banco, antes criptografada no front e depois armazenada no banco
    const senhaCriptografada = await bcrypt.hash(usuario[0].senha, 10) 
    

    const validarSenha = await bcrypt.compare(senha, senhaCriptografada)
    

    if(!usuario || usuario.lenght === 0)
        return response
        .status(401)
            .json(
                {message: "EMAIL OU SENHA INVÁLIDOS"}
            )

    if(!validarSenha)
       return response
        .status(401)
            .json(
                {message: "EMAIL OU SENHA INVÁLIDOS"}
            ) 

    let jwt = await authenticate.createJWT(usuario[0].id)
    usuario[0].jwt = jwt

    return usuario
}

module.exports = {autenticarLogin}