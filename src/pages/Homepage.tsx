import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ArrowLeft } from 'lucide-react';
import { Dialog } from '@headlessui/react';

// Mock data for announcements
const mockAnnouncements = [
  {
    id: 1,
    title: 'Aviso Geral ao Público',
    subtitle: 'Comunicado Importante',
    date: '2025-04-20',
    author: 'João Barbosa',
    description: 'Informamos que, devido à realização de manutenção preventiva em nossos sistemas, o agendamento de consultas estará indisponível entre os dias 3 e 5 de maio.',
    fullDescription: `Informamos aos docentes e residentes que, entre os dias 3 e 5 de maio de 2025, o sistema de agendamento eletrônico de consultas, exames e procedimentos estará temporariamente indisponível devido à realização de manutenção preventiva e atualização dos nossos sistemas internos.

Essa medida é necessária para garantir melhorias na segurança, estabilidade e desempenho das plataformas digitais utilizadas pelo Hospital das Clínicas. Durante esse período, não será possível realizar novos agendamentos, alterações ou cancelamentos por meio dos canais online e presenciais.

Reforçamos que:
• Os atendimentos previamente agendados não serão afetados e ocorrerão normalmente.
• Os atendimentos de urgência e emergência seguem funcionando 24 horas, sem qualquer alteração.

Pedimos a compreensão de todos durante este período de melhorias.`,
    type: 'warning'
  },
  {
    id: 2,
    title: 'Aviso sobre Resultados de Exames',
    subtitle: 'Atenção Setor de Laboratório',
    date: '2025-04-15',
    author: 'Maria Clara',
    description: 'Devido à alta demanda, os resultados de exames realizados entre 15 e 18 de abril poderão sofrer atraso na liberação.',
    fullDescription: `Comunicamos aos docentes e residentes que, devido ao alto volume de exames realizados no período de 15 a 18 de abril, poderá haver um atraso na liberação dos resultados laboratoriais.

Nossa equipe está trabalhando com prioridade para normalizar os prazos de entrega. Casos urgentes continuam tendo prioridade de processamento e liberação.

Medidas em andamento:
• Reforço da equipe técnica no setor
• Extensão do horário de processamento de amostras
• Priorização conforme criticidade dos casos

Solicitamos que casos que necessitem de urgência na liberação sejam sinalizados diretamente à coordenação do laboratório.`,
    type: 'info'
  },
  {
    id: 3,
    title: 'Atualização do Sistema',
    subtitle: 'Melhorias e Novos Recursos',
    date: '2025-03-29',
    author: 'Ana Beatriz',
    description: 'Informamos que o sistema passará por atualizações importantes no próximo final de semana.',
    fullDescription: `Prezados docentes e residentes,

Informamos que no próximo final de semana realizaremos uma importante atualização em nossos sistemas, que trará melhorias significativas para nossos processos internos.

Principais atualizações:
• Nova interface para registro de evolução clínica
• Integração aprimorada com o sistema de imagens
• Novos relatórios estatísticos para pesquisa
• Melhorias na performance geral do sistema

A atualização está programada para iniciar no sábado às 22h e tem previsão de término no domingo às 6h.

Durante este período, o sistema ficará indisponível. Recomendamos que todos os registros pendentes sejam finalizados antes do início da manutenção.`,
    type: 'update'
  }
];

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);
  
  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && announcement.type === selectedFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return '📋';
      case 'update':
        return '🔄';
      default:
        return '📢';
    }
  };

  const selectedAnnouncementData = mockAnnouncements.find(a => a.id === selectedAnnouncement);
  
  return (
    <MainLayout title="Mural de Avisos">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar avisos..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-200"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="warning">Avisos importantes</option>
                <option value="info">Informações</option>
                <option value="update">Atualizações</option>
              </select>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filtrar</span>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data inicial
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data final
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-200"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 text-sm">
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Announcements List */}
          <div className="divide-y divide-gray-100">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getIconForType(announcement.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <span>{formatDate(announcement.date)}</span>
                      <span>•</span>
                      <span>{announcement.author}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {announcement.title}
                    </h3>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {announcement.subtitle}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {announcement.description}
                    </p>
                    <button 
                      onClick={() => setSelectedAnnouncement(announcement.id)}
                      className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                    >
                      Ver mais
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
  {selectedAnnouncement !== null && (
    <Dialog
      as="div"
      open={selectedAnnouncement !== null}
      onClose={() => setSelectedAnnouncement(null)}
      className="relative z-50"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30"
      />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {selectedAnnouncementData && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">
                    {getIconForType(selectedAnnouncementData.type)}
                  </div>
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      {selectedAnnouncementData.title}
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-600">
                      {selectedAnnouncementData.subtitle}
                    </Dialog.Description>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <span>{formatDate(selectedAnnouncementData.date)}</span>
                  <span>•</span>
                  <span>{selectedAnnouncementData.author}</span>
                </div>

                <div className="prose prose-sm max-w-none">
                  {selectedAnnouncementData.fullDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )}
    </AnimatePresence>
    </MainLayout>
  );
};

export default Dashboard;