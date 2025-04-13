// src/lib/errorHandler.js
import toast from 'react-hot-toast'

export const handleError = (error, options = {}) => {
  
  console.log(error);
  
  const defaultMessage = 'Error en la operación'
  const message = error.response?.data?.error?.message  || error.message || defaultMessage
  


  if (!options.silent) {
    toast.error(message, {
      duration: options.duration || 5000,
      id: options.id || error.code // Para evitar duplicados
    })
  }
  
  return {
    message,
    code: error.response?.status || 500,
    isAuthError: error.response?.status === 401 || error.response?.status === 403,
    isValidationError: error.response?.status === 400
  }
}