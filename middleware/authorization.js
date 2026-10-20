const rolePermissoesDAO = require('../model/DAO/role_permissoes/role_permissoes.js')

function verficarPermissao(permissao) {

    return async function (request, response, next) {

        try {
            const roleUsuario = request.user.role

            const possuiPermissao = await temPermissao(roleUsuario, permissao)

            if (!possuiPermissao) {
                return response.status(403).json(
                    {
                        message: "USUÁRIO NÃO POSSUI PERMISSÃO"
                    }
                )
            }

            return next()
        } catch (error) {
            console.log(error)
            response.status(500).json({ message: "Erro interno no servidor" })
        }
    }
}






async function temPermissao(roleUsuario, permissao) {
    try {
        let permissoes = await buscarPermissoesByRole(roleUsuario)

        if (permissoes.includes(permissao))
            return true;
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}


async function buscarPermissoesByRole(usuarioRole) {
    let permissoes = await rolePermissoesDAO.selectPermissoesByRole(usuarioRole)

    if (
        permissoes
        && typeof permissoes.permissoes === "string"
    ) {
        permissoes = permissoes.permissoes
            .split(',')
            .map(permissao => permissao.trim());
    }

    return permissoes
}

// (async () => {
//     let resultado = await temPermissao("uso próprio", "gerenciar pessoas");
//     console.log("Tem permissão?", resultado);
// })();


module.exports = {
    verficarPermissao
}