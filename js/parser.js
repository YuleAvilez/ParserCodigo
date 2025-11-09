class Parser {
  constructor(tokens, logCallback) {
    this.tokens = tokens;
    this.pos = 0;
    this.log = logCallback;
  }

  current() {
    return this.tokens[this.pos];
  }

  eat(type) {
    if (this.current().type === type) {
      this.log(`[S] Aceptado: ${type}`, "success");
      this.pos++;
    } else {
      const msg = `Error sintáctico: se esperaba '${type}' pero se encontró '${this.current().value}'`;
      this.log(`[E] ${msg}`, "error");
      throw new Error(msg);
    }
  }

  parse() {
    this.log("🔍 Iniciando análisis sintáctico...", "info");
    this.S();
    if (this.current().type === ";") this.eat(";");
    if (this.current().type !== "$") {
      const msg = `Error: entrada no consumida en '${this.current().value}'`;
      this.log(`[E] ${msg}`, "error");
      throw new Error(msg);
    }
    this.log("Análisis sintáctico completado correctamente.", "success");
  }

  S() {
    this.eat("REVOKE");
    this.REST();
  }

  REST() {
    if (this.current().type === "ALL") {
      this.eat("ALL");
      this.eat("PRIVILEGES");
      this.eat(",");
      this.eat("GRANT");
      this.eat("OPTION");
      this.eat("FROM");
      this.USER_LIST();
    } else {
      this.PRIV_ITEMS();
      this.eat("ON");
      this.eat("IDENT");
      this.eat("FROM");
      this.USER_LIST();
    }
  }

  PRIV_ITEMS() {
    this.PRIV_ITEM();
    while (this.current().type === ",") {
      this.eat(",");
      this.PRIV_ITEM();
    }
  }

  PRIV_ITEM() {
    const priv = this.current().value.toUpperCase();
    this.eat("PRIV_TYPE");

    if (this.current().type === "(") {

      if (priv === "SELECT") {
        this.log(`[W] MariaDB NO soporta SELECT(col1,col2) en REVOKE`, "warning");
      }

      this.eat("(");
      this.COLUMN_LIST();
      this.eat(")");
    }
  }

  COLUMN_LIST() {
    this.eat("IDENT");
    while (this.current().type === ",") {
      this.eat(",");
      this.eat("IDENT");
    }
  }

  USER_LIST() {
    this.eat("IDENT");
    while (this.current().type === ",") {
      this.eat(",");
      this.eat("IDENT");
    }
  }
}
