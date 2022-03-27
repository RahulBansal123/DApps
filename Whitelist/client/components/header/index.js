import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Menu from '../../assets/menu.svg';
import Cross from '../../assets/cross.svg';

const Header = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="header">
      <h2 className="header__logo">
        <Link href="/">
          <a>Whippp</a>
        </Link>
      </h2>
      <div className="header__navbar">
        <Link href="/" className="header__navitems header__navitems_active">
          <a className="header__navitems header__navitems_active">Home</a>
        </Link>
      </div>
      <div className="navbar__mobile" onClick={() => setShow(true)}>
        <Image src={Menu} alt="Menu" className="navbar__mobile_icons" />
      </div>
      <div
        className="navbar__mobile_items"
        style={{ display: show ? 'block' : 'none' }}
      >
        <div
          className="navbar__mobile_items_close"
          onClick={() => setShow(false)}
        >
          <Image src={Cross} alt="Close" />
        </div>
        <div className="navbar__mobile_items_container">
          <Link href="/" className="navbar__mobile_items_item">
            <a className="navbar__mobile_items_item">Home</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
