// services/telemetry.ts

export const logAction = (actionType: string, details: string) => {
  const event = {
    timestamp: new Date().toLocaleString(),
    action: actionType,
    details: details
  };
  // Punto 8: Registrar usando console.log 
  console.log(`[TELEMETRÍA]`, event);
};