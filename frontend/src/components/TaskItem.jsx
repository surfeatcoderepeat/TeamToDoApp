import React from "react";
import "../styles/TaskItem.css";

const TaskItem = ({ task, onUpdate, onDelete }) => {
    const handleCompleteToggle = () => {
        onUpdate({ ...task, completed: !task.completed });
    };

    return (
        <div className={`task-item ${task.completed ? "completed" : ""}`}>
            <span
                className="task-title"
                onClick={handleCompleteToggle}
            >
                {task.title}
            </span>
            <div className="task-actions">
                <button
                    className="edit-button"
                    onClick={() => alert("Editar tarea")}
                >
                    <i className="fas fa-pen"></i>
                </button>
                <button
                    className="delete-button"
                    onClick={() => onDelete(task)}
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
};

export default TaskItem;