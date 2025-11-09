// diagnostic.js
export class Diagnostic {
  // ✅ Catálogos accesibles desde otras partes del programa
  static warningCatalog = {
    1133: "Usuario o rol no existe",
    1269: "Privilegios duplicados ignorados",
    1131: "Usuario ya no tiene esos privilegios",
    1874: "Uso de palabra reservada o deprecada",
    1143: "MariaDB no soporta SELECT(col1,col2) en REVOKE"
  };

  static errorCatalog = {
    1141: "No existe un GRANT compatible para hacer REVOKE",
    1049: "Base de datos desconocida",
    1102: "Token no reconocido",
    1396: "No puedes modificar privilegios del usuario actual",
    1227: "Acceso denegado; privilegios insuficientes",
    1142: "Error de sintaxis: privilegio no permitido en REVOKE"
  };

  static info(message) {
    return { type: "info", code: 1000, message };
  }

  static success(message) {
    return { type: "success", code: 0, message };
  }

  static warning(message, code) {
    const finalCode = code || 1133;
    const finalMessage = message || this.warningCatalog[finalCode] || "Advertencia desconocida";
    return { type: "warning", code: finalCode, message: finalMessage };
  }

  static error(message, code) {
    const finalCode = code || 1141;
    const finalMessage = message || this.errorCatalog[finalCode] || "Error desconocido";
    return { type: "error", code: finalCode, message: finalMessage };
  }
}
