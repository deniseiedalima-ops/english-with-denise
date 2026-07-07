const API = '/api/index';

export async function getStudentByEmail(email) {
  const res = await fetch(`${API}?route=notion&email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.student || null;
}

export async function addToWaitlist(nome, email, mensagem) {
  // Waitlist not implemented in new API — return false gracefully
  return false;
}
