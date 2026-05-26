"use client";

import { Theme } from '@emotion/react';
import { ConfirmationNumberOutlined, CreditCardOutlined, Logout, MarkEmailReadOutlined, ShieldOutlined, Star } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, CssBaseline, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Popover, SxProps, Toolbar, Typography } from "@mui/material";
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";

import { canUseVerifiedClientFeatures } from '@/helpers/authStateHelper';
import { formatDate } from '@/helpers/formatDateHelper';
import { logout as logoutService } from '@/services/authService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from "@/store/slices/authSlice";
import { setTextFilter } from '@/store/slices/eventsFilterSlice';
import { resetState as favouriteResetState } from "@/store/slices/favouriteEventSlice";
import { openLoginModal } from "@/store/slices/uiSlice";
import { colors } from '@/theme/colors';

import FullWidthSection from '../FullWidthSection/FullWidthSection';

import styles from "./Header.module.scss";
import SearchInput from './SearchInput/SearchInput';

const DRAWER_WIDTH = 240;
const LOGO_WIDTH = 30;
const LOGO_HEIGHT = 30;
const MY_ACCOUNT_POPOVER_WIDTH = 287;

interface NavItem {
    title: string;
    redirectUrl: string;
    requiresAuth?: boolean;
}

const navItems = [
    { title: 'Home', redirectUrl: "/" },
    { title: 'Boletos', redirectUrl: "/account/tickets", requiresAuth: true },
    { title: 'Vender', redirectUrl: "/no-content", requiresAuth: true },
    { title: 'Cuenta', redirectUrl: "/account", requiresAuth: true }
] satisfies NavItem[];

const sxActions: SxProps<Theme> = {
    padding: 0,
    mt: 2
};

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
    const isAuthenticated = client !== null;
    const isVerifiedClient = canUseVerifiedClientFeatures(client);
    const visibleNavItems = navItems.filter(item => !item.requiresAuth || isVerifiedClient);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleGoHome = () => {
        router.push("/");
    }

    const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isAuthenticated) {
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

    const handleLogout = async () => {
        if (!isAuthenticated) {
            return;
        }

        await logoutService();
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
                {visibleNavItems.map((item) => {
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
        <Box sx={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            top: 0
        }}>
            <CssBaseline />
            <FullWidthSection variant='color'>
                <AppBar component="nav" sx={{
                    backgroundColor: theme => isTransparent ? theme.palette.layout.header : theme.palette.layout.header,
                    borderBottomLeftRadius: "4rem",
                    borderBottomRightRadius: "4rem"
                }}>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', px: { xs: 5, lg: 10, xl: 10 }, py: 1 }}>
                        <Grid container columns={12} spacing={2} alignItems="center" sx={{ width: "100%" }}>
                            <Grid size={{ xs: 7, md: 3 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <IconButton
                                    color="primary"
                                    aria-label="open menu"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2, display: { lg: 'none' } }}
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

                            <Grid size={{ md: 3, lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
                                <SearchInput value={searchText} onChange={e => setSearchText(e)} onEnterPress={handleOnFilterEnter} />
                            </Grid>

                            <Grid size={{ md: 8, lg: 5 }} sx={{ display: { xs: 'none', md: 'block' } }} justifyItems='center'>
                                <Box sx={{
                                    display: 'flex',
                                    gap: {
                                        md: 0,
                                        lg: 1,
                                        xl: 4
                                    }
                                }}>
                                    {visibleNavItems.map((item) => {
                                        return (
                                            <Button key={item.title} variant='text' sx={{ color: '#F0F0F0', px: 2 }} onClick={() => handleRedirect(item.redirectUrl)}>
                                                <Typography variant='h5'>
                                                    {item.title}
                                                </Typography>
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 5, md: 1, lg: 1 }} justifyItems='right'>
                                <Box>
                                    <Box>
                                        <IconButton onClick={handleAccountClick} color="primary">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/login-light-outline.svg`}
                                                alt="Login"
                                                width={LOGO_WIDTH}
                                                height={LOGO_HEIGHT}
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
                                                width={MY_ACCOUNT_POPOVER_WIDTH}
                                                justifyItems={'start'}>
                                                <Box justifySelf={'end'}>
                                                    <IconButton onClick={handleCloseAccount} sx={{ position: 'relative', right: -20, top: 15 }}>
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/assets/icons/login-light.svg`}
                                                            alt="Login"
                                                            width={LOGO_WIDTH}
                                                            height={LOGO_HEIGHT}
                                                        />
                                                    </IconButton>
                                                </Box>
                                                <Typography variant='h4' color='neutral' mb={4}>
                                                    Mi cuenta
                                                </Typography>
                                                <Typography variant='subtitle1' color='neutral'>
                                                    {client?.firstName} {client?.lastName}
                                                </Typography>
                                                <Typography variant='subtitle2' color='neutral'>
                                                    {client?.username}
                                                </Typography>
                                                <Typography variant='subtitle1' color='neutral'>
                                                    {formattedDate}
                                                </Typography>
                                                <Box mt={2}>
                                                    {isVerifiedClient &&
                                                        <>
                                                            <Button
                                                                variant="text"
                                                                startIcon={<ConfirmationNumberOutlined color='neutral' />}
                                                                onClick={() => handleRedirect('/account/tickets')}
                                                                sx={sxActions}
                                                            >
                                                                <Typography variant='body1' color='neutral'>
                                                                    Mis tickets
                                                                </Typography>
                                                            </Button>
                                                            <Button
                                                                variant="text"
                                                                startIcon={<Star color='neutral' />}
                                                                onClick={() => handleRedirect('/account/favourites')}
                                                                sx={sxActions}
                                                            >
                                                                <Typography variant='body1' color='neutral'>
                                                                    Mis Favoritos
                                                                </Typography>
                                                            </Button>
                                                            <Button
                                                                variant="text"
                                                                startIcon={<CreditCardOutlined color='neutral' />}
                                                                sx={sxActions}
                                                            >
                                                                <Typography variant='body1' color='neutral'>
                                                                    Métodos de pago
                                                                </Typography>
                                                            </Button>
                                                            <Button
                                                                variant="text"
                                                                startIcon={<ShieldOutlined color='neutral' />}
                                                                sx={sxActions}
                                                            >
                                                                <Typography variant='body1' color='neutral'>
                                                                    Privacidad
                                                                </Typography>
                                                            </Button>
                                                        </>
                                                    }
                                                    {client !== null && !isVerifiedClient &&
                                                        <Button
                                                            variant="text"
                                                            startIcon={<MarkEmailReadOutlined color='neutral' />}
                                                            onClick={() => handleRedirect('/register/verify-email')}
                                                            sx={sxActions}
                                                        >
                                                            <Typography variant='body1' color='neutral'>
                                                                Verificar correo
                                                            </Typography>
                                                        </Button>
                                                    }
                                                    {client !== null &&
                                                        <Button
                                                            variant="text"
                                                            startIcon={<Logout color='neutral' />}
                                                            onClick={handleLogout}
                                                            sx={sxActions}
                                                        >
                                                            <Typography variant='body1' color='neutral'>
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
                            display: { xs: 'block', lg: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                        }}>
                        {drawer}
                    </Drawer>
                </nav>
            </FullWidthSection>
        </Box>
    );
}
