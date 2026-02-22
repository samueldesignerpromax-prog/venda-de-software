const API = {
    baseURL: process.env.NODE_ENV === 'production' 
        ? 'https://seu-backend.vercel.app/api'
        : 'http://localhost:5000/api',
    
    token: localStorage.getItem('token'),

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    },

    removeToken() {
        this.token = null;
        localStorage.removeItem('token');
    },

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    async login(email, senha) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    },

    async register(nome, email, senha) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ nome, email, senha })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    },

    async getMe() {
        return this.request('/auth/me');
    },

    // Softwares
    async getSoftwares(page = 1, categoria = '', busca = '') {
        const params = new URLSearchParams({
            page,
            limit: 9,
            ...(categoria && { categoria }),
            ...(busca && { busca })
        });
        
        return this.request(`/softwares?${params}`);
    },

    async getSoftware(id) {
        return this.request(`/softwares/${id}`);
    },

    // Compras (requer autenticação)
    async comprarSoftware(softwareId) {
        return this.request('/compras', {
            method: 'POST',
            body: JSON.stringify({ softwareId })
        });
    },

    async getMinhasCompras() {
        return this.request('/compras/usuario');
    },

    async downloadSoftware(compraId) {
        return this.request(`/compras/${compraId}/download`);
    }
};
