const mongoose = require('mongoose');

const SoftwareSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Antivírus', 'Editor', 'Utilitário', 'Jogo', 'Desenvolvimento', 'Outro']
  },
  versao: {
    type: String,
    required: true
  },
  requisitos: {
    type: String,
    required: true
  },
  imagens: [String],
  arquivo: {
    type: String,
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  destaque: {
    type: Boolean,
    default: false
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  avaliacoes: [{
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nota: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario: String,
    data: {
      type: Date,
      default: Date.now
    }
  }]
});

// Virtual para média de avaliações
SoftwareSchema.virtual('mediaAvaliacoes').get(function() {
  if (this.avaliacoes.length === 0) return 0;
  const soma = this.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
  return (soma / this.avaliacoes.length).toFixed(1);
});

module.exports = mongoose.model('Software', SoftwareSchema);
