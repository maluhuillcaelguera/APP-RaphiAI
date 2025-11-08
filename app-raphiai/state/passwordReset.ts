let recoveryEmail: string | null = null;
let resetToken: string | null = null;

export function setRecoveryEmail(email: string) {
  recoveryEmail = email;
}

export function getRecoveryEmail(): string | null {
  return recoveryEmail;
}

export function clearRecoveryEmail() {
  recoveryEmail = null;
}

export function setResetToken(token: string) {
  resetToken = token;
}

export function getResetToken(): string | null {
  return resetToken;
}

export function clearResetToken() {
  resetToken = null;
}


