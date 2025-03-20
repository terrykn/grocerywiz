import React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const pages = [
    { name: 'Saved Recipes', path: '/savedrecipes' },
    { name: 'Grocery List', path: '/grocerylist' },
];

export default function Navbar() {
    const [anchorNav, setAnchorNav] = React.useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleOpenNavMenu = (event) => {
        setAnchorNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorNav(null);
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('userEmail');
            navigate('/');
        }).catch((error) => {
            console.error("Error during logout:", error);
        });
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleCloseNavMenu();
    };

    return (
        <AppBar position='static' sx={{ boxShadow: 0 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <a
                        onClick={() => handleNavigate('/home')}
                        style={{ fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'row' }}
                    >
                        <img src="/logo512.png" style={{ width: 28, height: 28 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ ml: 1 }}
                        >
                            GroceryWiz
                        </Typography>
                    </a>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleNavigate(page.path)}
                                style={{ fontWeight: 600, color: 'white' }} 
                            >
                                {page.name}
                            </Button>
                        ))}
                        <Button 
                            style={{ fontWeight: 600, color: 'white' }} 
                            onClick={handleLogout} 
                        >
                            Sign Out
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem onClick={handleLogout}>
                                <Typography textAlign="center">Sign Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}