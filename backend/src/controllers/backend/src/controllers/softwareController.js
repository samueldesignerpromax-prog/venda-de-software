const Software = require('../models/Software');

class SoftwareController {
  async listar(req, res) {
    try {
      const { page = 1, limit = 10, categoria, destaque, busca } = req.query;
      
      let query = {};
      
      if (categoria) query.categoria = categoria;
      if (destaque) query.destaque = destaque === 'true';
      if (busca) {
        query.$or = [
          { nome: { $regex: busca, $options: 'i' } },
          { descricao: { $regex: busca, $options: 'i' } }
        ];
      }

      const softwares = await Software.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ dataCriacao: -1 });

      const total = await Software.countDocuments(query);

      res.json({
        softwares,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar softwares' });
    }
  }

  async detalhar(req, res) {
    try {
      const software = await Software.findById(req.params.id);
      
      if (!software) {
        return res.status(404).json({ error: 'Software não encontrado' });
      }

      res.json(software);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar software' });
    }
  }

  async criar(req, res) {
    try {
      const software = new Software({
        ...req.body,
        arquivo: req.file ? req.file.path : null
      });

      await software.save();
      res.status(201).json(software);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar software' });
    }
  }

  async atualizar(req, res) {
    try {
      const software = await Software.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!software) {
        return res.status(404).json({ error: 'Software não encontrado' });
      }

      res.json(software);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar software' });
    }
  }

  async deletar(req, res) {
    try {
      const software = await Software.findByIdAndDelete(req.params.id);
      
      if (!software) {
        return res.status(404).json({ error: 'Software não encontrado' });
      }

      res.json({ message: 'Software removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar software' });
    }
  }
}

module.exports = new SoftwareController();
