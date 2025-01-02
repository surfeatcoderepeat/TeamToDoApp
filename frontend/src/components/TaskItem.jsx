import React, { useState } from 'react';
import '../styles/TaskItem.css'; // Asegúrate de que el archivo CSS tenga los estilos

const TaskItem = ({ task, onCreateTask, onUpdateTask, onDeleteTask, day, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || '');

    const handleSave = () => {
        if (task.id) {
            onUpdateTask(task.id, title);
        } else {
            onCreateTask(day, index, title);
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (task.id) {
            onDeleteTask(task.id);
        }
    };

    return (
        <div className="task-item">
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                />
            ) : (
                <span onClick={() => setIsEditing(true)}>{title }</span>
            )}
            <div className="task-item-buttons">
                {task.id && (
                    <button className="task-item-edit" onClick={() => setIsEditing(true)}>
                        ✏️
                    </button>
                )}
                {task.id && (
                    <button className="task-item-delete" onClick={handleDelete}>
                        ❌
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskItem;