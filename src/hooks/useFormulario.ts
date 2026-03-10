import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePonto } from '../context/PontoContext';
import { useAuth } from '../context/AuthContext';
import { IPonto, IAbrigo } from '../types/Ponto';
import { AddressService } from '../services/address';

export const useFormulario = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addPonto, pontos, updatePonto } = usePonto();
    const { getUsuarioId } = useAuth();

    const query = new URLSearchParams(location.search);
    const lat = parseFloat(query.get('lat') || '0');
    const lng = parseFloat(query.get('lng') || '0');
    const ilat = parseFloat(query.get('ilat') || '0');
    const ilng = parseFloat(query.get('ilng') || '0');
    const editId = query.get('edit');

    const [endereco, setEndereco] = useState('');
    const [linhaEscolares, setLinhaEscolares] = useState(false);
    const [linhaStpc, setLinhaStpc] = useState(false);
    const [baia, setBaia] = useState(false);
    const [rampa, setRampa] = useState(false);
    const [pisoTatil, setPisoTatil] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_patologia, setPatologia] = useState(false);

    const [dataVisita, setDataVisita] = useState<Date | null>(new Date());
    const [abrigos, setAbrigos] = useState<IAbrigo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (editId) {
                const id = parseInt(editId);
                const p = pontos.find(p => p.id === id);
                if (p) {
                    setEndereco(p.endereco);
                    setLinhaEscolares(p.linhaEscolares);
                    setLinhaStpc(p.linhaStpc);
                    setBaia(p.baia);
                    setRampa(p.rampa);
                    setPisoTatil(p.pisoTatil);
                    setPatologia(p.patologia);
                    setDataVisita(p.dataVisita ? new Date(p.dataVisita) : new Date());
                    setAbrigos(p.abrigos);
                }
            } else {
                try {
                    const addr = await AddressService.getAddress(lat, lng);
                    const fullAddr = `${addr.road}, ${addr.neighbourhood}, ${addr.city}`;
                    setEndereco(fullAddr.replace(/^, /, '').replace(/, $/, ''));
                } catch (e) {
                    console.warn('Address fetch failed');
                }
            }
        };
        init();
    }, [editId, lat, lng, pontos]);

    const handleSave = async () => {
        if (!endereco) {
            alert('Endereço obrigatório');
            return;
        }

        const userId = getUsuarioId();
        if (!userId) {
            alert('Usuário não logado');
            return;
        }

        setLoading(true);

        const ponto: IPonto = {
            id: editId ? parseInt(editId) : undefined,
            idUsuario: userId,
            endereco,
            latitude: lat,
            longitude: lng,
            linhaEscolares,
            linhaStpc,
            baia,
            rampa,
            pisoTatil,
            patologia: abrigos.some(a => a.temPatologia),
            latitudeInterpolado: ilat,
            longitudeInterpolado: ilng,
            dataVisita: new Date().toISOString(),
            abrigos,
            imgBlobPaths: [],
            imagensPatologiaPaths: [],
            syncStatus: 'pending'
        };

        try {
            if (editId && ponto.id) {
                await updatePonto(ponto);
            } else {
                await addPonto(ponto);
            }
            navigate('/registros');
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    return {
        lat,
        lng,
        endereco,
        setEndereco,
        linhaEscolares,
        setLinhaEscolares,
        linhaStpc,
        setLinhaStpc,
        baia,
        setBaia,
        rampa,
        setRampa,
        pisoTatil,
        setPisoTatil,
        dataVisita,
        abrigos,
        setAbrigos,
        loading,
        handleSave,
        navigate,
    };
};
