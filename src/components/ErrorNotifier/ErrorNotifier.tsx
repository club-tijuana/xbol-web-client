"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/hooks";
import { showGeneralMessage } from "@/store/slices/uiSlice";

type ErrorNotifierProps = {
    show: boolean;
    errorMessage?: string;
};

export default function ErrorNotifier({ show, errorMessage = "" }: ErrorNotifierProps) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!show) return;

        dispatch(
            showGeneralMessage({
                severity: "error",
                message: errorMessage ?? "Algunos eventos no pudieron cargarse"
            })
        );
    }, [show, dispatch, errorMessage]);

    return null;
}