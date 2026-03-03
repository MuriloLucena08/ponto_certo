import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePonto } from '../context/PontoContext';

export const useRegistros = () => {
    const { pontos, syncPontos, pendingCount, removePonto } = usePonto() as any;
    const [syncing, setSyncing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<any>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSync = async () => {
         if (pendingCount === 0) return;

         setSyncing(true);
        const startTime = Date.now();

         await syncPontos();

        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 2000; // 2 seconds

        if (elapsedTime < minDisplayTime) {
            const remainingTime = minDisplayTime - elapsedTime;
            setTimeout(() => setSyncing(false), remainingTime);
        } else {
            setSyncing(false);
        }
     };

    const handleEdit = (ponto: any) => {
        navigate(`/formulario?edit=${ponto.id}&lat=${ponto.latitude}&lng=${ponto.longitude}`);
    };

    const handleDelete = (id: any) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            if (typeof removePonto === 'function') {
                await removePonto(deleteId);
                setMessage('Parada removida');
                setTimeout(() => setMessage(null), 5000);
            }
            setShowModal(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    return {
        pontos,
        syncing,
        showModal,
        message,
        pendingCount,
        handleSync,
        handleEdit,
        handleDelete,
        confirmDelete,
        cancelDelete,
    };
};
