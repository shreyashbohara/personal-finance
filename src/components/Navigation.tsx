import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(_, newValue) => {
          navigate(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction
          label="Metrics"
          value="/"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label="Analytics"
          value="/analytics"
          icon={<AnalyticsIcon />}
        />
        <BottomNavigationAction
          label="Transactions"
          value="/transactions"
          icon={<ReceiptIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation; 