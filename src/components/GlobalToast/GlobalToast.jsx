// src/components/GlobalToast/GlobalToast.jsx
import { useState, useEffect } from 'react';
import styles from './GlobalToast.module.css';

export default function GlobalToast() {
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const handleShowToast = (event) => {
            setMessage(event.detail.message);

            // O toast fica na tela por 2.5 segundos (mais tempo que o flash)
            const timer = setTimeout(() => setMessage(null), 2500);
            return () => clearTimeout(timer);
        };

        window.addEventListener('show-toast', handleShowToast);
        return () => window.removeEventListener('show-toast', handleShowToast);
    }, []);

    if (!message) return null;

    return (
        <>
            {/* O flash da tela acontece junto */}
            <div className={styles.screenFlash} />
            
            {/* O Toast em si */}
            <div className={styles.toastContainer}>
                <div className={styles.toastIcon}>
                    ✓
                </div>
                {message}
            </div>
        </>
    );
}