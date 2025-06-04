import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// Form com zod
const requestSchema = z.object({
  firstName: z.string().min(2, 'Primeiro nome é obrigatório'),
  lastName: z.string().min(2, 'Último nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  academicInstitution: z.string().min(2, 'Instituição acadêmica é obrigatória'),
  campus: z.string().optional(),
  specialty: z.string().min(2, 'Especialidade é obrigatória'),
  requestType: z.string().min(2, 'Tipo de solicitação é obrigatório'),
  reason: z.string().min(10, 'Motivo deve ter pelo menos 10 caracteres'),
});

type RequestFormData = z.infer<typeof requestSchema>;

// Estados de controle 
const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  // Preencher o formulário 
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Set form values
      setValue('firstName', firstName);
      setValue('lastName', lastName);
      setValue('email', user.email);
      setValue('academicInstitution', user.institution);
      setValue('campus', user.campus);
      setValue('specialty', user.department);
    }
  }, [user, setValue]);

  const onSubmit = async (data: RequestFormData) => {
    try {
      setIsSubmitting(true);

      await new Promise(resolve => setTimeout(resolve, 1500));

      // cria uma nova solicitação
      const newRequest = {
        id: Date.now(),
        requestType: data.requestType,
        specialty: data.specialty,
        reason: data.reason,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        //Adicionar info do usuário
        user: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          institution: data.academicInstitution,
          campus: data.campus
        }
      };

      // Store in localStorage
      const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      localStorage.setItem('requests', JSON.stringify([...existingRequests, newRequest]));

      setIsSuccess(true);

      setTimeout(() => {
        navigate('/requests', { state: { newRequestId: newRequest.id } });
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  //Renderiza a tela após concluida
  if (isSuccess) {
    return (
      <MainLayout title="Nova Solicitação">
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitação Enviada!</h2>
          <p className="text-gray-600 mb-6">
            Sua solicitação foi enviada com sucesso e está sendo processada.
            Você será redirecionado para a página de solicitações.
          </p>
          <div className="mx-auto w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: '#0F767D' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </motion.div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Nova Solicitação">
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Informações da Solicitação</h2>
          <p className="mt-1 text-sm text-gray-600">
            Preencha os dados abaixo para criar uma nova solicitação.
          </p>
        </div>
        
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input
                label="Primeiro Nome"
                id="firstName"
                name="firstName"
                placeholder="João"
                error={errors.firstName?.message}
                required
                disabled={!!user}
                className={user ? "bg-gray-100" : ""}
                {...register('firstName')}
              />
              
              <Input
                label="Último Nome"
                id="lastName"
                name="lastName"
                placeholder="Silva"
                error={errors.lastName?.message}
                required
                disabled={!!user}
                className={user ? "bg-gray-100" : ""}
                {...register('lastName')}
              />
              
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                error={errors.email?.message}
                required
                disabled={!!user}
                className={user ? "bg-gray-100" : ""}
                {...register('email')}
              />
              
              <Input
                label="Telefone"
                id="phone"
                name="phone"
                placeholder="(11) 98765-4321"
                error={errors.phone?.message}
                required
                {...register('phone')}
              />
              
              <Input
                label="Instituição Acadêmica"
                id="academicInstitution"
                name="academicInstitution"
                placeholder="Universidade Federal"
                error={errors.academicInstitution?.message}
                required
                disabled={!!user}
                className={user ? "bg-gray-100" : ""}
                {...register('academicInstitution')}
              />
              
              <Input
                label="Campus"
                id="campus"
                name="campus"
                placeholder="Unidade Sul (opcional)"
                error={errors.campus?.message}
                disabled={!!user}
                className={user ? "bg-gray-100" : ""}
                {...register('campus')}
              />
              
              <div className="sm:col-span-2">
                <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Solicitação <span className="text-red-500">*</span>
                </label>
                <select
                  id="requestType"
                  className={`w-full rounded-md border focus:outline-none focus:ring-2 transition-all ${
                    errors.requestType
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  {...register('requestType')}
                >
                  <option value="">Selecione o tipo de solicitação</option>
                  <option value="Confirmação de Presença na Residência">Confirmação de Presença na Residência</option>
                  <option value="Acompanhamento Cirúrgico">Acompanhamento Cirúrgico</option>
                  <option value="Participação em Treinamentos Práticos">Participação em Treinamentos Práticos</option>
                  <option value="Participação em Treinamentos Teóricos">Participação em Treinamentos Teóricos</option>
                  <option value="Solicitação de Liberação para Atividades Externas">Solicitação de Liberação para Atividades Externas</option>
                  <option value="Relatório de Atividades Realizadas">Relatório de Atividades Realizadas</option>
                  <option value="Declaração de Participação em Atividades">Declaração de Participação em Atividades</option>
                  <option value="Registro de Atividades de Plantão">Registro de Atividades de Plantão</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.requestType && (
                  <p className="mt-1 text-sm text-red-600">{errors.requestType.message}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade <span className="text-red-500">*</span>
                </label>
                <select
                  id="specialty"
                  className={`w-full rounded-md border focus:outline-none focus:ring-2 transition-all ${
                    errors.specialty
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  {...register('specialty')}
                >
                  <option value="">Selecione uma especialidade</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Psiquiatria">Psiquiatria</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.specialty && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Solicitação <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  className={`w-full rounded-md border focus:outline-none focus:ring-2 transition-all ${
                    errors.reason
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Descreva o motivo da sua solicitação..."
                  {...register('reason')}
                ></textarea>
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/requests')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                Solicitar
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default NewRequest;