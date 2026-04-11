"use client";

import { ConfirmationNumberOutlined, CreditCardOutlined, Logout, ShieldOutlined, Star } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Popover, Toolbar, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";

import { formatDate } from '@/helpers/formatDateHelper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from "@/store/slices/authSlice";
import { setTextFilter } from '@/store/slices/eventsFilterSlice';
import { resetState as favouriteResetState } from "@/store/slices/favouriteEventSlice";
import { openLoginModal } from "@/store/slices/uiSlice";
import { colors } from '@/theme/colors';

import styles from "./Header.module.scss";
import SearchInput from './SearchInput/SearchInput';

const drawerWidth = 240;
const navItems = [
    { title: 'Home', redirectUrl: "/" },
    { title: 'Boletos', redirectUrl: "/account/tickets" },
    { title: 'Vender', redirectUrl: "/no-content" },
    { title: 'Cuenta', redirectUrl: "/no-content" }
];

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const client = useAppSelector(store => store.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const date = new Date();
    const formattedDate = formatDate(date, "monthYear");
    const [searchText, setSearchText] = useState("");

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

    const handleRedirect = (redirectUrl?: string) => {
        let url: string = "/";

        if (redirectUrl) {
            url = redirectUrl;
        }

        router.push(url);
        handleCloseAccount();
    }

    const handleLogout = () => {
        if (client === null) {
            return;
        }

        dispatch(logout());
        dispatch(favouriteResetState());
        handleCloseAccount();
        handleGoHome();

        if (pathname === "/") {
            window.location.reload();
        }
    }

    const handleOnFilterEnter = () => {
        dispatch(setTextFilter(searchText));
        router.push("/event");
    }

    const openAccount = Boolean(anchorEl);
    const idAccount = openAccount ? 'simple-popover' : undefined;
    const isTransparent = pathname === "/" || pathname.startsWith("/event");
    const drawer = (
        <Box
            sx={{
                textAlign: 'center',
                backgroundColor: theme => theme.palette.layout.header, height: '100%'
            }}
            pt={3}
            px={2}
        >
            <SearchInput value={searchText} onChange={e => setSearchText(e)} onEnterPress={handleOnFilterEnter} />
            <Divider />
            <List>
                {navItems.map((item) => {
                    if (item.title === "Boletos" && !client) return null;
                    return (
                        <ListItem key={item.title} disablePadding>
                            <ListItemButton
                                sx={{ textAlign: 'center' }}
                                onClick={() => {
                                    handleRedirect(item.redirectUrl);
                                    handleDrawerToggle();
                                }}>
                                <ListItemText primary={item.title} sx={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    const containerW = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box>
            <CssBaseline />
            <AppBar component="nav" sx={{ backgroundColor: theme => isTransparent ? theme.palette.layout.header : theme.palette.layout.header }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', px: { xs: 5, lg: 10, xl: 40 }, py: 2.5 }}>
                    <Grid container columns={12} spacing={2} alignItems="center" sx={{ width: "100%" }}>
                        <Grid size={{ xs: 7, md: 3 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                color="primary"
                                aria-label="open menu"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { md: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box className={styles.logoContainer}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/logo.svg`}
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
                                {navItems.map((item) => {
                                    if ((item.title === "Boletos") && !client) return null;
                                    return (
                                        <Button key={item.title} sx={{ color: '#F0F0F0' }} onClick={() => handleRedirect(item.redirectUrl)}>
                                            <Typography variant='h5' fontWeight={400}>
                                                {item.title}
                                            </Typography>
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Grid>
                        <Grid size={{ md: 3, lg: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <SearchInput value={searchText} onChange={e => setSearchText(e)} onEnterPress={handleOnFilterEnter} />
                        </Grid>
                        <Grid size={{ xs: 5, md: 1, lg: 1 }} justifyItems='right'>
                            <Box>
                                <Box>
                                    <IconButton onClick={handleAccountClick} color="primary">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/login.svg`}
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
                                                        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/login-light.svg`}
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
                                            <Typography variant='subtitle2' fontWeight={400} color='neutral'>
                                                {formattedDate}
                                            </Typography>
                                            <Box mt={3}>
                                                <Button variant="text" startIcon={<ConfirmationNumberOutlined color='neutral' />} onClick={() => handleRedirect('/account/tickets')}>
                                                    <Typography variant='body1' fontWeight={400} color='neutral'>
                                                        Mis tickets
                                                    </Typography>
                                                </Button>
                                                <Button variant="text" startIcon={<Star color='neutral' />} onClick={() => handleRedirect('/account/favourites')}>
                                                    <Typography variant='body1' fontWeight={400} color='neutral'>
                                                        Mis Favoritos
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
                                                {client !== null &&
                                                    <Button variant="text" startIcon={<Logout color='neutral' />} onClick={handleLogout}>
                                                        <Typography variant='body1' fontWeight={400} color='neutral'>
                                                            Cerrar sesión
                                                        </Typography>
                                                    </Button>
                                                }
                                            </Box>
                                        </Box>
                                    </Popover>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={containerW}
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