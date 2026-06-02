import { cert, getApps, initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";

import { publicEnv } from "@/config/env";
import { getFirebaseAdminEnv } from "@/config/serverEnv";

function getAdminCredential() {
  const adminEnv = getFirebaseAdminEnv();

  return cert(JSON.parse(adminEnv.FIREBASE_SERVICE_ACCOUNT_JSON));
}

export function getRootAuth(): Auth {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
      credential: getAdminCredential(),
      projectId: publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

  return getAuth(app);
}
