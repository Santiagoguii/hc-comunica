import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logosyneralg.png';


const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError(null);
      setSuccess(null);
      setIsLoading(true);
      await forgotPassword(data.email, data.cpf);
      setSuccess('Instruções para recuperação de senha foram enviadas para seu email.');
    } catch (err) {
      setError('Não foi possível recuperar a senha. Verifique seus dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-2xl shadow-lg p-3 mb-3">
              <img src={logo} alt="HC Comunica" className="h-36 max-w-xs object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar senha</h2>
            <p className="text-gray-600">
              Preencha seus dados a seguir que<br />
              enviaremos um email para recuperação da sua senha.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle size={18} className="mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
              <p className="text-sm">{success}</p>
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
              label="CPF"
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              error={errors.cpf?.message}
              required
              {...register('cpf')}
            />
            
            <p className="text-sm text-gray-500 mt-2">
              Lembre-se de preencher seus dados corretamente para conseguir recuperar seu acesso ao sistema.
            </p>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="bg-teal-700 hover:bg-teal-800"
            >
              Enviar
            </Button>
            
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-teal-700 hover:text-teal-600"
              >
                <ArrowLeft size={16} className="mr-1" />
                Voltar para o login
              </Link>
            </div>
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

export default ForgotPassword;