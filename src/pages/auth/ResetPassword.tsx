import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logologin.png';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link Inválido</h2>
            <p className="text-gray-600 mb-4">
              O link de redefinição de senha é inválido ou expirou.
            </p>
            <Link
              to="/forgot-password"
              className="text-teal-700 hover:text-teal-600 font-medium"
            >
              Solicitar nova redefinição de senha
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null);
      setIsLoading(true);
      await resetPassword(token, data.password);
      navigate('/login', { 
        state: { message: 'Senha alterada com sucesso. Faça login com sua nova senha.' } 
      });
    } catch (err) {
      setError('Não foi possível redefinir sua senha. Por favor, tente novamente.');
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nova senha</h2>
            <p className="text-gray-600">
              Insira sua nova senha e confirme e tenha seu<br />
              acesso ao HC Comunica restaurado.
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
              label="Nova Senha"
              id="password"
              name="password"
              type="password"
              placeholder="******"
              error={errors.password?.message}
              required
              {...register('password')}
            />
            
            <Input
              label="Confirmar Nova Senha"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="******"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />
            
            <p className="text-xs text-gray-500 mt-2">
              A senha deve conter no mínimo seis caracteres, ter pelo menos uma letra maiúscula (A-Z),
              ter pelo menos uma letra minúscula (a-z), incluir pelo menos um número (0-9) e incluir
              pelo menos um caractere especial (!@#$%^&*).
            </p>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="bg-teal-700 hover:bg-teal-800"
            >
              Confirmar
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

export default ResetPassword;