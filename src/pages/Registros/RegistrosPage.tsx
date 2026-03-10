import styles from './registros.module.css';
import { Main } from '../../components/Commons/Main/Main';
import { MdLocationPin } from 'react-icons/md';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { BsPencilFill } from 'react-icons/bs';
import { useRegistros } from '../../hooks/useRegistros';
import { IoReload } from 'react-icons/io5';
import { usePonto } from '../../context/PontoContext';

export const RegistrosPage = () => {
    const { syncMessage } = usePonto();
    const {
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
    } = useRegistros();

    return (
        <Main className={styles.container}>
            {(message || syncMessage) && (
                <div
                    className={styles.toast}
                    style={{ backgroundColor: message ? 'var(--error-color)' : 'var(--success-color)' }}
                >
                    {message || syncMessage}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Excluir parada</h2>
                        <p className={styles.modalText}>Tem certeza que deseja remover esta parada?</p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={cancelDelete}
                                className={styles.cancelBtn}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className={styles.confirmBtn}
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {syncing && (
                <div className={styles.syncOverlay}>
                    <div className={styles.syncBox}>
                        <IoReload size={40} className={styles.loadingIcon} />
                        <h2>Enviando paradas...</h2>
                    </div>
                </div>
            )};

            {pontos.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Paradas criadas estarão disponíveis aqui para gravar ao banco de dados</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {pontos.map((ponto: any, index: any) => (
                        <div key={ponto.id || index} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.checkboxContainer}>
                                    <input
                                        className={styles.checkbox}
                                        type="checkbox"
                                        checked={selectedIds.includes(ponto.id)}
                                        onChange={() => toggleSelection(ponto.id)}
                                    />
                                </div>
                                <div className={styles.imageContainer}>
                                    <span className={styles.locationIcon}><MdLocationPin /></span>
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.address}>{ponto.endereco}</h3>
                                    <div className={styles.details}>
                                        <p>Há Abrigo: {ponto.abrigos.length > 0 ? 'Sim' : 'Não'}</p>
                                        <p>Patologias: {ponto.abrigos.some((a: any) => a.temPatologia) ? 'Sim' : 'Não'}</p>
                                        <p>Acessibilidade: {(ponto.pisoTatil || ponto.rampa) ? 'Sim' : 'Não'}</p>
                                        <p>Linhas: {ponto.linhaStpc ? 'Sim' : 'Não'}</p>
                                        <p className={styles.status}>Status: {ponto.syncStatus || 'Pending'}</p>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => handleEdit(ponto)} className={styles.iconBtn}>
                                        <BsPencilFill size={18} color='blue' />
                                    </button>
                                    <button onClick={() => handleDelete(ponto.id)} className={styles.iconBtn}>
                                        <BiSolidTrashAlt size={18} color='red' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                className={styles.fab}
                onClick={handleSync}
                disabled={syncing || pendingCount === 0}
                style={{ position: 'fixed', bottom: '90px', right: '20px' }}
            >
                {syncing ? '...' : <FaCloudDownloadAlt size={24} />}
            </button>
        </Main>

    );
};
