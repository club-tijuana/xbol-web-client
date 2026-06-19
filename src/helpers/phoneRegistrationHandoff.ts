import type { AuthDto } from "@/models/auth.dto";

export function getVerifiedPhoneRegistrationUser(
  user: AuthDto | null | undefined,
  phoneNumber: string | null | undefined,
): AuthDto | null {
  if (
    !phoneNumber
    || user?.onboardingStatus !== "unlinked"
    || user.phoneNumber !== phoneNumber
  ) {
    return null;
  }

  return user;
}
