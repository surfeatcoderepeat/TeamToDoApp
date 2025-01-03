import React, { useState, useEffect } from 'react';
import '../styles/TaskItem.css';

const TaskItem = ({ task = {}, onCreateTask, onUpdateTask, onDeleteTask, onToggleComplete, day, date, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || '');
    const [isCompleted, setIsCompleted] = useState(task.completed || false);

    // Sincronizar estado local con las props al cambiar el task
    useEffect(() => {
        setTitle(task.title || '');
        setIsCompleted(task.completed || false);
    }, [task]);

    // Guardar tarea
    const handleSave = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            if (task.id) {
                onUpdateTask(task.id, trimmedTitle); // Actualizar tarea existente
            } else {
                onCreateTask(day, date, index, trimmedTitle); // Crear nueva tarea
            }
        } else if (task.id) {
            onDeleteTask(task.id); // Eliminar tarea si se deja vacía
        }
        setIsEditing(false); // Salir del modo de edición
    };

    // Eliminar tarea
    const handleDelete = () => {
        if (task.id) {
            onDeleteTask(task.id);
        }
    };

    // Alternar estado de completado
    const handleToggleComplete = () => {
        if (!title) return; // No alternar tareas vacías
        const newCompletedState = !isCompleted;
        setIsCompleted(newCompletedState); // Actualizar estado local
        if (onToggleComplete) {
            onToggleComplete(task.id, newCompletedState); // Notificar cambio
        }
    };

    // Manejar clic en tarea
    const handleClick = () => {
        if (!title) {
            setIsEditing(true); // Habilitar edición si la tarea está vacía
        } else {
            handleToggleComplete(); // Alternar completado si tiene texto
        }
    };

    // Renderizado del componente
    return (
        <div
            className={`task-item ${isCompleted ? 'completed' : ''}`}
            onClick={handleClick} // Alternar completado o habilitar edición
            onDoubleClick={(e) => {
                e.stopPropagation(); // Evitar conflicto con el clic
                setIsEditing(true); // Habilitar edición con doble clic
            }}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave} // Guardar al perder el foco
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                        if (e.key === 'Escape') setIsEditing(false);
                    }}
                    className="task-item-input"
                    autoFocus
                />
            ) : (
                <span className={`task-item-placeholder ${!title && 'empty-task'}`}>
                    {title || 'Haz clic para agregar una tarea'} {/* Texto placeholder */}
                </span>
            )}
            {title && (
                <div className="task-item-buttons">
                    <button
                        className="task-item-edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true); // Forzar edición con el botón
                        }}
                    >
                        <i className="fas fa-ellipsis-v"></i> {/* Icono de edición */}
                    </button>
                    <button
                        className="task-item-delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(); // Eliminar tarea
                        }}
                    >
                        <i className="fas fa-trash"></i> {/* Icono de eliminar */}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskItem;