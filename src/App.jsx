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
  
  const [carregando, setCarregando] = useState(true);
  const [destaqueAtivo, setDestaqueAtivo] = useState(0);

  const navigate = useNavigate();

  async function carregarProdutos() {
    setCarregando(true); 
    const { data, error } = await supabase.from('Produtos').select('*').eq('ativo', true);
    if (!error) setProdutos(data); 
    setCarregando(false); 
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

  function obterImagemSegura(urlTexto, largura, altura) {
    // Agora verifica se o link é válido, impedindo imagens quebradas de aparecerem
    if (urlTexto && urlTexto.startsWith('http')) {
      // Ignorar links de páginas web do ImgBB e forçar o aviso de "Sem Foto" para não quebrar o layout
      if (urlTexto.includes('ibb.co') && !urlTexto.includes('i.ibb.co')) {
        console.warn("Atenção: O link colocado é de uma página e não de uma imagem direta.");
      } else {
        return urlTexto;
      }
    }
    return `https://dummyimage.com/${largura}x${altura}/151515/D97736.png&text=Sem+Foto`;
  }

  return (
    <>
      <Navbar 
        setCategoriaAtiva={setCategoriaAtiva}
        setCarrinhoAberto={setCarrinhoAberto}
        quantidadeCarrinho={quantidadeCarrinho}
      />
      
      <Routes>
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

            <div className="floating-container">
              <h3 className="floating-title">Categorias</h3>
              <div className="floating-categories">
                <div className="category-item" onClick={() => filtrarPorCategoria("Cervejas")}>Cervejas</div>
                <div className="category-item" onClick={() => filtrarPorCategoria("Vinhos")}>Vinhos</div>
                <div className="category-item" onClick={() => filtrarPorCategoria("Destilados")}>Destilados</div>
                <div className="category-item" onClick={() => filtrarPorCategoria("Sem Álcool")}>Sem Álcool</div>
                <div className="category-item all-categories" onClick={() => { setCategoriaAtiva("Todas"); navigate('/catalogo'); }}>Ver Todas →</div>
              </div>
            </div>

            <h2 className="section-title">Nossos Destaques</h2>
            
            {carregando ? (
              <section className="grid-modern">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="skeleton-card">
                    <div className="skeleton-img"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                ))}
              </section>
            ) : produtos.length > 0 ? (
              <section className="showcase-premium">
                <div className="showcase-main">
                  
                  <div className="showcase-text">
                    <h3 className="showcase-nome">{produtos[destaqueAtivo]?.nome}</h3>
                    <p className="showcase-categoria">{produtos[destaqueAtivo]?.categoria}</p>
                    <p className="showcase-preco">R$ {produtos[destaqueAtivo]?.preco.toFixed(2)}</p>
                    <button 
                      className="showcase-btn-discreto"
                      onClick={() => adicionarAoCarrinho(produtos[destaqueAtivo])}
                    >
                      + Adicionar ao Carrinho
                    </button>
                  </div>
                  
                  <div className="showcase-imagem-container">
                    <img 
                      key={produtos[destaqueAtivo]?.id} 
                      /* AQUI: Trocamos .imagem por .imagem_url */
                      src={obterImagemSegura(produtos[destaqueAtivo]?.imagem_url, 300, 450)} 
                      alt={produtos[destaqueAtivo]?.nome} 
                      className="showcase-img-grande"
                    />
                  </div>
                  
                </div>

                <div className="showcase-seletor">
                  {produtos.slice(0, 4).map((prod, index) => (
                    <div 
                      key={prod.id} 
                      className={`seletor-item ${index === destaqueAtivo ? 'ativo' : ''}`}
                      onClick={() => setDestaqueAtivo(index)}
                    >
                      {/* AQUI: Trocamos .imagem por .imagem_url */}
                      <img src={obterImagemSegura(prod.imagem_url, 60, 120)} alt={prod.nome} />
                      <span>{prod.nome}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        } />

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
                   style={{ background: '#D97736', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}
                 >
                   Filtro ativo: {categoriaAtiva} ✕
                 </button>
               )}
            </div>

            <h2 className="section-title">
              {termoPesquisa ? "Resultados da Pesquisa" : (categoriaAtiva !== "Todas" ? `Categoria: ${categoriaAtiva}` : "Catálogo Completo")}
            </h2>
            
            <section className="grid-modern">
              {carregando ? (
                <>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="skeleton-card">
                      <div className="skeleton-img"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-btn"></div>
                    </div>
                  ))}
                </>
              ) : produtosFiltrados.length === 0 ? (
                <h3 style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>Nenhuma bebida encontrada...</h3>
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
        <div style={{ position: 'fixed', bottom: 30, right: 30, background: '#D97736', color: 'white', padding: '15px 25px', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 2000, fontWeight: 'bold' }}>
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