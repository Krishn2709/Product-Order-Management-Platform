import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link> | <Link to="/admin/products">Admin</Link> | <Link to="/orders">Orders</Link>
      </nav>
    </header>
  );
}

export default Header;
