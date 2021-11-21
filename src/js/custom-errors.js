export class ConstMissingException extends Error {
  constructor(message, ...params) {
    // Übergibt die verbleibenden Parameter (einschließlich Vendor spezifischer Parameter) dem Error Konstruktor
    super(...params);

    // Behält den richtigen Stack-Trace für die Stelle bei, an der unser Fehler ausgelöst wurde (nur bei V8 verfügbar)
    if (Error.captureStackTrace) Error.captureStackTrace(this, OldBrowserError);

    // Benutzerdefinierte Debugging Informationen
    this.message = message;
    this.name = "ConstMissingException";
  }
}

export class DateError extends Error {
  constructor(message, date, ...params) {
    // Übergibt die verbleibenden Parameter (einschließlich Vendor spezifischer Parameter) dem Error Konstruktor
    super(...params);

    // Behält den richtigen Stack-Trace für die Stelle bei, an der unser Fehler ausgelöst wurde (nur bei V8 verfügbar)
    if (Error.captureStackTrace) Error.captureStackTrace(this, OldBrowserError);

    // Benutzerdefinierte Debugging Informationen
    this.name = "DateError";
    this.message = message;
    this.date = date;
    this.dateStr = new Date(date);
  }
}

export class FileNotFoundError extends Error {
  constructor(xhr, ...params) {
    // Übergibt die verbleibenden Parameter (einschließlich Vendor spezifischer Parameter) dem Error Konstruktor
    super(...params);

    // Behält den richtigen Stack-Trace für die Stelle bei, an der unser Fehler ausgelöst wurde (nur bei V8 verfügbar)
    if (Error.captureStackTrace) Error.captureStackTrace(this, OldBrowserError);

    // Benutzerdefinierte Debugging Informationen
    this.name = "FileNotFoundError";
    this.url = xhr.responseURL;
    this.status = xhr.status;
    this.message = `Loading booking data for '${this.url}' failed.`;
  }
}
