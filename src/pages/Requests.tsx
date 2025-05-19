import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar, Filter, ChevronDown, Search, Trash2, Eye } from 'lucide-react';

// Mock data requests
const mockRequests = [
  {
    id: 1,
    academicInstitution: 'Universidade Federal',
    campus: 'Campus Central',
    specialty: 'Cardiologia',
    requestType: 'Acompanhamento em casos Clínicos',
    reason: 'Necessito acesso ao sistema para acompanhamento de atividades acadêmicas.',
    status: 'pending',
    date: '2023-08-15',
  },
  {
    id: 2,
    academicInstitution: 'Universidade Federal',
    campus: 'Campus Central',
    specialty: 'Pediatria',
    requestType: 'Participação em Grupo',
    reason: 'Solicito participação no grupo de pesquisa em pediatria.',
    status: 'approved',
    date: '2023-08-10',
  },
  {
    id: 3,
    academicInstitution: 'Universidade Federal',
    campus: 'Campus Central',
    specialty: 'Neurologia',
    requestType: 'Auxiliar em Procedimento',
    reason: 'Preciso de suporte para acesso às ferramentas de pesquisa.',
    status: 'pending',
    date: '2023-08-05',
  },
];

const Requests: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  
  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch = 
      request.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? request.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const handleDelete = (id: number) => {
    // In a real application, this would make an API call
    console.log(`Delete request ${id}`);
  };
  
  const handleView = (id: number) => {
    setSelectedRequest(id);
  };
  
  return (
    <MainLayout title="Solicitações">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar solicitações..."
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botons */}
          <div className="flex space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="text-gray-600 hover:text-blue-600 flex items-center text-sm border border-gray-300 rounded-md px-3 py-1"
            >
              <Filter size={16} className="mr-1" />
              Filtrar
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            <Link to="/requests/new">
              <Button variant="primary" size="sm" className="flex items-center">
                <Plus size={16} className="mr-1" />
                Nova Solicitação
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Detalhamento de Filtros */}
        {isFilterOpen && (
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                >
                  <option value="">Todas</option>
                  <option>Cardiologia</option>
                  <option>Pediatria</option>
                  <option>Neurologia</option>
                  <option>Psiquiatria</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
        
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Detalhes da Solicitação</h3>
              {mockRequests.find(r => r.id === selectedRequest) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo de Solicitação</p>
                      <p className="text-gray-900">{mockRequests.find(r => r.id === selectedRequest)?.requestType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Especialidade</p>
                      <p className="text-gray-900">{mockRequests.find(r => r.id === selectedRequest)?.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="text-gray-900">
                        {mockRequests.find(r => r.id === selectedRequest)?.status === 'approved' ? 'Aprovada' : 'Pendente'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Data</p>
                      <p className="text-gray-900">
                        {new Date(mockRequests.find(r => r.id === selectedRequest)?.date || '').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Motivo</p>
                      <p className="text-gray-900">{mockRequests.find(r => r.id === selectedRequest)?.reason}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Lista de solicitações */}
        {filteredRequests.length === 0 ? (
          <div className="p-6 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 mb-4">Não existem solicitações que correspondam aos filtros aplicados.</p>
            <Link to="/requests/new">
              <Button variant="primary">
                <Plus size={16} className="mr-1" />
                Nova Solicitação
              </Button>
            </Link>
          </div>
        ) : (
          <motion.div 
            className="overflow-x-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <motion.tr key={request.id} variants={itemVariants}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.requestType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {new Date(request.date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'approved' ? 'Aprovada' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleView(request.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(request.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Requests;