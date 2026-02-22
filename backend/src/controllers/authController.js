const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body;

      // Verificar se usuário já existe
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criar usuário
      const usuario = new User({
        nome,
        email,
        senha
      });

      await usuario.save();

      // Gerar token
      const token = jwt.sign(
        { id: usuario._id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Buscar usuário
      const usuario = await User.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Verificar senha
      const senhaValida = await usuario.compareSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
      }

      // Gerar token
      const token = jwt.sign(
        { id: usuario._id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async me(req, res) {
    try {
      res.json(req.usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
    }
  }
}

module.exports = new AuthController();
