import React from 'react';
import TaskItem from './TaskItem';
import '../styles/DaysColumn.css'; // Asegúrate de que el archivo CSS exista y tenga los estilos necesarios

const DaysColumn = ({ dayName, date, tasks = [], maxTasks = 20, onCreateTask, onUpdateTask, onDeleteTask, onToggleComplete }) => {
    // Crear líneas vacías si no hay suficientes tareas
    const totalLines = Array.from({ length: maxTasks }, (_, index) => {
        return tasks[index] || { id: null, title: '', day: dayName }; // Si no hay tarea, añade una vacía
    });

    return (
        <div className="days-column">
            {/* Encabezado de la columna */}
            <div className="days-column-header">
                <h2>{dayName}</h2>
                <p>{date}</p>
            </div>
            {/* Lista de tareas */}
            <div className="days-column-tasks">
                {totalLines.map((task, index) => (
                    <TaskItem
                        key={index}
                        task={task}
                        onCreateTask={onCreateTask} // Handler global pasado desde Dashboard
                        onUpdateTask={onUpdateTask} // Handler global pasado desde Dashboard
                        onDeleteTask={onDeleteTask} // Handler global pasado desde Dashboard
                        onToggleComplete={onToggleComplete}
                        day={dayName}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default DaysColumn;