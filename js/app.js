import { Diagnostic } from "./diagnostic.js";
import { mariaDBErrorCatalog, renderErrorTable } from "./errors/errorsTable.js";

const collectedDiagnostics = [];

function logMessage(diag) {
  // Evitar duplicados por code+type+message
  const exists = collectedDiagnostics.some(
    d => d.code === diag.code && d.type === diag.type && d.message === diag.message
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

  // reset
  collectedDiagnostics.length = 0;
  document.getElementById("console-output").innerHTML = "";

  try {
    logMessage(Diagnostic.info("Iniciando análisis léxico y sintáctico..."));

    const tokens = lexer(input, (msg, type, code = undefined) => {
      logMessage(Diagnostic[type](msg, code));
    });

    const parser = new Parser(tokens, (msg, type, code = undefined) => {
      logMessage(Diagnostic[type](msg, code));
    });

    parser.parse();

    logMessage(Diagnostic.success("Instrucción válida según gramática REVOKE (MariaDB)"));

    if (input.toUpperCase().includes("SELECT(")) {
      logMessage(Diagnostic.warning("MariaDB no soporta SELECT(col1,col2) en REVOKE", 1143));
    }

  } catch (err) {
    const already = collectedDiagnostics.some(d => d.message === err.message);
    if (!already) {
      logMessage(Diagnostic.error(err.message, 1141));
    }
  } finally {
    const mapped = collectedDiagnostics
      .filter(d => mariaDBErrorCatalog[d.code]) // sólo los que están en el catálogo
      .reduce((acc, curr) => {
        if (!acc.some(item => item.code === curr.code)) {
          acc.push({ code: curr.code, ...mariaDBErrorCatalog[curr.code] });
        }
        return acc;
      }, []);

    renderErrorTable(mapped);
  }
}

document.getElementById("btn-analizar").addEventListener("click", analizar);
