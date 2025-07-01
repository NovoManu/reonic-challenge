import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <header className="w-full py-4 bg-teal-700 text-white text-center text-2xl font-bold shadow-lg">
        EV Charging Simulation
      </header>
      <main className="flex-1 w-full max-w-4xl p-6">
        {children}
      </main>
      <footer className="w-full py-2 bg-teal-700 text-white text-center text-sm mt-4">
        © {new Date().getFullYear()} EV Charging Simulation
      </footer>
    </div>
  );
};

export default Layout;
