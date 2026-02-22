// Página principal
let currentPage = 1;
let currentCategory = '';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    loadSoftwares();
    setupEventListeners();
});

function setupEventListeners() {
    // Busca
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentSearch = searchInput.value;
            currentPage = 1;
            loadSoftwares();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = searchInput.value;
                currentPage = 1;
                loadSoftwares();
            }
        });
    }
    
    // Categorias
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoria = card.dataset.cat;
            currentCategory = currentCategory === categoria ? '' : categoria;
            currentPage = 1;
            
            // Atualizar visual
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.toggle('active', c.dataset.cat === currentCategory);
            });
            
            loadSoftwares();
        });
    });
}

async function loadSoftwares() {
    try {
        const data = await API.getSoftwares(currentPage, currentCategory, currentSearch);
        renderSoftwares(data.softwares);
        renderPagination(data.totalPages, data.currentPage);
    } catch (error) {
        console.error('Erro ao carregar softwares:', error);
        showMessage('error', 'Erro ao carregar softwares');
    }
}

function renderSoftwares(softwares) {
    const grid = document.getElementById('softwareGrid');
    if (!grid) return;
    
    if (softwares.length === 0) {
        grid.innerHTML = '<p class="no-results">Nenhum software encontrado</p>';
        return;
    }
    
    grid.innerHTML = softwares.map(software => `
        <div class="software-card">
            <div class="software-image">
                <i class="fas fa-code"></i>
            </div>
            <div class="software-info">
                <h3>${software.nome}</h3>
                <div class="software-category">${software.categoria}</div>
                <p class="software-description">${software.descricao.substring(0, 100)}...</p>
                <div class="software-price">R$ ${software.preco.toFixed(2)}</div>
                <button class="btn-buy" onclick="comprarSoftware('${software._id}')">
                    Comprar
                </button>
            </div>
        </div>
    `).join('');
}

function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Botão anterior
    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="changePage(${currentPage - 1})">Anterior</button>`;
    }
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
                           onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span class="page-dots">...</span>`;
        }
    }
    
    // Botão próximo
    if (currentPage < totalPages) {
        html += `<button class="page-btn" onclick="changePage(${currentPage + 1})">Próximo</button>`;
    }
    
    pagination.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadSoftwares();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function comprarSoftware(softwareId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        if (confirm('Você precisa estar logado para comprar. Deseja fazer login?')) {
            window.location.href = '/login.html';
        }
        return;
    }
    
    try {
        await API.comprarSoftware(softwareId);
        showMessage('success', 'Compra realizada com sucesso! Verifique seu dashboard.');
    } catch (error) {
        showMessage('error', error.message);
    }
}
