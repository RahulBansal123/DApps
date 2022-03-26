import React, { useState } from 'react';
import Menu from '../../assets/menu.svg';
import Cross from '../../assets/cross.svg';

const Header = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="header">
      <h2 className="header__logo">
        <a href="/">Whippp</a>
      </h2>
      <div className="header__navbar">
        <a href="/" className="header__navitems header__navitems_active">
          Home
        </a>
      </div>
      <div className="navbar__mobile" onClick={() => setShow(true)}>
        <img src={Menu} alt="Menu" className="navbar__mobile_icons" />
      </div>
      <div
        className="navbar__mobile_items"
        style={{ display: show ? 'block' : 'none' }}
      >
        <div
          className="navbar__mobile_items_close"
          onClick={() => setShow(false)}
        >
          <img src={Cross} alt="Close" />
        </div>
        <div className="navbar__mobile_items_container">
          <a href="/" className="navbar__mobile_items_item">
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
