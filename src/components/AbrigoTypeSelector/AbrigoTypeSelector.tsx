import { useState, Fragment } from 'react';
import { IoClose } from 'react-icons/io5';
import { ABRIGO_TYPES } from '../../data/abrigoTypes';
import { IoMdHome } from "react-icons/io";
import styles from './AbrigoTypeSelector.module.css';

// Dynamically import all images from the assets folder
const imageModules = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });

const images: { [key: string]: string } = {};
for (const path in imageModules) {
    const fileName = path.split('/').pop();
    if (fileName) {
        // Normalize to lowercase to handle case-insensitivity (.png vs .PNG)
        images[fileName.toLowerCase()] = (imageModules[path] as any).default;
    }
}

interface AbrigoTypeSelectorProps {
    selectedValue: number | undefined;
    onChange: (value: number) => void;
}

export const AbrigoTypeSelector = ({ selectedValue, onChange }: AbrigoTypeSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedAbrigo = ABRIGO_TYPES.find(t => t.id === selectedValue);

    const handleSelect = (value: number) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <Fragment>
            <div className={styles.trigger} onClick={() => setIsOpen(true)}>
                {selectedAbrigo ? (
                    <>
                        <img src={images[selectedAbrigo.image.toLowerCase()]} alt={selectedAbrigo.name} className={styles.triggerImage} />
                        <span className={styles.triggerName}>{selectedAbrigo.name}</span>
                    </>
                ) : (
                    <span className={styles.placeholder}><IoMdHome /> Selecione o tipo </span>
                )}
            </div>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
                            <IoClose size={28} />
                        </button>
                        <div className={styles.grid}>
                            {ABRIGO_TYPES.map(abrigoType => (
                                <div
                                    key={abrigoType.id}
                                    className={`${styles.card} ${selectedValue === abrigoType.id ? styles.selected : ''}`}
                                    onClick={() => handleSelect(abrigoType.id)}
                                >
                                    <img src={images[abrigoType.image.toLowerCase()]} alt={abrigoType.name} className={styles.image} />
                                    <span className={styles.name}>{abrigoType.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};
