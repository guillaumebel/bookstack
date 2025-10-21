import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddEditBookForm } from "../components/AddEditBookForm";

export const AddBookPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/books");
  };

  const handleCancel = () => {
    navigate("/books");
  };

  return (
    <Box py={4}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/books")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{t("books.addBook")}</Typography>
      </Box>

      <AddEditBookForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </Box>
  );
};
