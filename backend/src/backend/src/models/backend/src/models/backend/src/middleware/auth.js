const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const usuario = await User.findById(decoded.id).select('-senha');
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.usuario = usuario;
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
