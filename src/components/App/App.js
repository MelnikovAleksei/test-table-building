import React from 'react';
import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';

function App() {

  const APP_STYLE_CLASSES = {
    APP: 'app',
  };

  return (
    <div className={APP_STYLE_CLASSES.APP}>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
