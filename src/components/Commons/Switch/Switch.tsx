import styles from './Switch.module.css';

interface SwitchProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

export const Switch = ({ label, value, onChange, disabled }: SwitchProps) => (
    <div
        className={`${styles.switchRow} ${disabled ? styles.disabled : ''}`}
        onClick={() => !disabled && onChange(!value)}
    >
        <span>{label}</span>
        <div className={`${styles.toggle} ${value ? styles.active : ''}`}>
            <div className={styles.knob} />
        </div>
    </div>
);
