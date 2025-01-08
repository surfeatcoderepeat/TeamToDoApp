import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import '../styles/DaysColumn.css';
import { formatDateToLocal } from '../utils/dateUtils';

const DaysColumn = ({
  dayName,
  date,
  tasks = [],
  maxTasks = 20,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  visibleDaysCount,
  onFocusTaskInNextColumn, // Callback para manejar foco en columna contigua
}) => {
  // Crear líneas vacías si no hay suficientes tareas
  const totalLines = Array.from({ length: maxTasks }, (_, index) => {
    return tasks[index] || { id: null, title: '', day: dayName };
  });

  // Calcular el ancho de la columna en función de visibleDaysCount
  const columnWidth = `${100 / visibleDaysCount}%`;

  // Callback para enfocar la siguiente tarea dentro de la misma columna
  const handleFocusNextTask = (taskIndex) => {  
    const inputToFocus = document.querySelector(
         `.days-column[data-date="${date}"] .days-column-tasks [data-task-index="${taskIndex}"] span`
      );
  
    if (inputToFocus) {  
      if (inputToFocus.tagName === "SPAN") {
        inputToFocus.click(); // Simula un clic para activar la edición
      } else if (inputToFocus.tagName === "INPUT") {
        inputToFocus.focus(); // Enfoca directamente el input
      }
    } else {
      console.error(
        "Element not found for taskIndex:",
        taskIndex,
        "in column:",
        date
      );
    }
  };

  return (
    <div
      className="days-column"
      style={{ width: columnWidth }}
      data-date={date} // Usamos la fecha formateada como identificador único
    >
      {/* Encabezado de la columna */}
      <div className="days-column-header">
        <h2>{dayName}</h2>
        <p>{formatDateToLocal(date)}</p>
      </div>

      {/* Droppable: aquí van las tareas */}
      <Droppable droppableId={date}>
        {(provided, snapshot) => (
          <div
            className="days-column-tasks"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {totalLines.map((task, index) => {
              // Construimos un draggableId único
              const draggableId = task.id
                ? String(task.id)
                : `empty-${date}-${index}`;

              return (
                <Draggable
                  key={draggableId}
                  draggableId={draggableId}
                  index={index}
                  isDragDisabled={!task.id} // Deshabilita arrastre si no hay ID
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      data-task-index={index} // Agregado para identificar índice
                    >
                      <TaskItem
                        task={task}
                        onCreateTask={onCreateTask}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        onToggleComplete={onToggleComplete}
                        day={dayName}
                        date={date}
                        index={index}
                        onFocusNextTask={handleFocusNextTask} // Enfocar tarea inferior
                        onFocusTaskInNextColumn={() =>
                          onFocusTaskInNextColumn(date)
                        } // Enfocar tarea en columna contigua
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}

            {/* PlaceHolder necesario para que el DnD funcione correctamente */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DaysColumn;