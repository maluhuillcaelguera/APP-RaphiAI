import { getCurrentUser } from '@/state/auth';
import { Platform } from 'react-native';

export type DiagnosisResponse = {
  predicted_class: string;
  confidence?: number;
  [k: string]: any;
};

export const API_BASE_URL = "https://raphiai-test-671e26b4626a.herokuapp.com";

async function authHeader(): Promise<Record<string, string>> {
  const auth = await getCurrentUser();
  if (!auth?.token) return {};
  return { Authorization: `Bearer ${auth.token}` };
}

async function request(input: string, init?: RequestInit): Promise<Response> {
  const url = `${API_BASE_URL}${input.startsWith('/') ? '' : '/'}${input}`;
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...(init?.headers as any),
  };
  return fetch(url, { ...init, headers });
}

async function getErrorMessage(resp: Response, fallback: string): Promise<string> {
  let msg = fallback;
  try {
    const text = await resp.text();
    if (!text) return msg;
    try {
      const json = JSON.parse(text);
      if (json && typeof json === 'object' && 'detail' in json && typeof json.detail === 'string') {
        return json.detail as string;
      }
    } catch {}
    return text;
  } catch {
    return msg;
  }
}

export type PredictApiResponse = {
  id: string;
  name: string;
  title: string;
  image: string;
  date: string;
  meta: any;
  confidence?: number;
  top_k?: Array<{ class: string; confidence: number }>;
};

export async function uploadImageForDiagnosis(fileUri: string, fileName?: string, mimeType?: string): Promise<DiagnosisResponse> {
  const resolvedName = fileName ?? (fileUri.split('/').pop() ?? 'image.jpg');
  const resolvedType = mimeType ?? 'image/jpeg';
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const fileResp = await fetch(fileUri);
    const blob = await fileResp.blob();
    formData.append('file', blob, resolvedName);
  } else {
    formData.append('file', { uri: fileUri, name: resolvedName, type: resolvedType } as any);
  }

  const response = await request('/predict', {
    method: 'POST',
    headers: { ...(await authHeader()) },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const payload = await response.json();
        const err: any = new Error(payload?.detail?.message || 'La imagen no es válida para análisis.');
        err.status = 422;
        err.payload = payload;
        throw err;
      } catch {
        const err: any = new Error('La imagen no es válida para análisis.');
        err.status = 422;
        throw err;
      }
    }
    const msg = await getErrorMessage(response, 'Upload failed');
    const err: any = new Error(msg);
    err.status = response.status;
    throw err;
  }

  const json = (await response.json()) as PredictApiResponse;
  return { id: json.id, predicted_class: json.name, confidence: json.confidence, raw: json } as DiagnosisResponse;
}

// ===== Auth =====
export async function apiRegister(email: string, password: string): Promise<{ token: string }> {
  const resp = await request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, 'Registro fallido'));
    err.status = resp.status;
    throw err;
  }
  return (await resp.json()) as { token: string };
}

export async function apiLogin(email: string, password: string): Promise<{ token: string }> {
  const resp = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, resp.status === 401 ? 'Credenciales inválidas' : 'No se pudo iniciar sesión'));
    err.status = resp.status;
    throw err;
  }

  return (await resp.json()) as { token: string };
}

// ===== Password Recovery =====
export async function apiPasswordForgot(email: string): Promise<{ message: string }> {
  const resp = await request('/auth/password/forgot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, 'No se pudo solicitar el código de recuperación'));
    err.status = resp.status;
    throw err;
  }
  return (await resp.json()) as { message: string };
}

export type VerifyCodeResponse = { valid: boolean; message: string; reset_token: string | null };
export async function apiPasswordVerify(email: string, code: string): Promise<VerifyCodeResponse> {
  const resp = await request('/auth/password/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, 'No se pudo verificar el código'));
    err.status = resp.status;
    throw err;
  }
  return (await resp.json()) as VerifyCodeResponse;
}

export async function apiPasswordReset(reset_token: string, new_password: string): Promise<{ message: string }> {
  const resp = await request('/auth/password/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reset_token, new_password }),
  });
  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, 'No se pudo actualizar la contraseña'));
    err.status = resp.status;
    throw err;
  }
  return (await resp.json()) as { message: string };
}

// ===== Projects =====
export type ApiProject = { id: string; name: string; description?: string; date: string };

export async function apiListProjects(): Promise<ApiProject[]> {
  const resp = await request('/projects', { headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error((await resp.text()) || 'Error al listar proyectos');
  return (await resp.json()) as ApiProject[];
}

export async function apiCreateProject(name: string, description?: string): Promise<{ id: string }> {
  const resp = await request('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ name, description }),
  });
  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, 'No se pudo crear el proyecto'));
    err.status = resp.status;
    throw err;
  }
  const json = await resp.json();
  return { id: json.id } as { id: string };
}

export async function apiGetProject(projectId: string): Promise<ApiProject> {
  const resp = await request(`/projects/${projectId}`, { headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error((await resp.text()) || 'Proyecto no encontrado');
  return (await resp.json()) as ApiProject;
}

export async function apiUpdateProject(projectId: string, updates: { name: string; description?: string }): Promise<void> {
  const resp = await request(`/projects/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify(updates),
  });
  if (!resp.ok) {
    const err: any = new Error(await getErrorMessage(resp, 'No se pudo actualizar el proyecto'));
    err.status = resp.status;
    throw err;
  }
}

export async function apiDeleteProject(projectId: string): Promise<void> {
  const resp = await request(`/projects/${projectId}`, { method: 'DELETE', headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo eliminar el proyecto'));
}

// ===== Histories =====
export type ApiHistoryItem = { diagnosis_id: string; date: string; name: string; image: string };
export async function apiListHistories(): Promise<ApiHistoryItem[]> {
  const resp = await request('/histories', { headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo obtener el historial'));
  return (await resp.json()) as ApiHistoryItem[];
}

// ===== Diagnoses =====
export async function apiGetDiagnosisDetail(diagnosisId: string): Promise<PredictApiResponse> {
  const resp = await request(`/diagnoses/${diagnosisId}/detail`, { headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo obtener el detalle'));
  return (await resp.json()) as PredictApiResponse;
}

export async function apiUpdateDiagnosis(diagnosisId: string, payload: { project_id?: string; description?: string }): Promise<void> {
  const resp = await request(`/diagnoses/${diagnosisId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo actualizar el diagnóstico'));
}

export async function apiDeleteDiagnosis(diagnosisId: string): Promise<void> {
  const resp = await request(`/diagnoses/${diagnosisId}`, { method: 'DELETE', headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo eliminar el diagnóstico'));
}

export async function apiAssignDiagnosis(payload: { diagnosis_id: string; project_id: string; description: string }): Promise<void> {  
  const resp = await request('/diagnoses/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo asignar el diagnóstico'));
}

export type ApiProjectDiagnosis = {
  id: string;
  name: string;
  description?: string | null;
  date: string;
  image: string | null;
};

export async function apiListProjectDiagnoses(projectId: string): Promise<ApiProjectDiagnosis[]> {
  const resp = await request(`/projects/${projectId}/diagnoses`, { headers: { ...(await authHeader()) } });
  if (!resp.ok) throw new Error(await getErrorMessage(resp, 'No se pudo listar diagnósticos'));
  return (await resp.json()) as ApiProjectDiagnosis[];
}


