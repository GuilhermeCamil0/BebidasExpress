import React from 'react';

// O componente recebe "props" (propriedades) que são enviadas pelo App principal
export default function ProdutoCard({ produto, adicionarAoCarrinho }) {
  return (
    <div className="card-modern">
      <img src={produto.imagem_url} alt={produto.nome} />
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