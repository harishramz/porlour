import React from 'react';
import { Outlet } from 'react-router-dom';
import { DemoBar } from '../components/DemoBar';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-charcoal-900">
      <DemoBar />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
