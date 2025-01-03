import React from 'react';
import TaskItem from './TaskItem';
import '../styles/DaysColumn.css'; // Asegúrate de que el archivo CSS exista y tenga los estilos necesarios
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatDateToLocal } from '../utils/dateUtils';


const DaysColumn = ({ dayName, date, tasks = [], maxTasks = 20, onCreateTask, onUpdateTask, onDeleteTask, onToggleComplete, visibleDaysCount }) => {
    // Crear líneas vacías si no hay suficientes tareas
    const totalLines = Array.from({ length: maxTasks }, (_, index) => {
        return tasks[index] || { id: null, title: '', day: dayName }; // Si no hay tarea, añade una vacía
    });
    // Calcular el ancho de la columna en función de visibleDaysCount
    const columnWidth = `${100 / visibleDaysCount}%`;
    return (
        <div className="days-column" >
            {/* Encabezado de la columna */}
            <div className="days-column-header">
                <h2>{dayName}</h2>
                <p>{formatDateToLocal(date)}</p>
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
                        date={date}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default DaysColumn;