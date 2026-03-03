import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import styles from './paradasBanco.module.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { FaBus, FaBusAlt } from "react-icons/fa";
import { IoMapSharp, IoArrowBack, IoReload } from 'react-icons/io5';
import { MdSatellite } from 'react-icons/md';
import { formatDateForInput } from '../../utils/formatters';
import { useParadasBanco } from '../../hooks/useParadasBanco';
import { useEffect } from 'react';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const createClusterCustomIcon = (cluster: any) => {
    return L.divIcon({
        html: `<div style="background-color: #0D47A1; width: 40px;
         height: 40px;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         color: white;
         font-weight: bold;
         border: 2px solid white;">${cluster.getChildCount()}</div>`,
        className: 'marker-cluster-custom',
        iconSize: L.point(30, 30, true),
    });
};

const MapBounds = ({ feature }: { feature: any }) => {
    const map = useMap();

    useEffect(() => {
        if (feature) {
            const layer = L.geoJSON(feature);
            const bounds = layer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }
        }
    }, [feature, map]);

    return null;
};

export const ParadasBancoPage = () => {
    const {
        points,
        loading,
        userLocation,
        raFeature,
        baciaFeature,
        showSatellite,
        setShowSatellite,
        ras,
        bacias,
        filterType,
        setFilterType,
        selectedFilter,
        setSelectedFilter,
        navigate,
    } = useParadasBanco();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.filters}>
                    <select
                        value={filterType || ''}
                        onChange={(e) => {
                            setFilterType(e.target.value as 'RA' | 'Bacia' || null);
                            setSelectedFilter('');
                        }}
                        className={styles.select}
                    >
                        <option value="">Todos</option>
                        <option value="RA">Região Administrativa</option>
                        <option value="Bacia">Bacia</option>
                    </select>

                    {filterType && (
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Selecione...</option>
                            {(filterType === 'RA' ? ras : bacias).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {loading && 
                <div className={styles.loading}>
                    <IoReload size={40} className={styles.loadingIcon} />
                </div>
            }

            <div className={styles.mapWrapper}>
                <MapContainer
                    center={userLocation || [-15.7942, -47.8822]}
                    zoom={13}
                    minZoom={11}
                    maxZoom={18}
                    maxBounds={[[-16.15, -48.35], [-15.45, -47.25]]}
                    maxBoundsViscosity={1.0}
                    className={styles.map}
                    zoomControl={false}
                >
                    {/* <ZoomControl position="topright" /> */}
                    <TileLayer
                        url={showSatellite
                            ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                            : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    {(raFeature || baciaFeature) && <MapBounds feature={raFeature || baciaFeature} />}

                    {raFeature && (
                        <GeoJSON
                            key={selectedFilter}
                            data={raFeature}
                            style={{ color: 'blue', weight: 3, fillOpacity: 0.2 }}
                        />
                    )}

                    {baciaFeature && (
                        <GeoJSON
                            key={`bacia-${selectedFilter}`}
                            data={baciaFeature}
                            style={{ color: 'gold', weight: 3, fillOpacity: 0.2 }}
                        />
                    )}


                    <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                        {points
                            .filter(p => p.latitude != null && p.longitude != null)
                            .map(p => (
                                <Marker key={p.id} position={[p.latitude, p.longitude]} icon={DefaultIcon}>
                                    <Popup>
                                        <div className={styles.popupContent}>
                                            <h2 className={styles.popupTitle}>{p.abrigoNome}</h2><br /><br />
                                            <strong>Endereço:</strong> {p.endereco}<br /><br />
                                            <strong>Criado Por:</strong> {p.criadoPor}<br /><br />
                                            <strong>Criado Em:</strong> {formatDateForInput(p.criadoEm || '')}<br /><br />
                                            {!filterType && (
                                                <>
                                                    <strong>Visitado Em:</strong> {formatDateForInput(p.visitadoEm || p.dataVisita || '')}<br /><br />
                                                </>
                                            )}
                                            <strong>Linha Escolar:</strong> <span className={p.linhaEscolar ? styles.iconSuccess : styles.iconError}><FaBus /></span><br /><br />
                                            <strong>Linha STPC:</strong> <span className={p.linhaStpc ? styles.iconSuccess : styles.iconError}><FaBusAlt /></span><br /><br />
                                            {p.abrigoImg && (
                                                <img src={p.abrigoImg} alt="Abrigo" className={styles.popupImage} />
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>

            <button onClick={() => navigate(-1)}
                className={styles.backBtn}
                title="Voltar"
            >
                <IoArrowBack size={24} />
            </button>
            <button
                onClick={() => setShowSatellite(!showSatellite)}
                className={styles.satelliteBtn}
                title="Alternar entre camadas de mapa"
            >
                {showSatellite ? <IoMapSharp size={24} /> : <MdSatellite size={28} />}
            </button>
        </div>
    );
};
