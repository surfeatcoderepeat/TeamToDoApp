import React from 'react';
import '../styles/ProjectHeader.css';

const ProjectHeader = ({ projectName, onMenuClick }) => {
    return (
        <div className="project-header">
            <h1>{projectName}</h1>
            <button className="menu-button" onClick={onMenuClick}>
                &#x2022;&#x2022;&#x2022; {/* Icono de tres puntos */}
            </button>
        </div>
    );
};

export default ProjectHeader;