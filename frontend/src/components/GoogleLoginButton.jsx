import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const navigate = useNavigate()
    const handleSuccess = async (credentialResponse) => {
        try {
            // Limpia tokens viejos antes de procesar el nuevo inicio de sesión
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            const token = credentialResponse.credential;
            const response = await axios.post('/auth/google-login-success/', { token });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            // Después de autenticar correctamente
            navigate('/dashboard');
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
    };

    const handleFailure = (error) => {
        console.error('Error en la autenticación con Google:', error);
    };

    return (
        <GoogleOAuthProvider clientId={"816826852902-a10ito02dqmq3t0puam0aaj4h285kilp.apps.googleusercontent.com"}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;