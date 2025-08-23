import { useState } from 'react';
import { sendMessageToChatbot } from '../../../api/chatbot';

export default function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    
    // Limpiar error anterior
    setError('');
    
    // Agregar mensaje del usuario
    const userMessage = { role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Mostrar loading
    setLoading(true);
    
    try {
      // Llamar al chatbot
      const { response } = await sendMessageToChatbot(text.trim());
      
      // Agregar respuesta del bot
      const botMessage = { role: 'bot', text: response, timestamp: new Date() };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
    } catch (error) {
      console.error('Error en chatbot:', error);
      setError('No se pudo conectar con el chatbot. Inténtalo de nuevo.');
      
      // Mensaje de error del bot
      const errorMessage = { 
        role: 'bot', 
        text: 'Lo siento, no puedo responder en este momento. Inténtalo más tarde.', 
        timestamp: new Date() 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError('');
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages
  };
}
