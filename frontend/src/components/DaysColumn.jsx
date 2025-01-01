import React from "react";
import TaskItem from "./TaskItem";
import "../styles/DaysColumn.css";

const DaysColumn = ({ dayName, date, tasks, onTaskCreate, onTaskUpdate }) => {
    return (
        <div className="days-column">
            <div className="days-column-header">
                <h2>{dayName}</h2>
                <p>{date}</p>
            </div>
            <div className="tasks-list">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onUpdate={onTaskUpdate}
                    />
                ))}
                <button
                    className="add-task-button"
                    onClick={onTaskCreate}
                >
                    + Nueva Tarea
                </button>
            </div>
        </div>
    );
};

export default DaysColumn;