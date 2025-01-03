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
    const [projectName, setProjectName] = useState('Nuevo Proyecto');
    const [tasksByDate, setTasksByDate] = useState({});
    const [currentProject, setCurrentProject] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false); // Estado para Calendar Modal
    const [shareLink, setShareLink] = useState(''); // Estado para el enlace de compartir
    const [visibleDaysCount, setVisibleDaysCount] = useState(3);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loadedDates, setLoadedDates] = useState(new Set());
    const [tasks, setTasks] = useState([]);

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
        setTasks([]);
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

    const handleUpdateProjectName = (updatedProject) => {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === updatedProject.id ? updatedProject : project
            )
        );
    };

    // Función para eliminar un proyecto
    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId); // Llamada al servicio API para eliminar el proyecto
            setProjects(projects.filter((project) => project.id !== projectId)); // Actualiza el estado local eliminando el proyecto
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
        }
    };

    const handleCreateTask = async (day, date, index, title) => {
        try {
            if (!projectId) {
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
            const updatedTask = await updateTask(projectId, taskId, data);
            setTasks((prev) =>
                prev.map((task) => (task.id === taskId ? updatedTask : task))
            );
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };

    const handleToggleComplete = async (taskId, completed) => {
        try {
            const updatedTask = await patchTask(projectId, taskId, { completed });
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, completed: updatedTask.completed } : task
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado de completado:', error);
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
                    handleUpdateProjectName={handleUpdateProjectName}
                />
                <div className="dashboard-content">
                    <NavigationArrows
                        onNavigate={(direction) => handleNavigate(direction)}
                    />
                    <div className="dashboard-columns">
                        {visibleDays.map((day, index) => (
                            <DaysColumn
                                key={index}
                                dayName={day.name}
                                date={day.date}
                                tasks={tasksByDate[day.date] || []}
                                maxTasks={20}
                                onCreateTask={handleCreateTask}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                                onToggleComplete={handleToggleComplete}
                                visibleDaysCount={visibleDaysCount}
                            />
                        ))}
                    </div>
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
