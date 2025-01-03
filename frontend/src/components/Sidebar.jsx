import React from 'react';
import '../styles/Sidebar.css'; // Asegúrate de tener el archivo de estilos
import logo from '../assets/images/logo_mare.png';

const Sidebar = ({ onSettingsClick, onHomeClick, onCalendarClick, onShareClick }) => {
    return (
        <div className="sidebar">
            {/* Logo en la parte superior */}
            <div className="sidebar-logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* Botones superiores */}
            <div className="top-buttons">
                <button onClick={onHomeClick}><i className="fas fa-home"></i></button>
                <button onClick={onCalendarClick}><i className="fas fa-calendar-alt"></i></button>
                <button onClick={onShareClick}><i className="fas fa-share-alt"></i></button>
            </div>

            {/* Botones inferiores */}
            <div className="bottom-buttons">
                <button onClick={onSettingsClick}>
                    <i className="fas fa-cog"></i> {/* Engranaje para abrir el SettingsModal */}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
