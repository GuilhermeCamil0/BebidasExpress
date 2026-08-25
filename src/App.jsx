import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import ProdutoCard from './components/ProdutoCard';
import Carrinho from './components/Carrinho';
import Navbar from './components/Navbar';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [notificacao, setNotificacao] = useState(null);

  const navigate = useNavigate();

  async function carregarProdutos() {
    const { data, error } = await supabase.from('Produtos').select('*').eq('ativo', true);
    if (!error) setProdutos(data); 
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
    setNotificacao(`${produto.nome} adicionado!`);
    setTimeout(() => setNotificacao(null), 2500);
  }

  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter(item => item.id !== id));
  }

  function finalizarCompra() {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    let texto = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;
    carrinho.forEach(item => {
      texto += `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
      total += (item.preco * item.quantidade);
    });
    texto += `\n*Total: R$ ${total.toFixed(2)}*`;
    const numeroWhatsApp = "5599999999999"; 
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`, '_blank');
  }

  function filtrarPorCategoria(categoria) {
    setCategoriaAtiva(categoria);
    setTermoPesquisa(""); 
    navigate('/catalogo');
  }

  function irParaCatalogoPesquisa() {
    navigate('/catalogo');
  }

  const produtosFiltrados = produtos.filter((prod) => {
    const matchTexto = prod.nome.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchCategoria = categoriaAtiva === "Todas" || prod.categoria === categoriaAtiva;
    return matchTexto && matchCategoria;
  });

  const quantidadeCarrinho = carrinho.reduce((a, b) => a + b.quantidade, 0);

  return (
    <>
      <Navbar 
        setCategoriaAtiva={setCategoriaAtiva}
        setCarrinhoAberto={setCarrinhoAberto}
        quantidadeCarrinho={quantidadeCarrinho}
      />
      
      <Routes>
        {/* ROTA DA HOME */}
        <Route path="/" element={
          <>
            <section className="hero-modern">
              <h1>Descubra a Bebida Perfeita<br />Para o Seu Momento</h1>
              <div className="search-pill">
                <input 
                  type="text" 
                  placeholder="O que você deseja beber hoje? (ex: Cerveja, Vinho)" 
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                />
                <button onClick={irParaCatalogoPesquisa}>Pesquisar</button>
              </div>
            </section>

            <div className="floating-categories">
              <div className="category-item" onClick={() => filtrarPorCategoria("Cervejas")}><div className="category-icon">🍺</div> Cervejas</div>
              <div className="category-item" onClick={() => filtrarPorCategoria("Vinhos")}><div className="category-icon">🍷</div> Vinhos</div>
              <div className="category-item" onClick={() => filtrarPorCategoria("Destilados")}><div className="category-icon">🥃</div> Destilados</div>
              <div className="category-item" onClick={() => filtrarPorCategoria("Sem Álcool")}><div className="category-icon">🧊</div> Sem Álcool</div>
            </div>

            <h2 className="section-title">Nossos Destaques</h2>
            
            <section className="grid-modern">
              {produtos.slice(0, 4).map((prod) => (
                <ProdutoCard 
                  key={prod.id} 
                  produto={prod} 
                  adicionarAoCarrinho={adicionarAoCarrinho} 
                />
              ))}
            </section>
          </>
        } />

        {/* ROTA DO CATÁLOGO */}
        <Route path="/catalogo" element={
          <>
            <div style={{ maxWidth: '600px', margin: '40px auto 0', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px', textAlign: 'center' }}>
               <div className="search-pill" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #ddd', marginBottom: '15px' }}>
                 <input 
                   type="text" 
                   placeholder="Buscar no catálogo..." 
                   value={termoPesquisa}
                   onChange={(e) => { setTermoPesquisa(e.target.value); setCategoriaAtiva("Todas"); }}
                 />
               </div>
               {categoriaAtiva !== "Todas" && (
                 <button 
                   onClick={() => setCategoriaAtiva("Todas")}
                   style={{ background: '#6B1C2A', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}
                 >
                   Filtro ativo: {categoriaAtiva} ✕
                 </button>
               )}
            </div>

            <h2 className="section-title">
              {termoPesquisa ? "Resultados da Pesquisa" : (categoriaAtiva !== "Todas" ? `Categoria: ${categoriaAtiva}` : "Catálogo Completo")}
            </h2>
            
            <section className="grid-modern">
              {produtosFiltrados.length === 0 ? (
                <h3 style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>Nenhuma bebida encontrada...</h3>
              ) : (
                produtosFiltrados.map((prod) => (
                  <ProdutoCard 
                    key={prod.id} 
                    produto={prod} 
                    adicionarAoCarrinho={adicionarAoCarrinho} 
                  />
                ))
              )}
            </section>
          </>
        } />
      </Routes>

      {notificacao && (
        <div style={{ position: 'fixed', bottom: 30, right: 30, background: '#6B1C2A', color: 'white', padding: '15px 25px', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 2000, fontWeight: 'bold' }}>
          ✓ {notificacao}
        </div>
      )}

      {carrinhoAberto && (
        <Carrinho 
          carrinho={carrinho}
          setCarrinhoAberto={setCarrinhoAberto}
          removerDoCarrinho={removerDoCarrinho}
          finalizarCompra={finalizarCompra}
        />
      )}
    </>
  );
}

export default App;