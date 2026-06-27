"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  loginModalBlockedOnPath,
  shouldCloseLoginModalForBlockedPath,
} from "@/helpers/authUx";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeLoginModal } from "@/store/slices/uiSlice";

const LazyLoginModal = dynamic(() => import("./LoginModal"), {
  ssr: false,
});

export default function LoginModalHost() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const shouldMount = useAppSelector((state) => state.ui.loginModalLoaded);
  const loginModalOpen = useAppSelector((state) => state.ui.loginModalOpen);
  const blockedOnPath = loginModalBlockedOnPath(pathname);

  useEffect(() => {
    if (shouldCloseLoginModalForBlockedPath(pathname, loginModalOpen)) {
      dispatch(closeLoginModal());
    }
  }, [dispatch, loginModalOpen, pathname]);

  return shouldMount && !blockedOnPath ? <LazyLoginModal /> : null;
}
