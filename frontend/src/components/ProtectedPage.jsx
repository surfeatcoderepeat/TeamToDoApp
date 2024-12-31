import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api'; // Asegúrate de configurar axios aquí

const ProtectedPage = ({ children }) => {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const validateToken = async () => {
            const accessToken = localStorage.getItem('access');
            if (!accessToken) {
                setIsValid(false); // No hay token, redirigir
                return;
            }

            try {
                // Verificar el token con el backend
                await api.post('/auth/validate-token/', { token: accessToken });
                setIsValid(true); // Token válido
            } catch (error) {
                console.error('Token inválido o expirado:', error);
                setIsValid(false); // Token inválido, redirigir
            }
        };

        validateToken();
    }, []);

    // Mientras se valida el token, muestra un indicador de carga
    if (isValid === null) {
        return <div>Validando autenticación...</div>;
    }

    // Si el token no es válido, redirige al inicio de sesión
    if (!isValid) {
        return <Navigate to="/" />;
    }

    // Si el token es válido, muestra la página protegida
    return <>{children}</>;
};

export default ProtectedPage;