import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'antd';
import { TagSelector } from '../../components'; 
import styles from './NewPostModal.module.css';

export default function NewPostModal() {
    const navigate = useNavigate();
    const close = () => navigate(-1);

    // 1. Estados
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [coverFile, setCoverFile] = useState(null); // Arquivo real
    const [previewUrl, setPreviewUrl] = useState(null); // URL para exibir

    // 2. useEffect para gerar e limpar a URL do preview
    useEffect(() => {
        // Se não tem arquivo, limpa a URL
        if (!coverFile) {
            setPreviewUrl(null);
            return;
        }

        // Cria a URL temporária
        const url = URL.createObjectURL(coverFile);
        setPreviewUrl(url);

        // Função de limpeza: roda quando coverFile mudar ou componente desmontar
        return () => URL.revokeObjectURL(url);
    }, [coverFile]);

    // 3. Handlers
    const handleFileChange = (info) => {
        const file = info.file.originFileObj || info.file;
        
        if (info.file.status === 'removed') {
            setCoverFile(null);
            return;
        }
        setCoverFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você envia title, description, selectedTags e coverFile
        console.log({ title, description, tags: selectedTags, file: coverFile });
    };

    // 4. Renderização
    return (
        <div className={styles['modal-overlay']} onClick={close}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                
                <div className={styles['modal-header']}>
                    <h2>Criar novo post</h2>
                    <button className={styles['btn-close']} onClick={close} aria-label="Fechar">
                        &times;
                    </button>
                </div>

                <form className={styles['modal-form']} onSubmit={handleSubmit}>
                    
                    <input 
                        type="text" 
                        placeholder="Título..." 
                        className={styles['input-field']} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea 
                        placeholder="Descrição..." 
                        className={`${styles['input-field']} ${styles['textarea-field']}`} 
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className={styles['tags-section']}>
                        <TagSelector 
                            value={selectedTags} 
                            onChange={setSelectedTags} 
                        />
                    </div>

                    {/* Área de Upload */}
                    <Upload
                        name="cover"
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        disabled={false}
                    >
                        <div className={styles['upload-area']}>
                            {coverFile ? (
                                // Se tem arquivo, mostra preview
                                coverFile.type.startsWith('image/') ? (
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className={styles['upload-preview']} 
                                    />
                                ) : (
                                    <div className={styles['file-preview-info']}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles['upload-icon']}>
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                        <p>{coverFile.name}</p>
                                    </div>
                                )
                            ) : (
                                // Se não tem, mostra ícone padrão
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles['upload-icon']}>
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <p>Selecione ou arraste um arquivo</p>
                                </>
                            )}
                        </div>
                    </Upload>

                    <div className={styles['modal-actions']}>
                        <button type="button" className={styles['btn-cancel']} onClick={close}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles['btn-submit']}>
                            Criar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};