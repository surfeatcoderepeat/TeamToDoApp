import api from './api';

// Listar todos los proyectos del usuario autenticado
export const getProjects = async () => {
    const response = await api.get('/api/projects/');
    return response.data;
};

// Crear un nuevo proyecto
export const createProject = async (data) => {
    const response = await api.post('/api/projects/', data);
    return response.data;
};

// Obtener detalles de un proyecto
export const getProjectDetails = async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/`);
    return response.data;
};

// Actualizar un proyecto
export const updateProject = async (projectId, data) => {
    const response = await api.put(`/api/projects/${projectId}/`, data);
    return response.data;
};

// Editar parcialmente un proyecto
export const patchProject = async (projectId, data) => {
    const response = await api.patch(`/api/projects/${projectId}/`, data);
    return response.data;
};

// Eliminar un proyecto
export const deleteProject = async (projectId) => {
    const response = await api.delete(`/api/projects/${projectId}/`);
    return response.data;
};

// Compartir un proyecto (obtener un enlace compartido)
export const getShareLink = async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/share/`);
    return response.data;
};

// Unirse a un proyecto mediante un token
export const joinProject = async (token) => {
    const response = await api.post(`/api/join-project/${token}/`);
    return response.data;
};

// Agregar un participante a un proyecto
export const addParticipant = async (projectId, userId) => {
    const response = await api.post(`/api/projects/${projectId}/participants/`, { user_id: userId });
    return response.data;
};

// Eliminar un participante de un proyecto
export const removeParticipant = async (projectId, userId) => {
    const response = await api.delete(`/api/projects/${projectId}/participants/`, { data: { user_id: userId } });
    return response.data;
};