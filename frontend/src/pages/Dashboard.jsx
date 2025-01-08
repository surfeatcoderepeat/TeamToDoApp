/* ======= BLOQUE 1 (IMPORTS) ======= */
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import ProjectHeader from '../components/ProjectHeader';
import DaysColumn from '../components/DaysColumn';
import NavigationArrows from '../components/NavigationArrows';
import ProjectSelectorModal from '../components/ProjectSelectorModal';
import SettingsModal from '../components/SettingsModal';
import CalendarModal from '../components/CalendarModal'; // Modal del calendario
import { getShareLink } from '../services/projectService'; // Servicio para generar el enlace
import '../styles/Dashboard.css';
import { DragDropContext } from '@hello-pangea/dnd';

import {
  getProjects,
  createProject,
  deleteProject,
} from '../services/projectService';
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  patchTask,
} from '../services/taskService';

const Dashboard = () => {
    // Estados de proyectos
    const [projectName, setProjectName] = useState('Nuevo Proyecto');
    const [currentProject, setCurrentProject] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projects, setProjects] = useState([]);
    // Estados de tareas
    const [tasksByDate, setTasksByDate] = useState({});
    // Estados de modales
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    // Otros estados
    const [shareLink, setShareLink] = useState(''); 
    const [visibleDaysCount, setVisibleDaysCount] = useState(3);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loadedDates, setLoadedDates] = useState(new Set());
    

    useEffect(() => {
        // Recuperar el valor guardado en localStorage (si existe) al montar el componente
        const storedVisibleDaysCount = localStorage.getItem('visibleDaysCount');
        if (storedVisibleDaysCount) {
            setVisibleDaysCount(Number(storedVisibleDaysCount)); // Actualiza el estado
        }
    }, [setVisibleDaysCount]); // Solo se ejecuta cuando el modal se monta
    
    const generateVisibleDays = () => {
        const days = [];
        // Calcular los días a mostrar a la derecha (y luego calculamos a la izquierda)
        const halfVisibleDays = Math.floor((visibleDaysCount - 1) / 2);
    
        // Día actual a la izquierda y días a la derecha
        for (let i = 0; i < visibleDaysCount; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + (i - halfVisibleDays)); // i - halfVisibleDays para que el día actual esté a la izquierda
            days.push({
                name: date.toLocaleDateString('es-ES', { weekday: 'long' }),
                date: date.toISOString().split('T')[0], // YYYY-MM-DD
            });
        }
        return days;
    };
    
    

    const visibleDays = generateVisibleDays();

    // Navegación de días
    const handleNavigate = (direction) => {
        const directionValue = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + directionValue);
        setCurrentDate(newDate);
    };

    // Cargar tareas solo para fechas visibles
    const loadTasksForVisibleDays = async () => {
        if (!projectId) return;
    
        const datesToLoad = visibleDays
            .map((day) => day.date)
            .filter((date) => !loadedDates.has(date)); 
    
        if (datesToLoad.length === 0) return;
    
        try {
            const allTasks = await getTasksByProject(projectId);
            const filteredTasks = allTasks.filter((task) =>
                datesToLoad.includes(task.date.split('T')[0])
            );
    
            const tasksGroupedByDate = filteredTasks.reduce((acc, task) => {
                const taskDate = task.date.split('T')[0];
                if (!acc[taskDate]) acc[taskDate] = [];
                acc[taskDate].push(task);
                return acc;
            }, {});
    
            setTasksByDate((prev) => ({ ...prev, ...tasksGroupedByDate }));
            setLoadedDates((prev) => new Set([...prev, ...datesToLoad]));
        } catch (error) {
            console.error('Error al cargar tareas:', error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const projects = await getProjects();
                setProjects(projects);
                if (projects.length > 0) {
                    const project = projects[0];
                    setCurrentProject(project);
                    setProjectName(project.name);
                    setProjectId(project.id);
                }
            } catch (error) {
                console.error('Error al cargar proyectos:', error);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        loadTasksForVisibleDays();
    }, [visibleDays, projectId]);

    const handleSelectProject = async (project) => {
        setCurrentProject(project);
        setProjectName(project.name);
        setProjectId(project.id);
        setTasksByDate([]);
        setLoadedDates(new Set());
        setIsProjectModalOpen(false);
    };

    // Función para crear un nuevo proyecto
    const handleCreateProject = async () => {
        try {
            const newProject = {
                name: 'Nuevo Proyecto', // Aquí puedes colocar el nombre por defecto o permitir que el usuario lo ingrese
            };

            const createdProject = await createProject(newProject); // Llamada al servicio API para crear el proyecto
            setProjects([...projects, createdProject]); // Actualiza el estado local con el nuevo proyecto
            setCurrentProject(createdProject); // Selecciona el proyecto recién creado
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
        }
    };

    // Función para eliminar un proyecto
    const handleDeleteProject = async (projectIdToDelete) => {
        try {
            await deleteProject(projectIdToDelete); // Llamada al servicio API para eliminar el proyecto
            
            const updatedProjects = projects.filter((project) => project.id !== projectIdToDelete); // Actualiza la lista de proyectos
            
            setProjects(updatedProjects);
    
            // Si el proyecto eliminado es el actual o si ya no hay proyectos
            if (currentProject?.id === projectIdToDelete || updatedProjects.length === 0) {
                setCurrentProject(null); // Restablecer el proyecto actual
                setProjectName('Nuevo Proyecto'); // Nombre inicial
                setProjectId(null); // Sin ID de proyecto
                setTasksByDate({});
                setLoadedDates(new set());
            }
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
        }
    };

    const handleCreateTask = async (day, date, index, title) => {
        try {
            if (!projectId) {
                alert('Asigna un nombre al proyecto para comenzar!')
                throw new Error('No hay un proyecto seleccionado.');
            }
            const newTask = await createTask({ date, index, title, projectId });
            setTasksByDate((prev) => ({
                ...prev,
                [date]: [...(prev[date] || []), newTask],
            }));
        } catch (error) {
            console.error('Error al crear la tarea:', error);
        }
    };

    const handleUpdateTask = async (taskId, data) => {
        try {
          // Actualizamos la tarea en el backend
          const updatedTask = await updateTask(projectId, taskId, data);
      
          // Actualizamos el estado local
          setTasksByDate((prev) => {
            // Creamos una copia del estado actual
            const updatedTasksByDate = { ...prev };
      
            // Iteramos sobre las fechas para buscar la tarea a actualizar
            for (const date in updatedTasksByDate) {
              // Si la tarea existe en esta fecha
              updatedTasksByDate[date] = updatedTasksByDate[date].map((task) =>
                task.id === taskId ? updatedTask : task
              );
            }
      
            return updatedTasksByDate;
          });
        } catch (error) {
          console.error("Error al actualizar la tarea:", error);
        }
      };

    const handleToggleComplete = async (taskId, completed) => {
        try {
            // Actualizar la tarea en el backend
            const updatedTask = await patchTask(projectId, taskId, { completed });
    
            // Actualizar el estado local de tasksByDate
            setTasksByDate((prev) => {
                // Crear una copia inmutable del estado anterior
                const updatedTasksByDate = { ...prev };
    
                // Iterar sobre las fechas y modificar la tarea específica
                for (const date in updatedTasksByDate) {
                    updatedTasksByDate[date] = updatedTasksByDate[date].map((task) =>
                        task.id === taskId ? { ...task, completed: updatedTask.completed } : task
                    );
                }
    
                return updatedTasksByDate; // Retornar el nuevo estado
            });
        } catch (error) {
            console.error("Error al actualizar el estado de completado:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const taskToDelete = Object.values(tasksByDate).flat().find(task => task.id === taskId);
            if (!taskToDelete) return;

            await deleteTask(projectId, taskId);
            const taskDate = taskToDelete.date.split('T')[0];
            setTasksByDate((prev) => ({
                ...prev,
                [taskDate]: prev[taskDate].filter((task) => task.id !== taskId),
            }));
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    const handleHomeClick = () => {
        setCurrentDate(new Date()); // Centrar en la fecha actual
    };

    const handleCalendarClick = () => {
        setIsCalendarModalOpen(true); // Abrir el modal de calendario
    };

    const handleShareClick = async () => {
        try {
            const link = await getShareLink(projectId); // Obtener el enlace
            setShareLink(link.share_link);
            
            // Copiar el enlace al portapapeles
            await navigator.clipboard.writeText(link.share_link);
            
            // Mostrar una alerta de confirmación
            alert(`¡Enlace copiado al portapapeles!\n${link.share_link}`);
        } catch (error) {
            console.error('Error al obtener o copiar el enlace de compartir:', error);
            alert('Hubo un problema al copiar el enlace.');
        }
    };    

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
      
        // 1. Si no hay destino o la posición no cambia, no hacemos nada
        if (
          !destination ||
          (destination.droppableId === source.droppableId &&
            destination.index === source.index)
        ) {
          return;
        }
      
        // Columnas (fechas) de origen y destino
        const sourceDate = source.droppableId; // Fecha de origen
        const destDate = destination.droppableId; // Fecha de destino
      
        // Si no existe la lista de origen, salimos
        if (!tasksByDate[sourceDate]) {
          return;
        }
      
        // 2. Copiamos las tareas de la columna de origen
        const sourceTasks = tasksByDate[sourceDate];
      
        // 3. Si la tarea se mueve dentro de la misma columna
        if (sourceDate === destDate) {
          const reorderedTasks = Array.from(sourceTasks); // Creamos una copia del arreglo
          const [movedTask] = reorderedTasks.splice(source.index, 1); // Quitamos la tarea de su posición original
          reorderedTasks.splice(destination.index, 0, movedTask); // Insertamos la tarea en su nueva posición
      
          // Actualizamos solo la columna afectada en el estado
          setTasksByDate((prev) => ({
            ...prev,
            [sourceDate]: reorderedTasks, // Actualizamos solo esta columna
          }));
          return;
        }
      
        // 4. Si la tarea cambia de columna (entre fechas)
        const destTasks = tasksByDate[destDate] || []; // Tareas de destino o arreglo vacío si no existe
      
        // Copias inmutables de las listas de tareas
        const updatedSourceTasks = Array.from(sourceTasks);
        const updatedDestTasks = Array.from(destTasks);
      
        // Quitamos la tarea del origen
        const [movedTask] = updatedSourceTasks.splice(source.index, 1);
      
        // Actualizamos la fecha de la tarea
        movedTask.date = destDate;
      
        // Insertamos la tarea en la nueva columna
        updatedDestTasks.splice(destination.index, 0, movedTask);
      
        // Sincronizamos con el backend para reflejar el cambio de fecha
        try {
          await patchTask(projectId, movedTask.id, { date: destDate });
        } catch (error) {
          console.error("Error actualizando fecha de la tarea:", error);
        }
      
        // Actualizamos solo las columnas afectadas en el estado
        setTasksByDate((prev) => {
          const updatedTasksByDate = { ...prev };
          updatedTasksByDate[sourceDate] = updatedSourceTasks; // Actualizamos la columna de origen
          updatedTasksByDate[destDate] = updatedDestTasks; // Actualizamos la columna de destino
          return updatedTasksByDate;
        });
      };

      const handleFocusTaskInNextColumn = (currentDate) => {      
        const visibleDates = visibleDays.map((day) => day.date);
        const currentIndex = visibleDates.indexOf(currentDate);
        const nextIndex = currentIndex + 1;
      
        if (nextIndex < visibleDates.length) {
          const nextDate = visibleDates[nextIndex];
      
          setTimeout(() => {
            const firstPlaceholderSpan = document.querySelector(
              `.days-column[data-date="${nextDate}"] .days-column-tasks span.task-item-placeholder.empty-task`
            );
      
            if (firstPlaceholderSpan) {
      
              // Simula un clic en el span
              firstPlaceholderSpan.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            } else {
              console.error("No placeholder span found in next column for date:", nextDate);
            }
          }, 0);
        } else {
          console.warn("No next column available. Current date:", currentDate);
        }
      };
  

    return (
        <div className="dashboard-container">
            <Sidebar 
                onSettingsClick={() => setIsSettingsModalOpen(true)} 
                onHomeClick={handleHomeClick} 
                onCalendarClick={handleCalendarClick} 
                onShareClick={handleShareClick} 
            />
            <div className="dashboard-main">
                <ProjectHeader
                    projectId={projectId}
                    projectName={projectName}
                    setProjectName={(newName) => setProjectName(newName)}
                    onMenuClick={() => setIsProjectModalOpen(true)}
                    setProjectId={setProjectId}
                    setCurrentProject={setCurrentProject}
                    setProjects={setProjects}
                />
                <div className="dashboard-content">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <NavigationArrows onNavigate={(direction) => handleNavigate(direction)} />

                        <div className="dashboard-columns">
                        {visibleDays.map((day) => (
                            <DaysColumn
                                key={day.date}         // Usar la fecha como key para evitar conflictos
                                dayName={day.name}
                                date={day.date}
                                tasks={tasksByDate[day.date] || []}
                                maxTasks={20}
                                onCreateTask={handleCreateTask}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                                onToggleComplete={handleToggleComplete}
                                visibleDaysCount={visibleDaysCount}
                                onFocusTaskInNextColumn={handleFocusTaskInNextColumn}
                            />
                        ))}
                        </div>
                    </DragDropContext>
                </div>
            </div>
            {isProjectModalOpen && (
                <ProjectSelectorModal
                    projects={projects}
                    onClose={() => setIsProjectModalOpen(false)} // Cerrar el modal
                    onSelectProject={handleSelectProject} // Seleccionar el proyecto
                    createAndSelectProject={handleCreateProject} // Crear un proyecto nuevo
                    onDeleteProject={handleDeleteProject} // Eliminar un proyecto
                />
            )}
            {isSettingsModalOpen && (
                <SettingsModal
                    visibleDaysCount={visibleDaysCount}
                    setVisibleDaysCount={setVisibleDaysCount}
                    onClose={() => setIsSettingsModalOpen(false)}
                />
            )}
            {isCalendarModalOpen && (
                <CalendarModal
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    onClose={() => setIsCalendarModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
