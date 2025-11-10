function lexer(input, logCallback) {
  const tokens = [];

  const words = input
    .replaceAll(",", " , ")
    .replaceAll("(", " ( ")
    .replaceAll(")", " ) ")
    .replaceAll(";", " ; ")
    .split(/\s+/)
    .filter(w => w.length > 0);

  for (let word of words) {
    const upper = word.toUpperCase();
    let token;

    if (["REVOKE", "ON", "FROM", "ALL", "PRIVILEGES", "GRANT", "OPTION"].includes(upper)) {
      token = { type: upper, value: upper };
    } else if (["SELECT", "INSERT", "UPDATE", "DELETE", "EXECUTE", "USAGE"].includes(upper)) {
      token = { type: "PRIV_TYPE", value: upper };
    } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(word)) {
      token = { type: "IDENT", value: word };
    } else if ([",", "(", ")", ";"].includes(word)) {
      token = { type: word, value: word };
    } else {
      logCallback(Diagnostic.error(`Token no reconocido: '${word}'`, 1102));
      throw new Error(`Token no reconocido: '${word}'`);
    }

    logCallback(Diagnostic.info(`Iniciando análisis lexico: ${token.type} (${token.value})`));
    tokens.push(token);
  }

  tokens.push({ type: "$", value: "$" });
  return tokens;
}

window.lexer = lexer;
