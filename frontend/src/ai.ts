export async function compararPrioridadeIA(compA: string, compB: string) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  const response = await fetch(`${apiUrl}/api/df/priorizacao/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ componentes: [compA, compB] })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Erro ao chamar a IA');
  }

  return response.json();
}
