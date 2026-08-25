import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ setCategoriaAtiva, setCarrinhoAberto, quantidadeCarrinho }) {
  return (
    <header className="navbar" style={{ 
      position: 'relative', 
      backgroundColor: '#6B1C2A'
    }}>
      
      <div className="logo-premium">
        <div className="logo-icon">
          <i className="fas fa-wine-glass-alt"></i>
        </div>
        <div className="logo-text">
          <span className="logo-title">BEBIDAS</span>
          <span className="logo-subtitle">EXPRESS</span>
        </div>
      </div>

      <nav className="nav-links">
        <Link 
          to="/" 
          onClick={() => setCategoriaAtiva("Todas")}
          style={{ color: '#FFF', textDecoration: 'none', fontWeight: '600' }}
        >
          Início
        </Link>
        <Link 
          to="/catalogo" 
          onClick={() => setCategoriaAtiva("Todas")}
          style={{ color: '#FFF', textDecoration: 'none', fontWeight: '600' }}
        >
          Catálogo
        </Link>
      </nav>

      <div className="cart-btn" onClick={() => setCarrinhoAberto(true)}>
        <i className="fas fa-shopping-cart"></i> Carrinho 
        {quantidadeCarrinho > 0 && <span className="cart-badge">{quantidadeCarrinho}</span>}
      </div>
    </header>
  );
}