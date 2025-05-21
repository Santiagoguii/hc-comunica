import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Users, 
  LogOut, 
  User, 
  Menu, 
  X
} from 'lucide-react';
import logo from '../../assets/logo.png';

type MainLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Verifica se a rota está ativa
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  //menu
  const menuItems = [
    { name: 'Homepage', path: '/', icon: <Home size={20} /> },
    { name: 'Solicitações', path: '/requests', icon: <FileText size={20} /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Grupos e Comunidades', path: '/whatsapp-groups', icon: <Users size={20} /> },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img src={logo} alt="HC Comunica" className="h-10 w-auto" />
        </Link>
      </div>
      <div className="hidden md:flex flex-1 justify-center space-x-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            {item.icon}
            <span className="ml-1">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-700 hover:text-blue-500 focus:outline-none"
        >
          <User size={20} className="mr-1" />
          <span className="text-sm font-medium">{user?.name || 'Usuário'}</span>
          <LogOut size={16} className="ml-2" />
        </button>
      </div>

      <div className="flex md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-700 hover:text-blue-500 focus:outline-none"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  </div>
</header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={`mobile-${item.path}`}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500"
            >
              <LogOut size={20} className="mr-2" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HC Comunica. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  
  );
};

export default MainLayout;