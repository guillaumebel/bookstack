import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add as AddIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { ADD_CATEGORY } from "../graphql/mutations";
import { GET_CATEGORIES } from "../graphql/queries";

// Form validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
  const [addCategory, { loading: addLoading, error: addError }] = useMutation(
    ADD_CATEGORY,
    {
      onCompleted: () => {
        handleCloseDialog();
        refetch();
      },
    }
  );

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const categories = (data as any)?.categories || [];

  const handleOpenDialog = () => {
    reset();
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    reset();
  };

  const onSubmit = async (formData: CategoryFormData) => {
    try {
      await addCategory({
        variables: { name: formData.name },
      });
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Error loading categories: {error.message}</Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">{t("categories.title")}</Typography>
        <Box ml={10}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            {t("common.add")} {t("books.fields.category")}
          </Button>
        </Box>
      </Box>

      {categories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CategoryIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t("categories.noCategories")}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Start by adding your first category.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            {t("common.add")} {t("books.fields.category")}
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Books Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category: any) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CategoryIcon sx={{ mr: 2, color: "text.secondary" }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.booksCount || 0}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Category Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Add New Category
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {addError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {addError.message}
              </Alert>
            )}

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="e.g., Science Fiction, Biography, Programming"
                  autoFocus
                />
              )}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={addLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addLoading}
              startIcon={
                addLoading ? <CircularProgress size={20} /> : <AddIcon />
              }
            >
              Add Category
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="secondary"
        aria-label="add category"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "flex", sm: "none" },
        }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
