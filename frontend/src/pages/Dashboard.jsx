import React, { useState } from 'react';
import Sidebar from '../components/SideBar';
import ProjectHeader from '../components/ProjectHeader';
import DaysColumn from '../components/DaysColumn';
import NavigationArrows from '../components/NavigationArrows';
import '../styles/Dashboard.css';

const Dashboard = () => {
    // Estado del nombre del proyecto
    const [projectName, setProjectName] = useState('Nuevo Proyecto');

    // Días visibles en el dashboard
    const visibleDays = ['Lunes', 'Martes', 'Miércoles'];

    // Número máximo de líneas por día
    const maxTasksPerDay = 20;

    // Estado de tareas
    const [tasks, setTasks] = useState([]);

    // Manejar la creación de una nueva tarea
    const handleCreateTask = (day, index, title) => {
        setTasks([
            ...tasks,
            {
                id: `${day}-${index}`, // ID único basado en el día y el índice
                title: title || '', // Inicialmente vacío
                day,
            },
        ]);
    };

    // Manejar la edición de una tarea
    const handleUpdateTask = (id, newTitle) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, title: newTitle } : task)));
    };

    // Manejar la eliminación de una tarea
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Manejar la navegación entre días (simulada)
    const handleNavigation = (direction) => {
        alert(`Navegar hacia ${direction === 'left' ? 'izquierda' : 'derecha'}`);
    };

    return (
        <div className="dashboard-container">
            {/* Menú lateral */}
            <Sidebar />

            <div className="dashboard-main">
                {/* Encabezado del proyecto */}
                <ProjectHeader projectName={projectName} setProjectName={setProjectName} />

                {/* Área principal del dashboard */}
                <div className="dashboard-content">
                    {/* Flechas de navegación */}
                    <NavigationArrows onNavigate={handleNavigation} />

                    {/* Columnas de días */}
                    <div className="dashboard-columns">
                        {visibleDays.map((day, index) => (
                            <DaysColumn
                                key={index}
                                dayName={day}
                                date={`0${index + 1}/01/2025`} // Fecha simulada
                                tasks={tasks.filter((task) => task.day === day)} // Tareas por día
                                maxTasks={maxTasksPerDay}
                                onCreateTask={handleCreateTask}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;