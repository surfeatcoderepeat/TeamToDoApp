import React from 'react';
import Sidebar from '../components/SideBar';
import ProjectHeader from '../components/ProjectHeader';
import DaysColumn from '../components/DaysColumn';
import NavigationArrows from '../components/NavigationArrows';
import '../styles/Dashboard.css'; // Asegúrate de que los estilos estén aplicados

const Dashboard = () => {
    // Datos de prueba
    const projectName = "Nuevo Proyecto";
    const days = [
        { name: "Lunes", date: "01/01/2025", tasks: ["Tarea 1", "Tarea 2"] },
        { name: "Martes", date: "02/01/2025", tasks: ["Tarea 3", "Tarea 4"] },
        { name: "Miércoles", date: "03/01/2025", tasks: ["Tarea 5"] },
    ];

    const handleNavigation = (direction) => {
        alert(`Navegar hacia ${direction === 'left' ? 'izquierda' : 'derecha'}`);
    };

    return (
        <div className="dashboard-container">
            {/* Menú lateral */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="dashboard-main">
                {/* Encabezado del proyecto */}
                <ProjectHeader projectName={projectName} />

                {/* Contenedor de contenido principal */}
                <div className="dashboard-content">
                    {/* Flecha de navegación izquierda */}
                    <NavigationArrows direction="left" className="navigation-arrows left" onNavigate={() => handleNavigation('left')} />

                    {/* Columnas de días */}
                    <div className="dashboard-columns">
                        {days.map((day, index) => (
                            <DaysColumn
                                key={index}
                                dayName={day.name}
                                date={day.date}
                                tasks={day.tasks}
                            />
                        ))}
                    </div>

                    {/* Flecha de navegación derecha */}
                    <NavigationArrows direction="right" className="navigation-arrows right" onNavigate={() => handleNavigation('right')} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;