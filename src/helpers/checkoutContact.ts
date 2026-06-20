import { parsePhoneNumber } from "react-phone-number-input";

import type { AuthDto } from "@/models/auth.dto";
import type { ClientInfoRequest } from "@/models/requests/client-info-request.dto";

function clean(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function resolveFullName(
  accountInfo: AuthDto | null | undefined,
  clientContact: ClientInfoRequest | null | undefined,
): string {
  const contactFullName = clean(clientContact?.fullName);
  if (contactFullName) {
    return contactFullName;
  }

  const contactNames = `${clean(clientContact?.firstName)} ${clean(clientContact?.lastName)}`.trim();
  if (contactNames) {
    return contactNames;
  }

  return `${clean(accountInfo?.firstName)} ${clean(accountInfo?.lastName)}`.trim();
}

function resolvePhoneNumber(
  accountInfo: AuthDto | null | undefined,
  clientContact: ClientInfoRequest | null | undefined,
): string {
  const contactPhone = clean(clientContact?.phoneNumber);
  if (contactPhone) {
    return contactPhone;
  }

  const accountPhone = clean(accountInfo?.phoneNumber);
  if (!accountPhone) {
    return "";
  }

  if (!accountPhone.startsWith("+")) {
    return accountPhone;
  }

  return parsePhoneNumber(accountPhone)?.nationalNumber ?? accountPhone;
}

export function buildCheckoutClientContact(
  accountInfo: AuthDto | null | undefined,
  clientContact: ClientInfoRequest | null | undefined,
): ClientInfoRequest {
  return {
    id: clientContact?.id ?? accountInfo?.clientId,
    email: clean(clientContact?.email) || clean(accountInfo?.email),
    fullName: resolveFullName(accountInfo, clientContact),
    firstName: clean(clientContact?.firstName) || clean(accountInfo?.firstName),
    lastName: clean(clientContact?.lastName) || clean(accountInfo?.lastName),
    phoneNumber: resolvePhoneNumber(accountInfo, clientContact),
    phoneRegionCodeId: clientContact?.phoneRegionCodeId ?? accountInfo?.phoneRegionCodeId ?? undefined,
    phoneCode: clientContact?.phoneCode ?? accountInfo?.phoneCode ?? undefined,
    phoneIsoCode: clientContact?.phoneIsoCode,
    fullPhone: clientContact?.fullPhone ?? accountInfo?.phoneNumber ?? undefined,
  };
}

export function isCheckoutClientContactComplete(
  contact: ClientInfoRequest,
): boolean {
  return Boolean(
    clean(contact.email)
    && clean(contact.fullName)
    && clean(contact.phoneNumber)
    && contact.phoneRegionCodeId,
  );
}

export function shouldCollectCheckoutContact(
  accountInfo: AuthDto | null | undefined,
  clientContact: ClientInfoRequest | null | undefined,
): boolean {
  return !isCheckoutClientContactComplete(
    buildCheckoutClientContact(accountInfo, clientContact),
  );
}
