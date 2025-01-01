import React from 'react';
import '../styles/NavigationArrows.css'; // Asegúrate de que esté vinculado el CSS

const NavigationArrows = ({ onNavigate }) => {
    return (
        <div className="navigation-arrows">
            <button className="arrow arrow-left" onClick={() => onNavigate('left')}>
                <i className="fas fa-chevron-left"></i>
            </button>
            <button className="arrow arrow-right" onClick={() => onNavigate('right')}>
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default NavigationArrows;