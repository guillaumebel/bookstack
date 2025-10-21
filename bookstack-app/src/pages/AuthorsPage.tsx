import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
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
import { ADD_AUTHOR } from "../graphql/mutations";
import { GET_AUTHORS } from "../graphql/queries";

// Form validation schema
const authorSchema = z.object({
  name: z
    .string()
    .min(1, "Author name is required")
    .min(2, "Name must be at least 2 characters"),
});

type AuthorFormData = z.infer<typeof authorSchema>;

export const AuthorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_AUTHORS);
  const [addAuthor, { loading: addLoading, error: addError }] = useMutation(
    ADD_AUTHOR,
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
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: "",
    },
  });

  const authors = (data as any)?.authors || [];

  const handleOpenDialog = () => {
    reset();
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    reset();
  };

  const onSubmit = async (formData: AuthorFormData) => {
    try {
      await addAuthor({
        variables: { name: formData.name },
      });
    } catch (error) {
      console.error("Error adding author:", error);
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
      <Alert severity="error">Error loading authors: {error.message}</Alert>
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
        <Typography variant="h4">{t("authors.title")}</Typography>
        <Box ml={10}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            {t("common.add")} {t("books.fields.author")}
          </Button>
        </Box>
      </Box>

      {authors.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t("authors.noAuthors")}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Start by adding your first author.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            {t("common.add")} {t("books.fields.author")}
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
              {authors.map((author: any) => (
                <TableRow key={author.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 2, color: "text.secondary" }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        {author.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {author.createdAt
                      ? new Date(author.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={author.booksCount || 0}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Author Dialog */}
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
            Add New Author
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
                  label="Author Name"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Enter author's full name"
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
              Add Author
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add author"
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
