import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { joinProject as joinProjectService } from "../services/projectService"; // Renombramos el import

const JoinProject = () => {
  const { token } = useParams(); // Extraer el token desde la URL
  const navigate = useNavigate(); // Navegación programática

  useEffect(() => {
    // Función para unirse al proyecto
    const joinProject = async () => {
      try {
        // Llamada al servicio para unirse al proyecto
        const response = await joinProjectService(token);
        
        console.log("Unión exitosa:", response.data);

        // Redirigir al dashboard del proyecto
        navigate(`/dashboard`);
      } catch (error) {
        console.error("Error al unirse al proyecto:", error);

        // Mostrar mensaje de error al usuario
        alert("No se pudo unir al proyecto. Inténtalo de nuevo.");
      }
    };

    // Ejecutar la función
    joinProject();
  }, [token, navigate]); // Ejecutar cada vez que cambien estas dependencias

  return (
    <div>
      <h2>Uniéndose al proyecto...</h2>
    </div>
  );
};

export default JoinProject;