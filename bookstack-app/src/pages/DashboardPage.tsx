import { useQuery } from "@apollo/client/react";
import {
  Add as AddIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GET_AUTHORS, GET_BOOKS, GET_CATEGORIES } from "../graphql/queries";
import type {
  Book,
  GetAuthorsQueryResponse,
  GetBooksQueryResponse,
  GetCategoriesQueryResponse,
} from "../types/graphql";

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch data for dashboard statistics
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery<GetBooksQueryResponse>(GET_BOOKS);
  const {
    data: authorsData,
    loading: authorsLoading,
    error: authorsError,
  } = useQuery<GetAuthorsQueryResponse>(GET_AUTHORS);
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<GetCategoriesQueryResponse>(GET_CATEGORIES);

  // Loading state for any of the queries
  const isLoading = booksLoading || authorsLoading || categoriesLoading;

  // Error state
  const hasError = booksError || authorsError || categoriesError;

  // Calculate statistics
  const totalBooks = booksData?.books?.length || 0;
  const totalAuthors = authorsData?.authors?.length || 0;
  const totalCategories = categoriesData?.categories?.length || 0;

  // Get recent books (last 5 books sorted by creation date)
  const recentBooks = booksData?.books
    ? [...booksData.books]
        .sort(
          (a: Book, b: Book) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
    : [];

  const stats = [
    {
      title: t("dashboard.totalBooks"),
      value: isLoading ? "..." : totalBooks.toString(),
      icon: <BookIcon />,
      color: "#1976d2",
    },
    {
      title: t("dashboard.totalAuthors"),
      value: isLoading ? "..." : totalAuthors.toString(),
      icon: <PersonIcon />,
      color: "#388e3c",
    },
    {
      title: t("dashboard.totalCategories"),
      value: isLoading ? "..." : totalCategories.toString(),
      icon: <CategoryIcon />,
      color: "#f57c00",
    },
  ];

  const quickActions = [
    { title: t("books.addBook"), path: "/books/add", icon: <AddIcon /> },
    {
      title: t("import.title"),
      path: "/import",
      icon: <BookIcon />,
    },
    {
      title: `${t("common.edit")} ${t("navigation.authors")}`,
      path: "/authors",
      icon: <PersonIcon />,
    },
    {
      title: `${t("common.edit")} ${t("navigation.categories")}`,
      path: "/categories",
      icon: <CategoryIcon />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("dashboard.title")}
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      bgcolor: stat.color,
                      color: "white",
                      borderRadius: 1,
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onClick={() => navigate(action.path)}
                sx={{ height: 60 }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t("dashboard.recentBooks")}
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress />
          </Box>
        ) : hasError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t("common.error")}:{" "}
            {booksError?.message ||
              authorsError?.message ||
              categoriesError?.message}
          </Alert>
        ) : recentBooks.length > 0 ? (
          <List>
            {recentBooks.map((book: Book) => (
              <ListItem
                key={book.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                  borderRadius: 1,
                  mb: 1,
                }}
                onClick={() => navigate(`/books/edit/${book.id}`)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={book.thumbnail}
                    variant="rounded"
                    sx={{ width: 56, height: 80, mr: 2 }}
                  >
                    <BookIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={book.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {book.bookAuthors
                          ?.map((ba) => ba.author.name)
                          .join(", ") || t("common.unknown")}
                      </Typography>
                      {book.bookCategories?.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {book.bookCategories.slice(0, 3).map((bc) => (
                            <Chip
                              key={bc.category.id}
                              label={bc.category.name}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {t("dashboard.addedOn")}{" "}
                        {new Date(book.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t("dashboard.noBooksYet")}
          </Typography>
        )}

        {recentBooks.length > 0 && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button variant="outlined" onClick={() => navigate("/books")}>
              {t("dashboard.viewAllBooks")}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
