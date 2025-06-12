import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, X, ArrowLeft } from 'lucide-react';
import { Dialog } from '@headlessui/react';

const mockAnnouncements = [
  {
    id: 1,
    title: 'Aviso Geral ao Público',
    subtitle: 'Comunicado Importante',
    date: '2025-04-20',
    author: 'João Barbosa',
    description: 'Informamos que, devido à realização de manutenção preventiva em nossos sistemas, o agendamento de consultas estará indisponível entre os dias 3 e 5 de maio.',
    fullDescription: `Informamos aos docentes e residentes que, entre os dias 3 e 5 de maio de 2025, o sistema de agendamento eletrônico de consultas, exames e procedimentos estará temporariamente indisponível devido à realização de manutenção preventiva e atualização dos nossos sistemas internos.\n\nEssa medida é necessária para garantir melhorias na segurança, estabilidade e desempenho das plataformas digitais utilizadas pelo Hospital das Clínicas...`,
    type: 'warning'
  },
  {
    id: 2,
    title: 'Aviso sobre Resultados de Exames',
    subtitle: 'Atenção Setor de Laboratório',
    date: '2025-04-15',
    author: 'Maria Clara',
    description: 'Devido à alta demanda, os resultados de exames realizados entre 15 e 18 de abril poderão sofrer atraso na liberação.',
    fullDescription: `Comunicamos aos docentes e residentes que, devido ao alto volume de exames realizados no período de 15 a 18 de abril, poderá haver um atraso na liberação dos resultados laboratoriais.\n\nNossa equipe está trabalhando com prioridade para normalizar os prazos de entrega...`,
    type: 'info'
  },
  {
    id: 3,
    title: 'Atualização do Sistema',
    subtitle: 'Melhorias e Novos Recursos',
    date: '2025-03-29',
    author: 'Ana Beatriz',
    description: 'Informamos que o sistema passará por atualizações importantes no próximo final de semana.',
    fullDescription: `Prezados docentes e residentes,\n\nInformamos que no próximo final de semana realizaremos uma importante atualização em nossos sistemas, que trará melhorias significativas para nossos processos internos...`,
    type: 'update'
  }
];

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' ? true : announcement.type === selectedFilter;

    const announcementDate = new Date(announcement.date);
    const matchesDateRange =
      (!dateRange.startDate || announcementDate >= new Date(dateRange.startDate)) &&
      (!dateRange.endDate || announcementDate <= new Date(dateRange.endDate));

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'info': return '📋';
      case 'update': return '🔄';
      default: return '📢';
    }
  };

  const selectedAnnouncementData = mockAnnouncements.find(a => a.id === selectedAnnouncement);

  return (
    <MainLayout title="Mural de Avisos">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow border">
          {/* Search + Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar avisos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border rounded-md py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedFilter}
                  onChange={e => setSelectedFilter(e.target.value)}
                  className="border rounded-md py-2 px-3"
                >
                  <option value="all">Todos</option>
                  <option value="warning">Importantes</option>
                  <option value="info">Informações</option>
                  <option value="update">Atualizações</option>
                </select>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm"
                >
                  <Filter size={16} /> Filtrar
                </button>
              </div>
            </div>
          </div>

          {isFilterOpen && (
            <div className="p-4 border-b bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data inicial</label>
                  <input
                    type="date"
                    className="w-full mt-1 border rounded-md px-2 py-1"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data final</label>
                  <input
                    type="date"
                    className="w-full mt-1 border rounded-md px-2 py-1"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Lista de Avisos */}
          <div>
            {filteredAnnouncements.map((a) => (
              <div key={a.id} className="p-6 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAnnouncement(a.id)}>
                <div className="flex gap-4 items-start">
                  <div className="text-2xl">{getIconForType(a.type)}</div>
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(a.date)} • {a.author}</p>
                    <h3 className="text-lg font-semibold">{a.title}</h3>
                    <h4 className="text-sm text-gray-700">{a.subtitle}</h4>
                    <p className="text-gray-600 mt-2">{a.description}</p>
                    <span className="text-teal-600 text-sm mt-2 inline-block">Ver mais</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedAnnouncement !== null && (
          <Dialog
            as={motion.div}
            open={true}
            onClose={() => setSelectedAnnouncement(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Overlay */}
            <Dialog.Overlay
              as={motion.div}
              className="fixed inset-0 bg-black bg-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Painel */}
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-50 bg-white rounded-xl max-w-2xl w-full mx-auto p-6 shadow-lg"
            >
              {selectedAnnouncementData && (
                <>
                  <div className="flex justify-between items-center border-b pb-3">
                    <button onClick={() => setSelectedAnnouncement(null)} className="text-gray-500 hover:text-gray-700">
                      <ArrowLeft size={20} />
                    </button>
                    <button onClick={() => setSelectedAnnouncement(null)} className="text-gray-500 hover:text-gray-700">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-xl font-bold">{selectedAnnouncementData.title}</h2>
                    <p className="text-sm text-gray-600">{selectedAnnouncementData.subtitle}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(selectedAnnouncementData.date)} • {selectedAnnouncementData.author}
                    </p>

                    <div className="mt-4 space-y-3 text-gray-700">
                      {selectedAnnouncementData.fullDescription.split('\n').map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Dialog>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Dashboard;
