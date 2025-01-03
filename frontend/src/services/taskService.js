import api from './api';

// Listar todas las tareas de un proyecto
export const getTasksByProject = async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/tasks/`);
    return response.data;
};

// Crear una nueva tarea dentro de un proyecto
export const createTask = async ({ date, index, title, projectId }) => {
    try {
        const response = await api.post(`/api/projects/${projectId}/tasks/`, {
            date,
            index,
            title,
        });
        return response.data;
    } catch (error) {
        console.error('Error en createTask:', error);
        throw error;
    }
};

// Obtener detalles de una tarea
export const getTaskDetails = async (projectId, taskId) => {
    const response = await api.get(`/api/projects/${projectId}/tasks/${taskId}/`);
    return response.data;
};

// Actualizar una tarea completa
export const updateTask = async (projectId, taskId, data) => {
    const response = await api.put(`/api/projects/${projectId}/tasks/${taskId}/`, data);
    return response.data;
};

// Editar parcialmente una tarea
export const patchTask = async (projectId, taskId, data) => {
    const response = await api.patch(`/api/projects/${projectId}/tasks/${taskId}/`, data);
    return response.data;
};

// Eliminar una tarea
export const deleteTask = async (projectId, taskId) => {
    const response = await api.delete(`/api/projects/${projectId}/tasks/${taskId}/`);
    return response.data;
};