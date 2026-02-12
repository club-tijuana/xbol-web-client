"use client";

import { Search } from "@mui/icons-material";

import styles from "./SearchInput.module.scss";

export default function SearchInput() {
    return (
        <div className={styles.inputContainer}>
            <Search
                className={styles.searchIcon}
            />
            <input
                type="text"
                placeholder="Buscar"
                className={styles.search}
            />
        </div>
    );
}
