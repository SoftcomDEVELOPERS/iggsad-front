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
    throw new Error(body.message || "Error de login");
  }
  
  return body; // Retornamos la respuesta completa
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
  
  // Adaptar según la estructura de respuesta de tu backend
  // Asumiendo que viene algo como: { success: true, data: { user, frontPermissions } }
  if (data.success && data.data) {
    return {
      user: data.data.user || data.data,
      frontPermissions: data.data.frontPermissions || data.data.FrontPermission || []
    };
  }
  
  // Si viene directamente: { user, frontPermissions }
  return {
    user: data.user || data,
    frontPermissions: data.frontPermissions || data.FrontPermission || []
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