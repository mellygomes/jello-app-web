// src/hooks/useNewPost.js
import { useState } from 'react';
import { createNewPost } from '../services/newPost';

export function useNewPost() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            // O Axios retorna a resposta do back-end aqui
            const response = await createNewPost(data); 
            
            // AQUI ESTÁ O SEGREDO: Retornar o sucesso para a modal
            return { success: true, post: response.data }; 
            
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Erro ao criar o post.";
            setError(message);
            
            // Retornar falha para a modal saber que não deve fechar
            return { success: false }; 
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
}