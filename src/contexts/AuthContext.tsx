import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import logo from '../assets/logologin.png'; 
import { motion } from 'framer-motion';
import userData from '../data/users.json';

type User = {
  id: string;
  name: string;
  email: string;
  cpf: string;

  academicInfo?: {
    institution: string;
    campus: string;
    department: string;
    role: string;
  };
};

// Define o tipo do contexto de autenticação
type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, cpf: string, password: string) => Promise<void>;
  forgotPassword: (email: string, cpf: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;
};

// Contexto de autenticação
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há usuário logado ao carregar a aplicação
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const foundUser = userData.users.find(
        u => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      const generatedToken = 'mock-jwt-token'; 
      localStorage.setItem('token', generatedToken);
      localStorage.setItem('user', JSON.stringify(foundUser));

      axios.defaults.headers.common['Authorization'] = `Bearer ${generatedToken}`;

      
const mockResponse = {
  data: {
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      cpf: foundUser.cpf,
    },
    token: token,
  },
};

const { user: userDataResponse, token: responseToken } = mockResponse.data;

setUser(userDataResponse);
setToken(responseToken);

localStorage.setItem('token', responseToken);
localStorage.setItem('user', JSON.stringify(userDataResponse));

axios.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;


      // Simula carregamento de 5 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, cpf: string, password: string) => {
    try {
      setIsLoading(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string, cpf: string) => {
    try {
      setIsLoading(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Mostra a logo com barra carregando
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <img src={logo} alt="Logo" className="h-48 mx-auto mb-6" />
          <div className="mx-auto w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: '#0F767D' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;