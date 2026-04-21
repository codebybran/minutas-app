class AIService {

  async suggestMinuta(userQuery) {
    return {
      suggested: null,
      message: 'Módulo de IA no configurado aún. Próximamente disponible.',
      query: userQuery
    };
  }

  async chat(message, context) {
    return {
      reply: 'El asistente legal estará disponible pronto.',
      message
    };
  }
}

module.exports = new AIService();