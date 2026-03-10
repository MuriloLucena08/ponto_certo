import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePonto } from '../context/PontoContext';
import { IPonto } from '../types/Ponto';
import { PointsService } from '../services/points';

export const useRegistros = () => {
    const { pontos: allPontos, removePonto, updatePonto, setSyncMessage } = usePonto() as any;
    const [syncing, setSyncing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<any>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const navigate = useNavigate();

    // Filtra apenas os cards que devem aparecer (pending e failed)
    const pontos = allPontos.filter((p: IPonto) => p.syncStatus === 'pending' || p.syncStatus === 'failed');
    const pendingCount = pontos.length;

    const toggleSelection = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSync = async () => {
        if (selectedIds.length === 0) {
            setMessage('Por favor, selecione ao menos uma parada para sincronizar.');
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        // Filtra para enviar apenas os itens selecionados
        const itemsToSync = pontos.filter((p: IPonto) => selectedIds.includes(p.id!));
 
        setSyncing(true);
        let sucesso = 0;
        let falha = 0;

        for (const [index, ponto] of itemsToSync.entries()) {
            try {
                const enviado = await PointsService.createPoint(ponto);
                if (enviado) {
                    await removePonto(ponto.id);
                    sucesso++;
                    // Remove da seleção se estiver selecionado
                    if (selectedIds.includes(ponto.id!)) {
                        setSelectedIds(prev => prev.filter(id => id !== ponto.id));
                    }
                } else {
                    throw new Error('A API não retornou sucesso (status != 201)');
                }
            } catch (error) {
                console.error(`Falha ao sincronizar a parada ${ponto.id}:`, error);
                await updatePonto({ ...ponto, syncStatus: 'failed' });
                falha++;
            }

            // Adiciona uma pausa de 3 segundos entre cada envio, exceto para o último
            if (index < itemsToSync.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        setSyncing(false);

        // Mensagem aparece após 3 segundos do término do processo
        setTimeout(() => {
            if (sucesso === 1) {
                setSyncMessage(`${sucesso} registro enviado com sucesso!`);
                setTimeout(() => setSyncMessage(null), 3000);
            } else if (sucesso > 1) {
                setSyncMessage(`${sucesso} registros enviados com sucesso!`);
                setTimeout(() => setSyncMessage(null), 3000);
            } else if (falha > 0) {
                setMessage('Falha ao sincronizar todas as paradas selecionadas.');
                setTimeout(() => setMessage(null), 3000);
            }
        }, 3000);
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
                setTimeout(() => setMessage(null), 3000);
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
        selectedIds,
        toggleSelection,
        handleSync,
        handleEdit,
        handleDelete,
        confirmDelete,
        cancelDelete,
    };
};
