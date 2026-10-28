

const usuarioDAO = require("../models/DAO/usuarios/usuario.js")
const auth = require("./auth.js")

async function autenticarLogin(request, response, next) {
    const {email, senha} = request.body 

    const buscaUsuario = await usuarioDAO.selectUsuarioByEmail(email)

    if(!buscaUsuario || buscaUsuario.length === 0)
        return response
        .status(401)
            .json(
                {message: "EMAIL OU SENHA INVÁLIDOS"}
            )

    if(!senha || senha !== buscaUsuario.senha)
       return response
        .status(401)
            .json(
                {message: "EMAIL OU SENHA INVÁLIDOS"}
            ) 

    next()    
}