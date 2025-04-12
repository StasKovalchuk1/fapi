import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  onReportAnalysisClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReportAnalysisClick }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };
  
  const handleLogout = () => {
    auth.logout();
    navigate('/login');
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Warehouse Tracker
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleNavigation('/dashboard')}>Dashboard</MenuItem>
              <MenuItem onClick={() => handleNavigation('/map-import')}>Import Map</MenuItem>
              <MenuItem onClick={onReportAnalysisClick}>Analysis</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate('/map-import')}>
              Import Map
            </Button>
            <Button 
              color="inherit" 
              startIcon={<AnalyticsIcon />} 
              onClick={onReportAnalysisClick}
            >
              Analysis
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
