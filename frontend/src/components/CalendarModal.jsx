import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Usamos la librería react-calendar
import 'react-calendar/dist/Calendar.css'; // Importamos el CSS de react-calendar
import '../styles/CalendarModal.css'; // Importamos el CSS personalizado

const CalendarModal = ({ setCurrentDate, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setCurrentDate(date); // Establecer la fecha seleccionada en el dashboard
        onClose(); // Cerrar el modal inmediatamente después de seleccionar la fecha
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains('calendar-modal')) {
            onClose(); // Cerrar el modal si se hace clic fuera de él
        }
    };

    // Cerrar el modal al presionar Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose(); // Cerrar el modal si se presiona la tecla Escape
            }
        };

        // Añadir el eventListener para la tecla Escape
        document.addEventListener('keydown', handleEscape);

        // Limpiar el eventListener cuando el componente se desmonte
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <div className="calendar-modal" onClick={handleOutsideClick}>
            <div className="calendar-modal-content">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="custom-calendar" // Aplicar clase personalizada al calendario
                />
            </div>
        </div>
    );
};

export default CalendarModal;
