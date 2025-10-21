import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { ThemeToggle } from "../components/common/ThemeToggle";

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "password";

    if (data.username === adminUsername && data.password === adminPassword) {
      localStorage.setItem("isAuthenticated", "true");
      onLogin();
    } else {
      setError(t("login.invalidCredentials"));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          gap: 1,
        }}
      >
        <LanguageSwitcher />
        <ThemeToggle />
      </Box>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            {t("login.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("login.subtitle")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label={t("common.username")}
              autoComplete="username"
              autoFocus
              {...register("username", {
                required: t("login.usernameRequired"),
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label={t("common.password")}
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password", {
                required: t("login.passwordRequired"),
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("common.login")}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
              width: "100%",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t("login.defaultCredentials")}
              <br />
              {t("login.defaultUsername")}
              <br />
              {t("login.defaultPassword")}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
