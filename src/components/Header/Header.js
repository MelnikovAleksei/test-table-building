import React from 'react';

function Header() {

  const HEADER_TITLE_TEXT = 'Table building component';

  const HEADER_STYLE_CLASSES = {
    HEADER: 'header',
    TITLE: 'header__title',
  };

  return (
    <header
      className={HEADER_STYLE_CLASSES.HEADER}
    >
      <h1
        className={HEADER_STYLE_CLASSES.TITLE}
      >
        {HEADER_TITLE_TEXT}
      </h1>
    </header>
  )
}

export default Header;
