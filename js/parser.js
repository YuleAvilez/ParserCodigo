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
      this.log(Diagnostic.success(`Aceptado: ${type}`));
      this.pos++;
    } else {
      const msg = `Error sintáctico: se esperaba '${type}' pero se encontró '${this.current().value}'`;
      this.log(Diagnostic.error(msg, 1142));
      throw new Error(msg);
    }
  }

    parse() {
        this.log(Diagnostic.info("Iniciando análisis sintáctico..."));
        this.S();

        if (this.current().type === ";") this.eat(";");
        if (this.current().type !== "$") {
            const msg = `Error: entrada no consumida en '${this.current().value}'`;
            this.log(Diagnostic.error(msg, 1396));
            throw new Error(msg);
        }

        const successMessage = Diagnostic.success("Análisis sintáctico completado correctamente.");
        this.log(successMessage);

        return successMessage;
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
            this.log(Diagnostic.warning("MariaDB no soporta SELECT(col1,col2) en REVOKE", 1143));
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
window.Parser = Parser;
