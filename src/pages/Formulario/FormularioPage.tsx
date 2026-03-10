import styles from './formulario.module.css';
import { AbrigoList } from '../../components/AbrigoList/AbrigoList';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Header } from '../../components/Commons/Header/Header';
import { Main } from '../../components/Commons/Main/Main';
import { Input } from '../../components/Commons/Input/Input';
import { Button } from '../../components/Commons/Button/Button';
import { Switch } from '../../components/Commons/Switch/Switch';
import { Section } from '../../components/Commons/Section/Section';
import { FaMapMarkerAlt, FaBus, FaWheelchair, FaCalendarAlt } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';
import { renderToStaticMarkup } from 'react-dom/server';
import { registerLocale } from "react-datepicker";
import { DatePicker } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale/pt-BR';
import { useFormulario } from '../../hooks/useFormulario';

registerLocale('pt-BR', ptBR);

// Icons need to be setup locally or imported
const PinIcon = L.divIcon({
    html: renderToStaticMarkup(<MdLocationPin size={40} color='green' />),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

export const FormularioPage = () => {
    const {
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
    } = useFormulario();

    return (
        <div className={styles.container}>
            <Header title="Formulário da Parada" onBack={() => navigate(-1)} />

            <Main className={styles.content}>
                <Section icon={<FaMapMarkerAlt size={20} />} title="Localização" className={styles.section}>
                    <Input
                        label="Endereço"
                        type="text"
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                        className={styles.input}
                    />
                </Section>

                <div className={styles.mapPreview}>
                    <MapContainer center={[lat, lng]} zoom={16} zoomControl={false} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[lat, lng]} icon={PinIcon} />
                    </MapContainer>
                </div>

                <Section icon={<FaBus size={20} />} title="Características" className={styles.section}>
                    <div className={styles.switches}>
                        <Switch label="Linhas Escolares" value={linhaEscolares} onChange={setLinhaEscolares} disabled />
                        <Switch label="Linhas STPC" value={linhaStpc} onChange={setLinhaStpc} />
                        <Switch label="Baia" value={baia} onChange={setBaia} />
                    </div>
                </Section>

                <Section icon={<FaWheelchair size={20} />} title="Acessibilidade" className={styles.section}>
                    <div className={styles.switches}>
                        <Switch label="Rampa" value={rampa} onChange={setRampa} />
                        <Switch label="Piso Tátil" value={pisoTatil} onChange={setPisoTatil} />
                    </div>
                </Section>

                <Section icon={<FaCalendarAlt size={20} />} title="Visita" className={styles.section}>
                    <div className={styles.datePickerWrapper}>
                        <label><h3 style={{ margin: 0 }}>Data e Hora da Visita</h3></label>
                        <DatePicker
                            selected={dataVisita}
                            onChange={() => {}}
                            readOnly
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy ' às ' HH:mm"
                            locale="pt-BR"
                            className={styles.input}
                            timeCaption="Hora"
                        />
                    </div>
                </Section>

                <div className={styles.divider} />

                <AbrigoList abrigos={abrigos} setAbrigos={setAbrigos} />

                <Button onClick={handleSave} isLoading={loading} className={styles.saveButton}>
                    Salvar Parada
                </Button>
            </Main>
        </div>
    );
};
