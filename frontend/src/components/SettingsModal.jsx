import React from 'react';
import '../styles/SettingsModal.css'; // Asegúrate de crear este archivo para estilos

const SettingsModal = ({ visibleDaysCount, setVisibleDaysCount, onClose }) => {
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
                <button className="close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;