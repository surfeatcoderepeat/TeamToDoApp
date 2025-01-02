import React, { useState, useEffect } from 'react';
import '../styles/TaskItem.css';

const TaskItem = ({ task = {}, onCreateTask, onUpdateTask, onDeleteTask, onToggleComplete, day, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || '');
    const [isCompleted, setIsCompleted] = useState(task.completed || false);

    // Sincronizar estado local con las props al cambiar el task
    useEffect(() => {
        setTitle(task.title || '');
        setIsCompleted(task.completed || false);
    }, [task]);

    const handleSave = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            if (task.id) {
                onUpdateTask(task.id, trimmedTitle); // Actualiza tarea existente
            } else {
                onCreateTask(day, index, trimmedTitle); // Crea nueva tarea
            }
        } else if (task.id) {
            onDeleteTask(task.id); // Elimina la tarea si el título está vacío
        }
        setIsEditing(false); // Salir del modo de edición
    };

    const handleDelete = () => {
        if (task.id) {
            onDeleteTask(task.id);
        }
    };

    const handleToggleComplete = () => {
        const newCompletedState = !isCompleted;
        setIsCompleted(newCompletedState); // Actualiza el estado local
        if (onToggleComplete) {
            onToggleComplete(task.id, newCompletedState); // Llama al callback si está definido
        }
    };

    return (
        <div
            className={`task-item ${isCompleted ? 'completed' : ''}`}
            onClick={handleToggleComplete} // Marca o desmarca como completada
            onDoubleClick={(e) => {
                e.stopPropagation(); // Evitar conflicto con el clic
                setIsEditing(true); // Activa el modo de edición
            }}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave} // Guarda al perder el foco
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') setIsEditing(false);
                    }}
                    className="task-item-input"
                    autoFocus
                />
            ) : (
                <span className={`task-item-placeholder ${!title && 'empty-task'}`}>
                    {title}
                </span>
            )}
            <div className="task-item-buttons">
                <button
                    className="task-item-edit"
                    onClick={(e) => {
                        e.stopPropagation(); // Evitar que se active el clic del contenedor
                        setIsEditing(true);
                    }}
                >
                    <i className="fas fa-ellipsis-v"></i> {/* Tres puntos verticales */}
                </button>
                <button
                    className="task-item-delete"
                    onClick={(e) => {
                        e.stopPropagation(); // Evitar que se active el clic del contenedor
                        handleDelete();
                    }}
                >
                    <i className="fas fa-trash"></i> {/* Tacho de basura */}
                </button>
            </div>
        </div>
    );
};

export default TaskItem;