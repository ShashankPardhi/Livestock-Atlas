import React from 'react';
import IndiaMap from './Components/IndiaMap';  
import Footer from './Components/Footer';  

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <IndiaMap />  
      <Footer />    
    </div>
  );
};

export default App;
