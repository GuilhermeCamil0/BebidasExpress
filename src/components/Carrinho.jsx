import React from 'react';

export default function Carrinho({ carrinho, setCarrinhoAberto, removerDoCarrinho, finalizarCompra }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '380px', backgroundColor: '#F9F8F3', height: '100%', padding: '30px', display: 'flex', flexDirection: 'column', color: '#1A1A1A', borderTopLeftRadius: '30px', borderBottomLeftRadius: '30px', boxSizing: 'border-box' }}>
        
        {/* CABEÇALHO DO CARRINHO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #EBEBEB', paddingBottom: '15px', flexShrink: 0 }}>
          <h2 style={{margin: 0}}>Seu Pedido</h2>
          <button onClick={() => setCarrinhoAberto(false)} style={{ background: '#eee', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
        
        {/* LISTA DE ITENS (Com rolagem interna caso seja grande) */}
        <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px', paddingRight: '5px' }}>
          {carrinho.length === 0 ? (
            <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>O carrinho está vazio.</p>
          ) : (
            carrinho.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.nome}</h4>
                  <small style={{color: '#666'}}>{item.quantidade}x de R$ {item.preco.toFixed(2)}</small>
                </div>
                <button onClick={() => removerDoCarrinho(item.id)} style={{ background: '#FF4747', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>Remover</button>
              </div>
            ))
          )}
        </div>

        {/* RODAPÉ FIXO (Total e Botão do WhatsApp sempre visíveis) */}
        <div style={{ borderTop: '2px solid #EBEBEB', paddingTop: '20px', marginTop: 'auto', flexShrink: 0, backgroundColor: '#F9F8F3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total:</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#6B1C2A' }}>
              R$ {carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2)}
            </span>
          </div>
          <button onClick={finalizarCompra} style={{ width: '100%', padding: '16px', fontSize: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)' }}>
            Finalizar no WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}