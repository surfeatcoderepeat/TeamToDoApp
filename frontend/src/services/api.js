import axios from 'axios';


// Crear una instancia de axios con la configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 20000, 
    headers: {
        'Content-Type': 'application/json', // Asegura el tipo de contenido por defecto
    },
});

// Función para limpiar tokens y redirigir al login
const clearTokensAndRedirect = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/'; // Redirigir al login
};

// Interceptor de solicitudes: Agregar el access token al encabezado Authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error en la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuestas: Manejar el refresco del token si el servidor responde con un 401
api.interceptors.response.use(
    (response) => response, // Devolver la respuesta directamente si no hay errores
    async (error) => {
        if (error.response?.status === 401) {
            console.log('Token expirado. Intentando refrescar...');
            const refreshToken = localStorage.getItem('refresh');

            if (refreshToken) {
                try {
                    // Intentar refrescar el token
                    const refreshResponse = await api.post('/auth/token/refresh/', {
                        refresh: refreshToken,
                    });
                    const newAccessToken = refreshResponse.data.access;

                    // Actualizar el token de acceso en localStorage
                    localStorage.setItem('access', newAccessToken);

                    // Reintentar la solicitud original con el nuevo token
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    console.error('Error al refrescar el token:', refreshError);
                    clearTokensAndRedirect();
                }
            } else {
                console.warn('No se encontró refresh token. Redirigiendo al login.');
                clearTokensAndRedirect();
            }
        }

        // Manejar otros errores de forma genérica
        console.error('Error en la respuesta del servidor:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;