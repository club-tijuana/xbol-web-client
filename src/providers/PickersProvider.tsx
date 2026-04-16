"use client";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

export default function PickersProvider({ children }: { children: React.ReactNode }) {
    return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
}