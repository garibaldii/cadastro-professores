'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function useAuthError() {
  useEffect(() => {
    // Função para verificar e exibir erro de autenticação
    const checkAuthError = () => {
      const errorMessage = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-error='))
        ?.split('=')[1];

      if (errorMessage) {
        // Decodifica a mensagem
        const decodedMessage = decodeURIComponent(errorMessage);
        
        // Exibe o toast de erro
        toast.error(decodedMessage, {
          duration: 4000,
          position: 'top-center',
        });

        // Remove o cookie após exibir o erro
        document.cookie = 'auth-error=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    };

    // Verifica imediatamente
    checkAuthError();

    // Também verifica quando a página ganha foco (caso o usuário volte de outra aba)
    const handleFocus = () => {
      checkAuthError();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
}