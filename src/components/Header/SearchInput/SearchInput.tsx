"use client";

import { Search } from "@mui/icons-material";

import styles from "./SearchInput.module.scss";
import { SearchInputProps } from "./SearchInput.type";

export default function SearchInput({ value, onChange, onEnterPress }: SearchInputProps) {
    return (
        <div className={styles.inputContainer}>
            <Search
                className={styles.searchIcon}
            />
            <input
                type="text"
                value={value}
                placeholder="Buscar"
                className={styles.search}
                onChange={(e) => onChange ? onChange(e.currentTarget.value) : {}}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onEnterPress?.();
                    }
                }}
            />
        </div>
    );
}
