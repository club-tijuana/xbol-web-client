"use client";

import { ConfirmationNumberOutlined, CreditCardOutlined, ShieldOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Popover, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/store/hooks';
import { openLoginModal } from "@/store/slices/uiSlice";
import { colors } from '@/theme/colors';

import styles from "./Header.module.scss";

interface Props {
    window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'Boletos', 'Vender', 'Cuenta'];

export default function Header(props: Props) {
    const { window } = props;
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const client = useAppSelector(store => store.auth.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const date = new Date();
    const formattedDate = Intl.DateTimeFormat("es-MX", {
        month: 'long',
        year: 'numeric'
    }).format(date);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleGoHome = () => {
        router.push("/");
    }

    const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (client === null) {
            dispatch(openLoginModal());
        }
        else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleCloseAccount = () => {
        setAnchorEl(null);
    };

    const handleMyTicketsRedirect = () => {
        router.push("/account/tickets");
        handleCloseAccount();
    }

    const openAccount = Boolean(anchorEl);
    const idAccount = openAccount ? 'simple-popover' : undefined;
    const isTransparent = pathname === "/" || pathname.startsWith("/event");

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
            <AppBar component="nav" sx={{ backgroundColor: theme => isTransparent ? theme.palette.layout.header : theme.palette.layout.header }}>
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
                                <Tooltip title={client === null ? "Iniciar sesión" : ""}>
                                    <Box>
                                        <IconButton onClick={handleAccountClick} color="primary">
                                            <Image
                                                src="/assets/icons/login.svg"
                                                alt="Login"
                                                width={28.32}
                                                height={31.56}
                                            />
                                        </IconButton>
                                        <Popover
                                            id={idAccount}
                                            open={openAccount}
                                            anchorEl={anchorEl}
                                            onClose={handleCloseAccount}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                            sx={{
                                                "& .MuiPaper-root": {
                                                    borderRadius: 4,
                                                },
                                            }}
                                        >
                                            <Box sx={{
                                                backgroundColor: colors.brand.primary,
                                                display: 'grid',
                                                px: 5,
                                                pb: 4,
                                                pt: 0,
                                                borderRadius: 4
                                            }}
                                                width={287}
                                                justifyItems={'start'}>
                                                <Box justifySelf={'end'}>
                                                    <IconButton onClick={handleCloseAccount} sx={{ position: 'relative', right: -20, top: 15 }}>
                                                        <Image
                                                            src="/assets/icons/login-light.svg"
                                                            alt="Login"
                                                            width={28.32}
                                                            height={31.56}
                                                        />
                                                    </IconButton>
                                                </Box>
                                                <Typography variant='titleMd' color='neutral' mb={3}>
                                                    Mi cuenta
                                                </Typography>
                                                <Typography variant='bodyLg' color='neutral'>
                                                    {client?.firstName} {client?.lastName}
                                                </Typography>
                                                <Typography variant='subtitle2' color='neutral'>
                                                    {client?.username}
                                                </Typography>
                                                <Typography variant='subtitle2' fontWeight={400} color='neutral' sx={{ textTransform: 'capitalize' }}>
                                                    {formattedDate}
                                                </Typography>
                                                <Box mt={3}>
                                                    <Button variant="text" startIcon={<ConfirmationNumberOutlined color='neutral' />} onClick={handleMyTicketsRedirect}>
                                                        <Typography variant='body1' fontWeight={400} color='neutral'>
                                                            Mis tickets
                                                        </Typography>
                                                    </Button>
                                                    <Button variant="text" startIcon={<CreditCardOutlined color='neutral' />}>
                                                        <Typography variant='body1' fontWeight={400} color='neutral'>
                                                            Métodos de pago
                                                        </Typography>
                                                    </Button>
                                                    <Button variant="text" startIcon={<ShieldOutlined color='neutral' />}>
                                                        <Typography variant='body1' fontWeight={400} color='neutral'>
                                                            Privacidad
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Popover>
                                    </Box>
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