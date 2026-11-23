// src/services/newPost.js
import { api } from '../lib/api'; 

export function createNewPost(data) {
    const formData = new FormData();

    // 1. Monta o objeto JSON que vai dentro do campo 'post'
    const postData = {
        title: data.title,
        content: data.content, 
        tags: data.tags,       
    };

    // 2. Transforma em string e adiciona ao FormData
    formData.append('post', JSON.stringify(postData));

    // 3. Adiciona a imagem no campo 'images'
    if (data.file) {
        formData.append('images', data.file); 
    }

    // 4. Envia
    return api.post('/api/v1/posts/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
}