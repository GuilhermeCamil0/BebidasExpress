import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './index.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [telaAtual, setTelaAtual] = useState("home"); // 'home' ou 'produtos'
  
  // ESTADOS DO CARRINHO E NOTIFICAÇÃO
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const [animarBadge, setAnimarBadge] = useState(false);

  // 1. CARREGAR PRODUTOS (Segurança: Baixa APENAS os ativos)
  async function carregarProdutos() {
    const { data, error } = await supabase
      .from('Produtos')
      .select('*')
      .eq('ativo', true); 
      
    if (!error) setProdutos(data); 
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 2. FUNÇÕES DO CARRINHO
  function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }

    setNotificacao(`${produto.nome} adicionado ao carrinho!`);
    setAnimarBadge(true);
    setTimeout(() => setAnimarBadge(false), 300);
    setTimeout(() => setNotificacao(null), 2500);
  }

  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter(item => item.id !== id));
  }

  function finalizarCompra() {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    
    let texto = "Olá, Bebidas Express! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;
    
    carrinho.forEach(item => {
      texto += `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
      total += (item.preco * item.quantidade);
    });
    
    texto += `\n*Total: R$ ${total.toFixed(2)}*`;
    
    const numeroWhatsApp = "5599999999999"; // <-- Coloque o seu número com DDD
    const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(link, '_blank');
  }

  // 3. FILTRAGEM DE PESQUISA
  const produtosFiltrados = produtos.filter((prod) =>
    prod.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <>
      <header className="top-header">
        <div className="logo"><i className="fas fa-wine-glass-alt"></i> Bebidas Express</div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
          <button>PESQUISA</button>
        </div>
        <div className="user-actions">
          <span>Minha Conta</span>
          <div className="cart-icon" onClick={() => setCarrinhoAberto(true)} style={{cursor: 'pointer'}}>
            <i className="fas fa-shopping-cart"></i>
            <span className={`badge ${animarBadge ? 'animar' : ''}`}>
              {carrinho.reduce((acc, item) => acc + item.quantidade, 0)}
            </span>
          </div>
        </div>
      </header>
      
      <nav className="main-nav">
        <ul>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setTelaAtual("home"); }} style={{ color: telaAtual === "home" ? "#e67e22" : "#cccccc" }}>HOME</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setTelaAtual("produtos"); }} style={{ color: telaAtual === "produtos" ? "#e67e22" : "#cccccc" }}>PRODUTOS</a></li>
        </ul>
      </nav>

      {telaAtual === "home" && (
        <section className="hero">
          <div className="hero-content">
            <h3>VIVA O NOVO</h3>
            <h1>O AGORA !</h1>
            <p>Entregas para o sítio Garrota e próximos!</p>
            <a href="#" className="btn-orange" onClick={(e) => { e.preventDefault(); setTelaAtual("produtos"); }}>CLIQUE E CONFIRA</a>
          </div>
        </section>
      )}

      <section id="produtos" className="produtos-section">
        <h2>{telaAtual === "home" ? "Nossos Destaques" : "Nosso Catálogo Completo"}</h2>
        <div className="grid-produtos">
          {produtos.length === 0 ? (
            <h3>Carregando produtos fresquinhos...</h3>
          ) : produtosFiltrados.length === 0 ? (
            <h3>Nenhuma bebida encontrada com esse nome :(</h3>
          ) : (
            produtosFiltrados.map((prod) => (
              <div className="cartao-produto" key={prod.id}>
                <img src={prod.imagem_url} alt={prod.nome} />
                <h4>{prod.nome}</h4>
                <p className="preco">R$ {prod.preco.toFixed(2)}</p>
                <button className="btn-comprar" onClick={() => adicionarAoCarrinho(prod)}>
                  Adicionar <i className="fas fa-cart-plus"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* NOTIFICAÇÃO ANIMADA (TOAST) */}
      {notificacao && (
        <div className="toast-notificacao">
          <i className="fas fa-check-circle" style={{ fontSize: '18px' }}></i>
          {notificacao}
        </div>
      )}

      {/* MODAL DO CARRINHO */}
      {carrinhoAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '350px', backgroundColor: '#fff', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', color: '#333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h2 style={{margin: 0, color: '#333'}}>Seu Carrinho</h2>
              <button onClick={() => setCarrinhoAberto(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#ff4444' }}>✖</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px' }}>
              {carrinho.length === 0 ? (
                <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>O carrinho está vazio.</p>
              ) : (
                carrinho.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#333' }}>{item.nome}</h4>
                      <small style={{color: '#666'}}>{item.quantidade}x de R$ {item.preco.toFixed(2)}</small>
                    </div>
                    <button onClick={() => removerDoCarrinho(item.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Remover</button>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop: '2px solid #eee', paddingTop: '20px', marginTop: 'auto' }}>
              <h3 style={{color: '#333'}}>Total: R$ {carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0).toFixed(2)}</h3>
              <button onClick={finalizarCompra} style={{ width: '100%', padding: '15px', fontSize: '16px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                <i className="fab fa-whatsapp"></i> Finalizar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;