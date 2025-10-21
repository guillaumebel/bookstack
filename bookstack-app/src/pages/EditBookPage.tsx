import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { AddEditBookForm } from "../components/AddEditBookForm";

export const EditBookPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const bookId = id ? parseInt(id, 10) : undefined;

  const handleSuccess = () => {
    navigate("/books");
  };

  const handleCancel = () => {
    navigate("/books");
  };

  if (!bookId) {
    navigate("/books");
    return null;
  }

  return (
    <Box py={4}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/books")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{t("books.editBook")}</Typography>
      </Box>

      <AddEditBookForm
        bookId={bookId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Box>
  );
};
