import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Search, Send, Plus, Paperclip, Image, Smile, User, CheckCircle, MessageSquare } from 'lucide-react';

// Mock data for chat contacts
const mockContacts = [
  { id: 1, name: 'João Silva', specialty: 'Cardiologia', isOnline: true, lastMessage: 'Olá, como está?' },
  { id: 2, name: 'Maria Oliveira', specialty: 'Pediatria', isOnline: false, lastMessage: 'Preciso das informações sobre o paciente.' },
  { id: 3, name: 'Pedro Santos', specialty: 'Neurologia', isOnline: true, lastMessage: 'Obrigado pela ajuda!' },
  { id: 4, name: 'Ana Pereira', specialty: 'Dermatologia', isOnline: false, lastMessage: 'Quando podemos marcar uma reunião?' },
  { id: 5, name: 'Carlos Mendes', specialty: 'Ortopedia', isOnline: false, lastMessage: 'Vou verificar e te respondo mais tarde.' },
];

// Mock data for messages
const mockMessages = [
  { id: 1, sender: 2, text: 'Olá, como está?', timestamp: '2023-08-15T10:30:00' },
  { id: 2, sender: 'me', text: 'Estou bem, e você?', timestamp: '2023-08-15T10:32:00' },
  { id: 3, sender: 2, text: 'Também estou bem, obrigada por perguntar!', timestamp: '2023-08-15T10:33:00' },
  { id: 4, sender: 'me', text: 'Preciso das informações sobre o paciente novo que chegou ontem.', timestamp: '2023-08-15T10:35:00' },
  { id: 5, sender: 2, text: 'Claro, vou te enviar os detalhes em um momento.', timestamp: '2023-08-15T10:36:00' },
  { id: 6, sender: 2, text: 'Acabei de enviar o relatório por email. Dê uma olhada e me diga o que acha.', timestamp: '2023-08-15T10:45:00' },
  { id: 7, sender: 'me', text: 'Recebi, obrigado! Vou analisar e te dou um retorno até o final do dia.', timestamp: '2023-08-15T10:47:00' },
];

const Chat: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<number | null>(2); // Default to first contact
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Filtro de Contatos
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  
  return (
    <MainLayout title="Chat">
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-180px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Contatos sidebar */}
        <div className="w-full md:w-80 md:border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar contatos..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhum contato encontrado.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredContacts.map((contact) => (
                  <li 
                    key={contact.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact === contact.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="p-3 flex items-start">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={24} className="text-gray-500" />
                        </div>
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                          <p className="text-xs text-gray-500">12:30</p>
                        </div>
                        <p className="text-xs text-gray-500">{contact.specialty}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100">
            <button className="w-full py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
              <Plus size={18} className="mr-1" />
              Novo chat
            </button>
          </div>
        </div>
        
        {/* Chat area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                  {mockContacts.find(c => c.id === selectedContact)?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">
                    {mockContacts.find(c => c.id === selectedContact)?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mockContacts.find(c => c.id === selectedContact)?.isOnline 
                      ? 'Online'
                      : 'Offline'
                    }
                  </p>
                </div>
              </div>
              <div>
                <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100">
                  <Search size={18} />
                </button>
              </div>
            </div>
            
            {/* Mensagens area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-md rounded-lg p-3 ${
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div 
                        className={`text-xs mt-1 flex items-center ${
                          message.sender === 'me' ? 'text-blue-200 justify-end' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                        {message.sender === 'me' && (
                          <CheckCircle size={12} className="ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </div>
            
            {/* Mensagens input */}
            <div className="p-3 border-t border-gray-100">
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100">
                    <Paperclip size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100">
                    <Image size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100">
                    <Smile size={18} />
                  </button>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Digite sua mensagem..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-200 resize-none"
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  ></textarea>
                </div>
                <button 
                  className="ml-3 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center justify-center"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma conversa selecionada</h3>
              <p className="text-gray-500">Selecione um contato para iniciar uma conversa.</p>
            </div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Chat;