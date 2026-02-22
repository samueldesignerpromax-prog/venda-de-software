#!/bin/bash

echo "🚀 Iniciando deploy da SoftStore..."

# Deploy do Backend
echo "📦 Fazendo deploy do backend..."
cd backend
vercel --prod

# Deploy do Frontend
echo "🎨 Fazendo deploy do frontend..."
cd ../frontend
vercel --prod

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Backend: https://seu-backend.vercel.app"
echo "🌐 Frontend: https://seu-frontend.vercel.app"
