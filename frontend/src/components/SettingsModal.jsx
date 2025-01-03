import React, { useEffect } from 'react';
import '../styles/SettingsModal.css';

const SettingsModal = ({ visibleDaysCount, setVisibleDaysCount, onClose }) => {

    // Cerrar el modal al hacer clic afuera o presionar Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Si el clic es fuera del modal, lo cerramos
            if (e.target.classList.contains('modal-overlay')) {
                onClose();
            }
        };

        const handleEscape = (e) => {
            // Si se presiona la tecla Escape, cerramos el modal
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Añadir event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        // Limpiar los event listeners cuando el componente se desmonte
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleSliderChange = (event) => {
        setVisibleDaysCount(Number(event.target.value));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Configuración</h2>
                <div className="slider-container">
                    <label htmlFor="days-slider">Días visibles en el dashboard:</label>
                    <input
                        id="days-slider"
                        type="range"
                        min="1"
                        max="5"
                        value={visibleDaysCount}
                        onChange={handleSliderChange}
                    />
                    <span>{visibleDaysCount} día(s)</span>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
