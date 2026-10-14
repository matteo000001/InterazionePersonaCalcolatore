export async function handleApiError(response: Response): Promise<never> {
  const error = await response.json().catch(() => ({
    message: 'Errore inatteso',
  }));
  const message = Array.isArray(error.message)
    ? error.message.join(', ')
    : error.message;

  throw new Error(message ?? 'Errore inatteso');
}
