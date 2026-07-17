type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

function emit(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === "ERROR") {
    console.error(line);
    return;
  }
  if (level === "WARN") {
    console.warn(line);
    return;
  }
  // DEBUG / INFO: structured stream without bare console.log
  console.info(line);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void =>
    emit("DEBUG", message, context),
  info: (message: string, context?: Record<string, unknown>): void =>
    emit("INFO", message, context),
  warn: (message: string, context?: Record<string, unknown>): void =>
    emit("WARN", message, context),
  error: (message: string, context?: Record<string, unknown>): void =>
    emit("ERROR", message, context),
};
