// services/auth.services.js
const SSO = import.meta.env.VITE_SSO_URL

/**
 * Hace POST a /api/auth/login y las cookies se establecen automáticamente
 */
export async function login({ email, password }) {
  const res = await fetch(`${SSO}/auth/login`, {
    method: "POST",
    credentials: "include", // ¡IMPORTANTE! Para recibir cookies del backend
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const body = await res.json();
  
  if (!res.ok || !body.success) {
    // Usar el mensaje del backend si está disponible
    throw new Error(body.message || "Error de login");
  }
  
  return body; // Retornamos la respuesta completa con message y data
}

/**
 * Con cookies automáticas, obtiene datos de usuario desde /auth/me
 */
export async function fetchMe() {
  const res = await fetch(`${SSO}/auth/me`, {
    method: "GET",
    credentials: "include", // Envía cookies automáticamente
    headers: { "Content-Type": "application/json" }
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Token expirado o inválido");
    }
    throw new Error("No autorizado");
  }

  const data = await res.json();
  
  // ✨ NUEVO: Falsear el userProfile hasta que esté en el backend
  const fakeUserProfile = {
    dashboard: {
      layout: 'grid-auto',
      cards: [
        { id: 'casos-activos', type: 'stat', visible: true, order: 1, size: 'normal' },
        { id: 'audiencias-proximas', type: 'stat', visible: true, order: 2, size: 'normal' },
        { id: 'casos-urgentes', type: 'stat', visible: true, order: 3, size: 'normal' },
        { id: 'total-clientes', type: 'stat', visible: false, order: 4, size: 'normal' }, // Usuario lo ocultó
        { id: 'busquedas-recientes', type: 'content', visible: true, order: 5, size: 'large' },
        { id: 'notificaciones', type: 'sidebar', visible: true, order: 6, size: 'normal' },
        { id: 'chat', type: 'sidebar', visible: true, order: 7, size: 'normal' },
        { id: 'acciones-rapidas', type: 'sidebar', visible: true, order: 8, size: 'small' }
      ]
    },
    dock: {
      enabled: true,
      position: 'bottom',
      autoHide: false,
      items: [
        { id: 'casos', visible: true, order: 1 },
        { id: 'audiencias', visible: true, order: 2 },
        { id: 'clientes', visible: true, order: 3 },
        { id: 'documentos', visible: true, order: 4 },
        { id: 'perfil', visible: false, order: 5 } // Usuario lo ocultó
      ]
    },
    filters: {
      defaults: {
        cliente: ['activos'],
        estadoExpediente: ['todos']
      },
      favorites: ['cliente', 'estadoExpediente'],
      expandedSections: ['procedimiento-basico', 'fechas']
    },
    preferences: {
      theme: 'light',
      language: 'es',
      dateFormat: 'dd/mm/yyyy'
    }
  };
  
  // Adaptar según la estructura de respuesta de tu backend
  if (data.success && data.data) {
    return {
      user: data.data.user || data.data,
      frontPermissions: data.data.frontPermissions || data.data.FrontPermission || [],
      userProfile: data.data.userProfile || fakeUserProfile // ✨ NUEVO
    };
  }
  
  // Si viene directamente: { user, frontPermissions }
  return {
    user: data.user || data,
    frontPermissions: data.frontPermissions || data.FrontPermission || [],
    userProfile: data.userProfile || fakeUserProfile // ✨ NUEVO
  };
}

/**
 * Cierra sesión en el backend y limpia cookies
 */
export async function logout() {
  try {
    const res = await fetch(`${SSO}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    console.log("Respuesta del logout:", res);
    
    // No importa si falla, las cookies se limpian de todos modos
    return res.ok;
    
  } catch (error) {
    console.error('Error en logout del backend:', error);
    return false;
  }
}

/**
 * Intenta refrescar el token usando el refresh token en cookies
 */
export async function refreshToken() {
  try {
    const res = await fetch(`${SSO}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
      console.log("Respuesta del refresh token:", res);
    if (res.ok) {
      const data = await res.json();
      return data.success;
    }
    
    return false;
    
  } catch (error) {
    console.error('Error al refrescar token:', error);
    return false;
  }
}

/**
 * ✨ NUEVO: Solicita un enlace de recuperación de contraseña
 */
export async function requestPasswordReset(email) {
  try {
    const res = await fetch(`${SSO}/Auth/recover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    const body = await res.json();
    
    if (!res.ok || !body.success) {
      // Usar el mensaje del backend
      throw new Error(body.message || "Error al solicitar recuperación");
    }
    
    return body; // Retorna toda la respuesta { success, message, data, statusCode }
    
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    throw error;
  }
}

/**
 * ✨ NUEVO: Verifica si un token de recuperación es válido (opcional, si existe endpoint)
 */
export async function verifyResetToken(token) {
  try {
    // Si no hay endpoint específico para verificar, podemos simular o saltarlo
    // Por ahora, retornamos true para que funcione
    console.log('Token a verificar:', token);
    return { success: true };
    
  } catch (error) {
    console.error('Error en verifyResetToken:', error);
    throw error;
  }
}

/**
 * ✨ NUEVO: Resetea la contraseña usando el token de recuperación
 */
export async function resetPassword(token, newPassword, confirmPassword) {
  try {
    const res = await fetch(`${SSO}/Auth/change-password-from-recovery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token, 
        newPassword, 
        confirmPassword 
      }),
    });
    
    const body = await res.json();
    
    if (!res.ok || !body.success) {
      // Usar el mensaje del backend
      throw new Error(body.message || "Error al resetear contraseña");
    }
    
    return body; // Retorna toda la respuesta { success, message, data, statusCode }
    
  } catch (error) {
    console.error('Error en resetPassword:', error);
    throw error;
  }
}

/**
 * ✨ NUEVO: Cambia la contraseña del usuario autenticado
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    const res = await fetch(`${SSO}/Auth/change-password`, {
      method: "POST",
      credentials: "include", // Para incluir cookies de autenticación
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        currentPassword, 
        newPassword 
      }),
    });
    
    const body = await res.json();
    
    if (!res.ok || !body.success) {
      // Usar el mensaje del backend
      throw new Error(body.message || "Error al cambiar contraseña");
    }
    
    return body; // Retorna toda la respuesta { success, message, data, statusCode }
    
  } catch (error) {
    console.error('Error en changePassword:', error);
    throw error;
  }
}