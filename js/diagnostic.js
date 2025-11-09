export class Diagnostic {
  static info(message) {
    return { type: "info", code: 1000, message };
  }

  static success(message) {
    return { type: "success", code: 0, message };
  }

  static warning(message, code) {
    const warningCodes = [1133, 1269, 1131, 1874];
    const randomCode = code || warningCodes[Math.floor(Math.random() * warningCodes.length)];
    return { type: "warning", code: randomCode, message };
  }

  static error(message, code) {
    const errorCodes = [1141, 1049, 1102, 1396, 1227, 1142, 1143];
    const randomCode = code || errorCodes[Math.floor(Math.random() * errorCodes.length)];
    return { type: "error", code: randomCode, message };
  }
}
