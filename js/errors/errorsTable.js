export const mariaDBErrorCatalog = {
  1141: { type: "error", message: "No existe un GRANT compatible para hacer REVOKE" },
  1133: { type: "warning", message: "Usuario no existe en MariaDB" },
  1269: { type: "warning", message: "No tienes permisos necesarios para revocar este privilegio" },
  1049: { type: "error",  message: "La base de datos no existe" },
  1102: { type: "error",  message: "Privilegio desconocido para REVOKE" },
  1396: { type: "error", message: "No puedes modificar privilegios del usuario actual (self revoke no permitido)" },
  1227: { type: "error", message: "Acceso denegado, no se pueden alterar privilegios (falta SUPER o GRANT OPTION)" },
  1142: { type: "error", message: "Operación no permitida sobre este objeto (table privilege violation)" },
  1143: { type: "error", message: "Operación no permitida sobre columna (column privilege violation)" },
  1131: { type: "warning", message: "Usuario sin privilegios asignados todavía" },
  1874: { type: "warning", message: "No puedes revocar GRANT OPTION si no existe dicho GRANT en el scope" },
};

export function renderErrorTable(list) {
  const container = document.getElementById("errors-table");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='color:#9ca3af;'>✅ Sin errores detectados</p>";
    return;
  }

  let html = `
  <table border="1" cellpadding="6" 
         style="margin: auto; margin-top:20px; border-collapse: collapse; 
                width:80%; text-align:center; background:#1e293b; color:#e2e8f0;">
    <tr style="background-color:#334155;">
      <th>CODE</th>
      <th>TYPE</th>
      <th>DESCRIPCIÓN</th>
    </tr>
  `;

  for (const e of list) {
    html += `
      <tr style="color:${e.type === "error" ? "#ef4444" : "#eab308"};">
        <td>${e.code}</td>
        <td>${e.type.toUpperCase()}</td>
        <td>${e.message}</td>
      </tr>
    `;
  }

  html += `</table>`;
  container.innerHTML = html;
}
