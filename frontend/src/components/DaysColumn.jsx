import React from 'react';
import TaskItem from './TaskItem';
import '../styles/DaysColumn.css'; // Asegúrate de que el archivo CSS exista y tenga los estilos necesarios

const DaysColumn = ({ dayName, date, tasks, maxTasks, onCreateTask, onUpdateTask, onDeleteTask }) => {
    // Crear líneas vacías si no hay suficientes tareas
    const totalLines = [...tasks];
    while (totalLines.length < maxTasks) {
        totalLines.push({ id: null, title: '', day: dayName });
    }

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
                        onCreateTask={onCreateTask}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        day={dayName}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default DaysColumn;