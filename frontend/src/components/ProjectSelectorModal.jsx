import React from 'react';
import '../styles/ProjectSelectorModal.css';

const ProjectSelectorModal = ({ projects, onClose, onSelectProject, createAndSelectProject, onDeleteProject }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Seleccionar Proyecto</h2>
                <ul className="project-list">
                    {projects.map((project) => (
                        <li key={project.id} className="project-item">
                            <span className="project-name" 
                            onClick={() => {onSelectProject(project)}}
                            >
                                {project.name}
                            </span>
                            <button
                                className="delete-project-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita que el clic seleccione el proyecto
                                    onDeleteProject(project.id); // Llama a la función para eliminar
                                }}
                            >
                                <i className="fas fa-trash"></i> {/* Icono de tacho de basura */}
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="add-project-button" onClick={createAndSelectProject}>
                    + Crear nuevo proyecto
                </button>
                <button className="close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ProjectSelectorModal;