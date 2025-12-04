// Utilitário para gerar IDs únicos compatível com todos os navegadores/mobile
export const generateId = (): string => {
  // Tenta usar a API nativa segura se disponível
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback robusto para ambientes onde crypto não está disponível (ex: HTTP local no mobile)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};