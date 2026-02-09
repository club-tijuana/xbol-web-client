"use client";

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/store/hooks';
import { openLoginModal } from "@/store/slices/uiSlice";

import styles from "./Header.module.scss";

interface Props {
    window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'Boletos', 'Vender', 'Cuenta'];

export default function Header(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const client = useAppSelector(store => store.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleGoHome = () => {
        router.push("/");
    }

    const textInput = (
        <TextField
            variant="outlined"
            placeholder="Buscar"
            sx={{
                backgroundColor: "black",

                width: '100%',

                "& .MuiOutlinedInput-root": {
                    borderRadius: 0,

                    "& fieldset": {
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    },

                    "&:hover fieldset": {
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    },

                    "&.Mui-focused fieldset": {
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                    },
                },

                "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                },

                "& .MuiInputBase-input": {
                    paddingTop: 1.1,
                    paddingBottom: 1.1,
                    paddingLeft: 1,
                    color: "#999",
                },
            }}
        />
    );

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: theme => theme.palette.layout.header, height: '100%' }} pt={3}>
            {textInput}
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} sx={{ color: 'white' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box>
            <CssBaseline />
            <AppBar component="nav" sx={{ backgroundColor: theme => theme.palette.layout.header }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', px: { xs: 5, lg: 10, xl: 40 } }}>
                    <Grid container columns={12} spacing={2} alignItems="center" sx={{ width: "100%" }}>
                        <Grid size={{ xs: 7, md: 3 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                color="inherit"
                                aria-label="open menu"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box className={styles.logoContainer}>
                                <Image
                                    src="/assets/logo.png"
                                    alt="Logo"
                                    fill
                                    className={styles.logo}
                                    onClick={handleGoHome}
                                />
                            </Box>
                        </Grid>
                        <Grid size={5} sx={{ display: { xs: 'none', md: 'block' } }} justifyItems='center'>
                            <Box sx={{
                                display: 'flex',
                                gap: {
                                    md: 1,
                                    lg: 4
                                }
                            }}>
                                {navItems.map((item) => (
                                    <Button key={item} sx={{ color: '#F0F0F0' }}>
                                        <Typography variant='h5' fontWeight={400}>
                                            {item}
                                        </Typography>
                                    </Button>
                                ))}
                            </Box>
                        </Grid>
                        <Grid size={{ md: 3, lg: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            {textInput}
                        </Grid>
                        <Grid size={{ xs: 5, md: 1, lg: 1 }} justifyItems='right'>
                            <Box>
                                <Tooltip title="Iniciar sesión">
                                    <IconButton onClick={() => dispatch(openLoginModal())} color="primary">
                                        <Image
                                            src="/assets/icons/login.svg"
                                            alt="Login"
                                            width={28.32}
                                            height={31.56}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}>
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}