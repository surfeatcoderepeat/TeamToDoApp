import React from 'react';
import '../styles/Sidebar.css'; // Asegúrate de tener el archivo de estilos
import logo from '../assets/images/logo_mare.png';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="sidebar-menu">
                <button><i className="fas fa-home"></i></button>
                <button><i className="fas fa-calendar-alt"></i></button>
                <button><i className="fas fa-share-alt"></i></button>
                <button><i className="fas fa-cog"></i></button>
            </div>
        </div>
    );
};

export default Sidebar;