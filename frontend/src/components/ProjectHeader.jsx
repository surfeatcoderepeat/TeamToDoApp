import React, { useState, useEffect } from 'react';
import '../styles/ProjectHeader.css';
import { patchProject, createProject } from '../services/projectService';

const ProjectHeader = ({ projectId, projectName, setProjectId, setProjectName, onMenuClick, setCurrentProject, handleUpdateProjectName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newProjectName, setNewProjectName] = useState(projectName || 'Nuevo Proyecto');
    const [isLoading, setIsLoading] = useState(false);

    // Actualiza el input si el nombre del proyecto cambia desde fuera
    useEffect(() => {
        setNewProjectName(projectName || 'Nuevo Proyecto');
    }, [projectName]);

    const handleSave = async () => {
        if (newProjectName.trim() === '') {
            alert('El nombre del proyecto no puede estar vacío.');
            setNewProjectName(projectName); // Restablecer si está vacío
            setIsEditing(false);
            return;
        }

        setIsEditing(false); // Salir del modo edición antes de hacer cambios

        if (newProjectName !== projectName) {
            setIsLoading(true);
            try {
                if (projectId) {
                    // Si el proyecto ya existe, actualizarlo
                    const updatedProject = await patchProject(projectId, { name: newProjectName });
                    setProjectName(updatedProject.name); // Asegurarse de actualizar el nombre
                    setCurrentProject(updatedProject.name);
                    handleUpdateProjectName(updatedProject.name)
                } else {
                    // Si no existe, preguntar al usuario si desea crearlo
                    const confirmCreate = window.confirm(
                        'El proyecto no existe. ¿Deseas crear un nuevo proyecto con este nombre?'
                    );
                    if (confirmCreate) {
                        const createdProject = await createProject({ name: newProjectName });
                        setProjectId(createdProject.id);
                        setProjectName(createdProject.name); // Actualizar con el nombre real desde la respuesta
                        console.log('Nuevo proyecto creado:', createdProject);
                    } else {
                        setNewProjectName(projectName); // Restablecer si cancela
                    }
                }
            } catch (error) {
                console.error('Error al guardar el proyecto:', error);
                setNewProjectName(projectName); // Restablecer al nombre anterior si falla
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="project-header">
            {isEditing ? (
                <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') {
                            setIsEditing(false);
                            setNewProjectName(projectName); // Restablecer si se presiona Esc
                        }
                    }}
                    className="project-name-input"
                    autoFocus
                />
            ) : (
                <h1
                    onClick={() => setIsEditing(true)}
                    className="project-name"
                >
                    {isLoading ? 'Guardando...' : projectName}
                </h1>
            )}
            <button className="menu-button" onClick={onMenuClick}>
                &#x2022;&#x2022;&#x2022;
            </button>
        </div>
    );
};

export default ProjectHeader;
