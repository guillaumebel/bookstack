import {
  Book as BookIcon,
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
  CloudDownload as ImportIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const getMenuItems = (t: (key: string) => string) => [
  { text: t("navigation.dashboard"), icon: <DashboardIcon />, path: "/" },
  { text: t("navigation.books"), icon: <BookIcon />, path: "/books" },
  { text: t("navigation.authors"), icon: <PersonIcon />, path: "/authors" },
  {
    text: t("navigation.categories"),
    icon: <CategoryIcon />,
    path: "/categories",
  },
  {
    text: t("navigation.import"),
    icon: <ImportIcon />,
    path: "/import",
  },
];

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = getMenuItems(t);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t("app.title")}
          </Typography>
          <LanguageSwitcher />
          <ThemeToggle />
          <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
            {t("common.logout")}
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {t("common.menu")}
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          px: 2, // Small horizontal padding
          py: 3, // Vertical padding for content spacing
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ width: "100%", flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};
