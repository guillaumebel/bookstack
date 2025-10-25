import {
  Add as AddIcon,
  Book as BookIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  useDeleteBookMutation,
  useGetBooksQuery,
  type GetBooksQuery,
} from "../graphql/__generated__/types";

export const BooksPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteBookId, setDeleteBookId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation({
    onCompleted: () => {
      refetch();
      setDeleteBookId(null);
    },
    onError: (error: Error) => {
      console.error("Error deleting book:", error);
      setDeleteBookId(null);
    },
  });

  const handleDeleteBook = async (id: number) => {
    if (window.confirm(t("books.deleteConfirm"))) {
      setDeleteBookId(id);
      try {
        await deleteBook({ variables: { id } });
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t("common.loading")}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {t("common.error")}: {error.message}
      </Alert>
    );
  }

  const books = data?.books || [];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">{t("books.title")}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/books/add")}
        >
          {t("books.addBook")}
        </Button>
      </Box>

      {books.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <BookIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t("books.noBooks")}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Start building your catalog by adding your first book.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/books/add")}
            sx={{ mt: 2 }}
          >
            {t("books.addBook")}
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cover</TableCell>
                <TableCell>{t("books.fields.title")}</TableCell>
                <TableCell>{t("books.fields.author")}</TableCell>
                <TableCell>{t("books.fields.category")}</TableCell>
                <TableCell>{t("books.fields.isbn")}</TableCell>
                <TableCell>Language</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books.map((book: GetBooksQuery["books"][0]) => (
                <TableRow key={book.id} hover>
                  <TableCell>
                    <Avatar
                      src={book.thumbnail || undefined}
                      variant="rounded"
                      sx={{ width: 40, height: 56 }}
                    >
                      <BookIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {book.title}
                    </Typography>
                    {book.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 200,
                        }}
                      >
                        {book.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {book.bookAuthors?.map((ba) => (
                      <Chip
                        key={ba.author.id}
                        label={ba.author.name}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {book.bookCategories?.map((bc) => (
                      <Chip
                        key={bc.category.id}
                        label={bc.category.name}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{book.isbn || "-"}</TableCell>
                  <TableCell>{book.language || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/books/edit/${book.id}`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteBook(book.id)}
                      color="error"
                      disabled={deleteBookId === book.id}
                    >
                      {deleteBookId === book.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
