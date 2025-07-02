import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header 
        className="w-full py-3 md:py-4 bg-teal-700 text-white text-center shadow-lg sticky top-0 z-10" 
        role="banner"
      >
        <h1 className="text-xl md:text-2xl font-bold">
          EV Charging Simulation
        </h1>
      </header>
      
      <main 
        className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 md:px-6 md:py-6" 
        role="main"
        id="main-content"
      >
        {children}
      </main>
      
      <footer 
        className="w-full py-2 md:py-3 bg-teal-700 text-white text-center text-xs md:text-sm mt-4"
        role="contentinfo"
      >
        <div className="max-w-5xl mx-auto px-4">
          <p>© {new Date().getFullYear()} EV Charging Simulation</p>
          <p className="text-xs text-teal-100 mt-1">Eco-friendly charging solutions</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
