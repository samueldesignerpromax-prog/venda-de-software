module.exports = (req, res, next) => {
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Área restrita para administradores.' });
  }
  next();
};
