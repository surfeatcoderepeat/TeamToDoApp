import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import ProjectHeader from '../components/ProjectHeader';
import DaysColumn from '../components/DaysColumn';
import NavigationArrows from '../components/NavigationArrows';
import ProjectSelectorModal from '../components/ProjectSelectorModal';
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
    patchTask
} from '../services/taskService';

const Dashboard = () => {
    const [projectName, setProjectName] = useState('Nuevo Proyecto');
    const [visibleDays] = useState(['Lunes', 'Martes', 'Miércoles']);
    const [tasks, setTasks] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cargar los proyectos iniciales
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
                    await loadTasks(project.id);
                }
            } catch (error) {
                console.error('Error al cargar proyectos:', error);
            }
        };

        loadInitialData();
    }, []);

    // Cargar las tareas del proyecto actual
    const loadTasks = async (projectId) => {
        try {
            const taskList = await getTasksByProject(projectId);
            setTasks(taskList || []); // Asegúrate de que siempre sea un array
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            setTasks([]); // Limpia tareas en caso de error
        }
    };

    // Manejar la selección de un proyecto
    const handleSelectProject = async (project) => {
        setCurrentProject(project);
        setProjectName(project.name);
        setProjectId(project.id);
        console.log('ProjectId:', project.id)
        try {
            await loadTasks(project.id); // Carga las tareas del proyecto seleccionado
        } catch (error) {
            console.error('Error al cambiar de proyecto:', error);
        }
        setIsModalOpen(false); // Cierra el modal
    };

    // Manejar la eliminación de un proyecto
    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId);
            setProjects((prev) => prev.filter((project) => project.id !== projectId));

            // Si el proyecto actual fue eliminado, restablece el estado
            if (currentProject?.id === projectId) {
                setCurrentProject(null);
                setProjectName('Nuevo Proyecto');
                setProjectId(null);
                setTasks([]);
            }
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
        }
    };

    // Crear y seleccionar un nuevo proyecto
    const createAndSelectProject = async () => {
        try {
            const newProject = await createProject({ name: 'Nuevo Proyecto' });
            setProjects((prev) => [...prev, newProject]);
            setCurrentProject(newProject);
            setProjectName(newProject.name);
            setProjectId(newProject.id);
            setTasks([]); // Limpia las tareas al crear un nuevo proyecto
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
        }
    };

    // Manejar la creación de una nueva tarea
    const handleCreateTask = async (day, index, title) => {
        try {
            if (!projectId) {
                throw new Error('No hay un proyecto seleccionado.');
            }
            const newTask = await createTask({
                day,
                index,
                title,
                projectId, // Asociar la tarea al proyecto actual
            });
            setTasks((prev) => [...prev, newTask]);
            console.log(`Tarea creada: ${newTask.title}`);
        } catch (error) {
            console.error('Error al crear la tarea:', error);
        }
    };

    // Manejar la actualización de una tarea existente
    const handleUpdateTask = async (taskId, data) => {
        try {
            const updatedTask = await updateTask(projectId, taskId, data);
            setTasks((prev) =>
                prev.map((task) => (task.id === taskId ? updatedTask : task))
            );
            console.log(`Tarea actualizada: ${updatedTask.title}`);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };

    const handleToggleComplete = async (taskId, completed) => {
        try {
            if (!projectId) {
                throw new Error('No hay un proyecto seleccionado.');
            }
    
            // Envía la actualización al backend
            const updatedTask = await patchTask(projectId, taskId, { completed });
    
            // Actualiza el estado local de las tareas
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, completed: updatedTask.completed } : task
                )
            );
    
            console.log(`Tarea actualizada: ${updatedTask.title}, completada: ${updatedTask.completed}`);
        } catch (error) {
            console.error('Error al actualizar el estado de completado:', error);
        }
    };

    // Manejar la eliminación de una tarea
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(projectId, taskId);
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-main">
                <ProjectHeader
                    projectId={projectId}
                    projectName={projectName}
                    setProjectName={(newName) => setProjectName(newName)}
                    onMenuClick={() => setIsModalOpen(true)}
                    setProjectId={setProjectId}
                />
                <div className="dashboard-content">
                    <NavigationArrows onNavigate={() => {}} />
                    <div className="dashboard-columns">
                        {visibleDays.map((day, index) => (
                            <DaysColumn
                                key={index}
                                dayName={day}
                                date={`2025-01-0${index + 1}`}
                                tasks={tasks.filter((task) => {
                                    // Normaliza el formato de task.date (si es necesario)
                                    const taskDate = typeof task.date === 'string' ? task.date.split('T')[0] : task.date;
                                    return taskDate === `2025-01-0${index + 1}`;
                                })}
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
            {isModalOpen && (
                <ProjectSelectorModal
                    projects={projects}
                    onClose={() => setIsModalOpen(false)}
                    onSelectProject={handleSelectProject}
                    createAndSelectProject={createAndSelectProject}
                    onDeleteProject={handleDeleteProject}
                />
            )}
        </div>
    );
};

export default Dashboard;