const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['cliente', 'admin'],
    default: 'cliente'
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  },
  compras: [{
    softwareId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Software'
    },
    dataCompra: {
      type: Date,
      default: Date.now
    },
    chaveLicenca: String,
    valor: Number,
    status: {
      type: String,
      enum: ['pendente', 'aprovado', 'cancelado'],
      default: 'aprovado'
    }
  }]
});

// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
UserSchema.methods.compareSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', UserSchema);
