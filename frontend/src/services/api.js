

import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Cambia si el backend está en otra URL
});

// Interceptor de solicitudes: Agregar el access token al encabezado Authorization
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        
        // Agregar el token al encabezado si existe
        if (token) {
            console.log("Incluyendo token en la solicitud:", token);
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log("No se encontró un token de acceso en localStorage.");
        }

        return config;
    },
    (error) => Promise.reject(error) // Manejar errores en las solicitudes
);

// Interceptor de respuestas: Manejar el refresco del token si el servidor responde con un 401
api.interceptors.response.use(
    (response) => response, // Pasar las respuestas exitosas directamente
    async (error) => {
        if (error.response?.status === 401) {
            console.log("Token expirado. Intentando refrescar...");

            const refreshToken = localStorage.getItem('refresh');
            if (refreshToken) {
                try {
                    // Solicitar un nuevo access token al backend
                    const refreshResponse = await axios.post('http://127.0.0.1:8000/auth/token/refresh/', {
                        refresh: refreshToken,
                    });
                    const newAccessToken = refreshResponse.data.access;
                    console.log("New access token:", newAccessToken)

                    // Guardar el nuevo token en localStorage
                    localStorage.setItem('access', newAccessToken);

                    // Reintentar la solicitud original con el nuevo token
                    error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios.request(error.config);
                } catch (refreshError) {
                    console.error("Error al refrescar el token:", refreshError);
                    // Si el refresh también falla, redirigir al login
                    // Limpia el almacenamiento local si no se puede refrescar el token
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/'; // Redirige al inicio de sesión
                }
            } else {
                console.log("No se encontró refresh token. Redirigiendo al login.");
                window.location.href = '/';
            }
        }
        return Promise.reject(error); // Pasar otros errores sin procesar
    }
);

export default api;
