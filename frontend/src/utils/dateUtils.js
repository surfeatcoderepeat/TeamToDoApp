import { format, parseISO } from 'date-fns';

/**
 * Convierte una fecha en formato ISO (YYYY-MM-DD) a formato local
 * @param {string} isoDate - Fecha en formato ISO (YYYY-MM-DD)
 * @param {string} locale - Idioma (opcional, por defecto 'es')
 * @returns {string} Fecha en formato local (ej. "3 de enero de 2025")
 */
export const formatDateToLocal = (isoDate, locale = 'es') => {
  try {
    const date = parseISO(isoDate); // Asegúrate de que la fecha sea válida
    return format(date, 'd-M-yyyy'); // Formato que quieres usar
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return isoDate; // Si falla, retorna la fecha original
  }
};