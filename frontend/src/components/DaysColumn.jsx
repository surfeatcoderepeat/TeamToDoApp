import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import '../styles/DaysColumn.css'; // Asegúrate de que el archivo CSS exista y tenga los estilos necesarios
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
}) => {
  // Crear líneas vacías si no hay suficientes tareas
  const totalLines = Array.from({ length: maxTasks }, (_, index) => {
    return tasks[index] || { id: null, title: '', day: dayName };
  });

  // Calcular el ancho de la columna en función de visibleDaysCount
  const columnWidth = `${100 / visibleDaysCount}%`;

  return (
    <div className="days-column" style={{ width: columnWidth }}>
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
                  // Deshabilita el arrastre si no hay un ID real (línea vacía)
                  isDragDisabled={!task.id}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
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
