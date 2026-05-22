const API = '/api/notion';

async function callNotion(action, params = {}) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  });
  return res.json();
}

export async function getStudentByEmail(email) {
  const data = await callNotion('getStudentByEmail', { email });
  return data.student || null;
}

export async function addToWaitlist(nome, email, mensagem) {
  const data = await callNotion('addToWaitlist', { nome, email, mensagem });
  return data.ok || false;
}
