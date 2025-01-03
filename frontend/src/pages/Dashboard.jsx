import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import ProjectHeader from '../components/ProjectHeader';
import DaysColumn from '../components/DaysColumn';
import NavigationArrows from '../components/NavigationArrows';
import ProjectSelectorModal from '../components/ProjectSelectorModal';
import SettingsModal from '../components/SettingsModal';
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
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Estado para el modal de configuración
    const [visibleDaysCount, setVisibleDaysCount] = useState(3); // Controlar días visibles
    const [currentDate, setCurrentDate] = useState(new Date()); // Día actual
    const [loadedDates, setLoadedDates] = useState(new Set()); // Fechas ya cargadas
    const [tasks, setTasks] = useState([]); // Estado de las tareas

    const generateVisibleDays = () => {
        const days = [];
        for (let i = -Math.floor(visibleDaysCount / 2); i <= Math.floor(visibleDaysCount / 2); i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i); // Desplazar días
            days.push({
                name: date.toLocaleDateString('es-ES', { weekday: 'long' }), // Día de la semana
                date: date.toISOString().split('T')[0], // Usar toISOString para obtener YYYY-MM-DD
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

    // Cargar tareas solo para fechas visibles que aún no están cargadas
    const loadTasksForVisibleDays = async () => {
        if (!projectId) return;
    
        const datesToLoad = visibleDays
            .map((day) => day.date)
            .filter((date) => !loadedDates.has(date)); // Fechas aún no cargadas
    
        if (datesToLoad.length === 0) return; // Nada que cargar
    
        try {
            const allTasks = await getTasksByProject(projectId);
    
            // Filtrar tareas por las fechas que necesitamos
            const filteredTasks = allTasks.filter((task) =>
                datesToLoad.includes(task.date.split('T')[0]) // Asegura el formato correcto
            );
    
            // Organizar las tareas por fecha
            const tasksGroupedByDate = filteredTasks.reduce((acc, task) => {
                const taskDate = task.date.split('T')[0]; // Extraer solo la fecha
                if (!acc[taskDate]) acc[taskDate] = [];
                acc[taskDate].push(task);
                return acc;
            }, {});
    
            // Actualizar el estado de tareas y fechas cargadas
            setTasksByDate((prev) => ({ ...prev, ...tasksGroupedByDate }));
            setLoadedDates((prev) => new Set([...prev, ...datesToLoad]));
        } catch (error) {
            console.error('Error al cargar tareas:', error);
        }
    };

    // Cargar tareas iniciales y proyectos
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

    // Cargar tareas al cambiar `visibleDays` o `projectId`
    useEffect(() => {
        loadTasksForVisibleDays();
    }, [visibleDays, projectId]);

    const handleSelectProject = async (project) => {
        setCurrentProject(project);
        setProjectName(project.name);
        setProjectId(project.id);
        setTasks([]); // Limpiar tareas al cambiar de proyecto
        setLoadedDates(new Set()); // Reiniciar fechas cargadas
        setIsProjectModalOpen(false);
    };

    const handleCreateTask = async (day, date, index, title) => {
        try {
            if (!projectId) {
                throw new Error('No hay un proyecto seleccionado.');
            }
            // Crear nueva tarea en el backend
            const newTask = await createTask({
                date: date, // Aquí usamos el parámetro `day` como la fecha específica
                index,
                title,
                projectId,
            });
    
            // Actualizar el estado local con la nueva tarea
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
            // Actualizar el estado local
            const taskDate = taskToDelete.date.split('T')[0];
            setTasksByDate((prev) => ({
                ...prev,
                [taskDate]: prev[taskDate].filter((task) => task.id !== taskId),
            }));
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar onSettingsClick={() => setIsSettingsModalOpen(true)} />
            <div className="dashboard-main">
                <ProjectHeader
                    projectId={projectId}
                    projectName={projectName}
                    setProjectName={(newName) => setProjectName(newName)}
                    onMenuClick={() => setIsProjectModalOpen(true)}
                    setProjectId={setProjectId}
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
                                tasks={tasksByDate[day.date] || []} // Tareas específicas para esta fecha
                                maxTasks={20}
                                onCreateTask={handleCreateTask}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                                onToggleComplete={handleToggleComplete}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {isProjectModalOpen && (
                <ProjectSelectorModal
                    projects={projects}
                    onClose={() => setIsProjectModalOpen(false)}
                    onSelectProject={handleSelectProject}
                />
            )}
            {isSettingsModalOpen && (
                <SettingsModal
                    visibleDaysCount={visibleDaysCount}
                    setVisibleDaysCount={setVisibleDaysCount}
                    onClose={() => setIsSettingsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;