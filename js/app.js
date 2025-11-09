// app.js
import { Diagnostic } from "./diagnostic.js";
import { lexer } from "./lexer.js";
import { Parser } from "./parser.js";

const collectedDiagnostics = [];

function logMessage(diag) {
  const exists = collectedDiagnostics.some(
    d => d.code === diag.code && d.message === diag.message
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

export function analizar() {
  const input = document.getElementById("input").value.trim();

  collectedDiagnostics.length = 0;
  document.getElementById("console-output").innerHTML = "";

  try {
    logMessage(Diagnostic.info("Iniciando análisis léxico y sintáctico..."));

    const tokens = lexer(input, logMessage);
    const parser = new Parser(tokens, logMessage);

    parser.parse();

    logMessage(Diagnostic.success("Instrucción válida según gramática REVOKE (MariaDB)"));

    if (input.toUpperCase().includes("SELECT(")) {
      logMessage(Diagnostic.warning("MariaDB no soporta SELECT(col1,col2) en REVOKE", 1143));
    }
  } catch (err) {
    const already = collectedDiagnostics.some(d => d.message === err.message);
    if (!already) logMessage(Diagnostic.error(err.message, 1141));
  } finally {
    renderErrorTable(collectedDiagnostics);
  }
}

function renderErrorTable(diags) {
  const table = document.getElementById("errors-table");
  table.innerHTML = "";

  const tableEl = document.createElement("table");
  tableEl.classList.add("error-table");

  const header = document.createElement("tr");
  header.innerHTML = "<th>Código</th><th>Tipo</th><th>Mensaje</th>";
  tableEl.appendChild(header);

  diags
    .filter(d => d.type !== "info" && d.type !== "success")
    .forEach(d => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${d.code}</td><td>${d.type.toUpperCase()}</td><td>${d.message}</td>`;
      tableEl.appendChild(row);
    });

  table.appendChild(tableEl);
}

document.getElementById("btn-analizar").addEventListener("click", analizar);
