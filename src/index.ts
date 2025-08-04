interface UserGit {
    id: number
    login: string
    name: string | null
    bio: string | null
    public_repos: number
    repos_url: string
}

interface Repositorie {
    name: string
}

const users: UserGit[] = [];

async function getUser(name: string) {
    try {
        const response = await fetch(`https://api.github.com/users/${name}`);

        if(response.ok) {
            const newUser: UserGit = await response.json();
            users.push(newUser);
            alert("Requisição realizada com sucesso.");
        }
    } catch (e) {
        alert(`Falha na requisição: ${e}`);
    }
} 

async function showUser(login: string): Promise<string | null> {
    const user: UserGit | undefined = users.find(u => u.login.toUpperCase() === login.toUpperCase());

    if (!user) {
        return null;
    }

    let userString = `--- Informações do Usuário ---\nID: ${user.id}\nLogin: ${user.login}\nNome: ${user.name || 'Não informado'}\nBio: ${user.bio || 'Não possui bio.'}\nRepositórios Públicos: ${user.public_repos}`;

    if (user.public_repos > 0) {
        const response = await fetch(user.repos_url);
        if (response.ok) {
            const repositories: Repositorie[] = await response.json();
            const fiveRepositories: Repositorie[] = repositories.slice(0, 5);

            userString += "\n\n--- 5 Primeiros Repositórios ---\n";
            fiveRepositories.forEach((repo, index) => {
                userString += `${index + 1}: ${repo.name}\n`;
            });
        } else {
            userString += "\n\n(Não foi possível carregar a lista de repositórios.)";
        }
    } else {
         userString += "\n\n(O usuário não possui repositórios públicos.)";
    }

    return userString;
}

async function showUsers() {
    if (users.length === 0) {
        alert("Nenhum usuário salvo.");
        return;
    }
    let allUsersInfo = "--- Todos os Usuários Salvos ---\n\n";
    users.forEach(user => {
        allUsersInfo += `Login: ${user.login} | Nome: ${user.name || 'N/A'} | Repositórios: ${user.public_repos}\n`;
    });
    alert(allUsersInfo);    for (const user of users) {
        await showUser(user.login);
    }
}

function sumRepositories() {
    let sum = 0
    users.forEach(user => sum += user.public_repos);

    alert(`A soma de todos os repositórios é: ${sum}`);
}

function fiveUsersMostRepositories() {
    const sortedUsers = [...users].sort((userA, userB) => {
        return userB.public_repos - userA.public_repos;
    });

    return sortedUsers.slice(0, 5);
}

async function firstMenuOption() {
    const login = prompt("Digite o login do usuário: ");

    if(login) {
        await getUser(login);
    } else {
        alert("Voltando ao menu principal.")
    }
}

async function secondMenuOption() {
    const login = prompt("Digite o login do usuário para mostrar as informações: ");

    if (login) {
        const userInfo = await showUser(login);
        if (userInfo) {
            alert(userInfo);
        } else {
            alert(`Usuário '${login}' não encontrado na lista.`);
        }
    }
}

async function thirdMenuOption() {
    if(users.length > 0) {
        await showUsers();
    } else {
        alert("Nenhum usuário cadastrado.")
    }
}

function fourthMenuOption() {
    if(users.length > 0) {
        sumRepositories();
    } else {
        alert("Nenhum usuário cadastrado.")
    }
}

function fifthMenuOption() {
    const topUsers = fiveUsersMostRepositories();

    if (topUsers.length === 0) {
        alert("Nenhum usuário na lista para criar um ranking.");
        return;
    }

    let topUsersString = "--- Top 5 por Nº de Repositórios ---\n\n";
    topUsers.forEach((user, index) => {
        topUsersString += `${index + 1}. ${user.login} (${user.public_repos} repositórios)\n`;
    });
    alert(topUsersString);
}

async function showMenu() {
    let userOption = 0;
    while (userOption !== 6) {
        const menu = `--- Painel de Controle GitHub ---
1 - Salvar usuário
2 - Mostrar detalhes de um usuário
3 - Listar todos os usuários salvos
4 - Somar repositórios de todos os usuários
5 - Ver o Top 5 por nº de repositórios
6 - Sair`;

        const choice = prompt(menu);
        userOption = Number(choice);

        switch (userOption) {
            case 1:
                await firstMenuOption();
                break;
            case 2:
                await secondMenuOption();
                break;
            case 3:
                await thirdMenuOption();
                break;
            case 4:
                fourthMenuOption();
                break;
            case 5:
                fifthMenuOption();
                break;
            case 6:
                alert('Encerrando o sistema...');
                break;
            default:
                alert('Opção inválida! Tente novamente.');
                break;
        }
    }
}

showMenu();