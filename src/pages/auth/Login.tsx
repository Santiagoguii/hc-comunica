import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import logo from '../../assets/logosyneralg.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-2xl shadow-lg p-3 mb-3">
              <img src={logo} alt="HC Comunica" className="h-36 max-w-xs object-contain" />

            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">
              Bem-vindo de volta!<br />
              Estamos animados em ter você aqui novamente :)
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            
            <Input
              label="Senha"
              id="password"
              name="password"
              type="password"
              placeholder=""
              error={errors.password?.message}
              required
              {...register('password')}
            />
            
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-teal-700 hover:text-teal-600"
              >
                Esqueceu a senha?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="bg-teal-700 hover:bg-teal-800"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
      
      {/* Right side - Background image */}
      <div
    className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
    style={{
      backgroundImage:
        'url("https://cdn.folhape.com.br/img/pc/450/450/dn_arquivo/2017/01/hospital-das-clinicas-ufpe-arthur-mota.jpg?auto=compress&cs=tinysrgb&w=1920")',
    }}
  >
    {/* Degradê sobre a imagem */}
    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none z-0" />
  </div>
</div>
  );
};

export default Login;