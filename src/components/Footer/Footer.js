import React from 'react';
import uuid from 'react-uuid'

function Footer() {

  const FOOTER_TITLE_TEXT = 'Author: Aleksei Melnikov';

  const FOOTER_STYLE_SETTINGS = {
    FOOTER: 'footer',
    TITLE: 'footer__title',
    LIST: 'footer__list',
    LIST_ITEM: 'footer__list-item',
    LIST_LINK: 'footer__list-link',
  };

  const LINKS_DATA = [
    {
      TITLE: 'Github',
      HREF: 'https://github.com/MelnikovAleksei',
    },
    {
      TITLE: 'E-mail',
      HREF: 'mailto:meln.a.a@yandex.ru',
    },
  ];

  const footerLinksMarkup = LINKS_DATA.map(elem => (
    <li
      className={FOOTER_STYLE_SETTINGS.LIST_ITEM}
      key={uuid()}
    >
      <a
        className={FOOTER_STYLE_SETTINGS.LIST_LINK}
        href={elem.HREF}
        target=""
        rel="noreferrer"
      >
        {elem.TITLE}
      </a>
    </li>

  ))

  return (
    <footer
      className={FOOTER_STYLE_SETTINGS.FOOTER}
    >
      <h2
        className={FOOTER_STYLE_SETTINGS.TITLE}
      >
        {FOOTER_TITLE_TEXT}
      </h2>
      <ul
        className={FOOTER_STYLE_SETTINGS.LIST}
      >
        {footerLinksMarkup}
      </ul>
    </footer>
  )
}

export default Footer;
