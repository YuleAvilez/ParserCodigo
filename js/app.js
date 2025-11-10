
const collectedDiagnostics = [];

function logMessage(diag) {
  const baseMessage = diag.message.replace(/^Línea \d+: /, "");

  const exists = collectedDiagnostics.some(
    d => d.code === diag.code && d.message.replace(/^Línea \d+: /, "") === baseMessage
  );
  if (exists) return;

  collectedDiagnostics.push(diag);

  const consoleOut = document.getElementById("console-output");
  const div = document.createElement("div");
  div.textContent = `[${diag.code}] ${diag.message}`;
  div.classList.add("log", diag.type);
  consoleOut.appendChild(div);
  consoleOut.scrollTop = consoleOut.scrollHeight;
}


function renderErrorTable(diags) {
  const table = document.getElementById("errors-table");
  table.innerHTML = "";

  const tableEl = document.createElement("table");
  tableEl.classList.add("error-table");

  const header = document.createElement("tr");
  header.innerHTML = "<th>Código</th><th>Tipo</th><th>Mensaje</th>";
  tableEl.appendChild(header);

  diags.filter(d => d.type !== "info" && d.type !== "success").forEach(d => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${d.code}</td><td>${d.type.toUpperCase()}</td><td>${d.message}</td>`;
    tableEl.appendChild(row);
  });

  table.appendChild(tableEl);
}

function analizar() {
  const input = document.getElementById("input").value.trim();
  const lines = input.split("\n");
  collectedDiagnostics.length = 0;
  document.getElementById("console-output").innerHTML = "";

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.toUpperCase().startsWith("REVOKE")) {
      logMessage(Diagnostic.info(`Analizando línea ${index + 1}: ${trimmed}`));

      try {
        const tokens = lexer(trimmed, logMessage);
        const parser = new Parser(tokens, logMessage);
        parser.parse();

        logMessage(Diagnostic.success(`Línea ${index + 1} válida`));

        if (trimmed.toUpperCase().includes("SELECT(")) {
          logMessage(Diagnostic.warning(
            `Línea ${index + 1}: MariaDB no soporta SELECT(col1,col2) en REVOKE`,
            1143
          ));
        }
      } catch (err) {
        const already = collectedDiagnostics.some(d => d.message === err.message);
        if (!already) logMessage(Diagnostic.error(`Línea ${index + 1}: ${err.message}`, 1141));
      }
    } else {
      logMessage(Diagnostic.info(`Línea ${index + 1} ignorada (no empieza con REVOKE)`));
    }
  });

  renderErrorTable(collectedDiagnostics);
}


// Exponer al window para el botón
window.analizar = analizar;
