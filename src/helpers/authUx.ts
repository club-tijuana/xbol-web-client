import { getPhoneAuthIdentifier } from "./authIdentifier.ts";

export const AUTH_SMS_RESEND_COOLDOWN_SECONDS = 30;

export function getSmsResendLabel(remainingSeconds: number): string {
  return remainingSeconds > 0
    ? `Reenviar código (${remainingSeconds}s)`
    : "Reenviar código";
}

export function getPhoneLoginPrimaryActionLabel(hasSmsConfirmation: boolean): string {
  return hasSmsConfirmation ? "Continuar" : "Enviar código";
}

export function getPhoneLoginTitle(isPhoneFlow: boolean): string {
  return isPhoneFlow ? "Accede o crea tu cuenta" : "Inicia sesión";
}

export function shouldResetPhoneCodeForIdentifierChange(
  currentValue: string,
  nextValue: string,
  countryCode: string,
): boolean {
  return getPhoneAuthIdentifier(currentValue, countryCode)
    !== getPhoneAuthIdentifier(nextValue, countryCode);
}

export function loginModalBlockedOnPath(pathname: string | null | undefined): boolean {
  return pathname === "/register" || pathname?.startsWith("/register/") === true;
}

export function shouldCloseLoginModalForBlockedPath(
  pathname: string | null | undefined,
  loginModalOpen: boolean,
): boolean {
  return loginModalOpen && loginModalBlockedOnPath(pathname);
}
