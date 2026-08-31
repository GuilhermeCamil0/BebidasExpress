import React from 'react';

export default function ProdutoCard({ produto, adicionarAoCarrinho }) {
  // Proteção: se não houver link válido no banco, usamos o "Sem Foto" elegante
  const linkValido = produto.imagem_url && produto.imagem_url.startsWith('http') && !produto.imagem_url.includes('ibb.co/大');
  const imagemSegura = linkValido 
    ? produto.imagem_url 
    : 'https://dummyimage.com/260x240/151515/D97736.png&text=Sem+Foto';

  return (
    <div className="card-modern">
      <img src={imagemSegura} alt={produto.nome} />
      <div className="card-info">
        <h4>{produto.nome}</h4>
        <div className="price">R$ {produto.preco.toFixed(2)}</div>
      </div>
      <button className="btn-add-modern" onClick={() => adicionarAoCarrinho(produto)}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
}