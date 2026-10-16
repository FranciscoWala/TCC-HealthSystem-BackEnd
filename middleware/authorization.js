const rolePermissoesDAO = require('../model/DAO/role_permissoes/role_permissoes.js')



async function temPermissao(roleUsuario, permissao) {
    try {
        let permissoes = await buscarPermissoesByRole(roleUsuario)

        if (permissoes.includes(permissao))
            return true;
        else
            return false

    } catch (error) {
        console.log(error)
        return error
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

(async () => {
    let resultado = await temPermissao("uso próprio", "gerenciar pessoas");
    console.log("Tem permissão?", resultado);
})();
