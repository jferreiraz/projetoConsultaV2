import React from 'react';
import { Building2 } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg mb-8">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Building2 className="h-8 w-8 text-white" />
                        <h1 className="text-3xl font-bold text-white">Empresas.io</h1>
                    </div>
                    <nav className="hidden sm:flex space-x-8">
                        <a href="#" className="text-white hover:text-blue-200 font-medium">Dashboard</a>
                        <a href="#" className="text-white hover:text-blue-200 font-medium">Empresas</a>
                        <a href="#" className="text-white hover:text-blue-200 font-medium">Relatórios</a>
                        <a href="#" className="text-white hover:text-blue-200 font-medium">Configurações</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;