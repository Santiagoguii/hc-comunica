import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Users, Link2, ExternalLink } from 'lucide-react';

// Mock data WhatsApp groups
const mockGroups = [
  {
    id: 1,
    name: 'Docentes - Cardiologia',
    description: 'Grupo exclusivo para professores e docentes da área de Cardiologia',
    members: 28,
    shift: 'Manhã',
    link: 'https://chat.whatsapp.com/example1',
    type: 'group'
  },
  {
    id: 2,
    name: 'Docentes - Pediatria',
    description: 'Comunicação entre professores e coordenadores de Pediatria',
    members: 35,
    shift: 'Tarde',
    link: 'https://chat.whatsapp.com/example2',
    type: 'group'
  },
  {
    id: 3,
    name: 'Docentes - Neurologia',
    description: 'Grupo para docentes e pesquisadores de Neurologia',
    members: 22,
    shift: 'Noite',
    link: 'https://chat.whatsapp.com/example3',
    type: 'group'
  },
  {
    id: 4,
    name: 'Comunidade Médica HC',
    description: 'Comunidade geral para todos os profissionais do HC',
    members: 150,
    shift: 'Todos',
    link: 'https://chat.whatsapp.com/example4',
    type: 'community'
  },
  {
    id: 5,
    name: 'Comunidade Acadêmica',
    description: 'Espaço para discussões acadêmicas e pesquisa',
    members: 120,
    shift: 'Todos',
    link: 'https://chat.whatsapp.com/example5',
    type: 'community'
  },
  {
    id: 6,
    name: 'Docentes - Psiquiatria',
    description: 'Grupo dedicado aos professores de Psiquiatria',
    members: 25,
    shift: 'Manhã',
    link: 'https://chat.whatsapp.com/example6',
    type: 'group'
  }
];

// Filtro e controle
const WhatsAppGroups: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  
  // Filtragem de grupos
  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesShift = shiftFilter === '' || group.shift === shiftFilter;
    const matchesType = typeFilter === '' || group.type === typeFilter;
    
    return matchesSearch && matchesShift && matchesType;
  });
  // Copiar Link
  const handleCopyLink = (id: number, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };
  
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
  
  return (
    <MainLayout title="Grupos e Comunidades">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar grupos e comunidades..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/*Filtro por turno*/}
            <div className="w-full sm:w-48">
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
              >
                <option value="">Todos os turnos</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Todos">24 horas</option>
              </select>
            </div>

            {/*Filtro por Tipo*/}
            <div className="w-full sm:w-48">
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="group">Grupos</option>
                <option value="community">Comunidades</option>
              </select>
            </div>
          </div>
        </div>
        
        {/*Exibição dos grupos */}
        {filteredGroups.length === 0 ? (
          <div className="p-6 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum grupo encontrado</h3>
            <p className="text-gray-500">Não existem grupos que correspondam aos filtros aplicados.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredGroups.map((group) => (
              <motion.div
                key={group.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                variants={itemVariants}
              >
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {group.shift}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{group.description}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-1" />
                    <span>{group.members} membros</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    onClick={() => handleCopyLink(group.id, group.link)}
                  >
                    <Link2 size={16} className="mr-1" />
                    {copiedLink === group.id ? 'Link copiado!' : 'Copiar link'}
                  </button>
                  
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-green-600 text-sm font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                  >
                    <MessageSquare size={16} className="mr-1 text-green-600" />
                    Entrar
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default WhatsAppGroups;