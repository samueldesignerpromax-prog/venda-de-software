// Gerenciamento de autenticação
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateNavAuth();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

function checkAuth() {
    const token = localStorage.getItem('token');
    const publicPages = ['/', '/index.html', '/login.html', '/cadastro.html'];
    const currentPage = window.location.pathname;
    
    // Verificar se é página pública
    const isPublicPage = publicPages.some(page => 
        currentPage.endsWith(page) || currentPage === '/'
    );
    
    // Se está em página protegida e não tem token, redirecionar
    if (!isPublicPage && !token) {
        window.location.href = '/login.html';
        return false;
    }
    
    return true;
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        const data = await API.login(email, senha);
        showMessage('success', 'Login realizado com sucesso!');
        
        // Redirecionar baseado no tipo de usuário
        if (data.usuario.tipo === 'admin') {
            window.location.href = '/admin.html';
        } else {
            window.location.href = '/dashboard.html';
        }
    } catch (error) {
        showMessage('error', error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmSenha = document.getElementById('confirmSenha').value;
    
    if (senha !== confirmSenha) {
        showMessage('error', 'As senhas não coincidem');
        return;
    }
    
    if (senha.length < 6) {
        showMessage('error', 'A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    try {
        await API.register(nome, email, senha);
        showMessage('success', 'Cadastro realizado com sucesso!');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 2000);
    } catch (error) {
        showMessage('error', error.message);
    }
}

function handleLogout() {
    API.removeToken();
    window.location.href = '/';
}

function updateNavAuth() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;
    
    const token = localStorage.getItem('token');
    
    if (token) {
        // Usuário logado
        API.getMe()
            .then(user => {
                navAuth.innerHTML = `
                    <span class="user-name">Olá, ${user.nome.split(' ')[0]}</span>
                    <a href="/dashboard.html" class="btn-register">Minha Conta</a>
                `;
            })
            .catch(() => {
                // Token inválido
                localStorage.removeItem('token');
                navAuth.innerHTML = `
                    <a href="/login.html" class="btn-login">Entrar</a>
                    <a href="/cadastro.html" class="btn-register">Cadastrar</a>
                `;
            });
    } else {
        // Usuário não logado
        navAuth.innerHTML = `
            <a href="/login.html" class="btn-login">Entrar</a>
            <a href="/cadastro.html" class="btn-register">Cadastrar</a>
        `;
    }
}

function showMessage(type, text) {
    // Criar elemento de mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;
    
    // Adicionar ao body
    document.body.appendChild(messageDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
