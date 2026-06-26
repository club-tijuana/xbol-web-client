"use client";

import dynamic from "next/dynamic";

import { useAppSelector } from "@/store/hooks";

const LazyLoginModal = dynamic(() => import("./LoginModal"), {
  ssr: false,
});

export default function LoginModalHost() {
  const shouldMount = useAppSelector((state) => state.ui.loginModalLoaded);

  return shouldMount ? <LazyLoginModal /> : null;
}
