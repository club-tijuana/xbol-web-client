"use client";

import { Dialog } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { closeLoginModal } from "@/store/slices/uiSlice";
import styles from "./LoginModal.module.scss";
import Image from "next/image";
import { useState } from "react";

export default function LoginModal() {
    const dispatch = useDispatch();
    const open = useSelector((state: RootState) => state.ui.loginModalOpen);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Dialog 
            open={open} 
            onClose={() => dispatch(closeLoginModal())} 
            slotProps={{ paper: { className: styles.modal } }}>
            <div className={styles.content}>
                <div className={styles.topImage}>
                    <Image
                        src="/assets/login-modal.png"
                        alt="Evento"
                        fill
                        className={styles.image}
                    />
                </div>

                <div className={styles.bottomImage}>
                    <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        fill
                        className={styles.logo}
                    />
                </div>

                <h1 className={`textPrimary ${styles.title}`}>
                    Inicia sesión
                </h1>
                
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="email">
                        Correo o número de teléfono
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        required 
                        placeholder="alanaschr@gmail.com"
                        className={`input`}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        required
                        placeholder="**************"
                        className={`input`}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.actionContainer}>
                    <button className={`btnLink ${styles.actionLink}`}>
                        ¿Olvidaste tu contraseña?
                    </button>
                    <button className={`btn btnPrimary ${styles.action}`}>
                        Iniciar sesión
                    </button>
                    <button className={`btn btnPrimaryDark ${styles.action}`}>
                        Crea una cuenta
                    </button>
                </div>
            </div>
        </Dialog>
    );
}