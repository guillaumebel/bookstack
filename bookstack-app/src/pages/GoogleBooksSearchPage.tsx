import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import {
  CloudDownload as ImportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  GridLegacy as Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GoogleBookCard } from "../components/GoogleBookCard";
import { IMPORT_BOOK_FROM_GOOGLE } from "../graphql/mutations";
import { GET_BOOKS, SEARCH_GOOGLE_BOOKS } from "../graphql/queries";
import { useDebounce } from "../hooks/useDebounce";
import type {
  GetBooksQueryResponse,
  GoogleBookItem,
  GoogleBooksResponse,
  SearchGoogleBooksQueryResponse,
} from "../types/graphql";

export const GoogleBooksSearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [importedBooks, setImportedBooks] = useState<Set<string>>(new Set());
  const [importingBooks, setImportingBooks] = useState<Set<string>>(new Set());

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Get existing books to check for duplicates
  const { data: existingBooksData } =
    useQuery<GetBooksQueryResponse>(GET_BOOKS);

  // Search Google Books
  const [
    searchGoogleBooks,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useLazyQuery<SearchGoogleBooksQueryResponse>(SEARCH_GOOGLE_BOOKS);

  // Import mutation
  const [importBookFromGoogle] = useMutation(IMPORT_BOOK_FROM_GOOGLE, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  // Perform search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const query = authorFilter
        ? `${debouncedSearchTerm} inauthor:${authorFilter}`
        : debouncedSearchTerm;

      searchGoogleBooks({
        variables: {
          query,
          maxResults: 20,
        },
      });
    }
  }, [debouncedSearchTerm, authorFilter, searchGoogleBooks]);

  // Check if book already exists in catalog
  const isBookAlreadyImported = useCallback(
    (googleBookId: string) => {
      if (!existingBooksData?.books) return false;
      return existingBooksData.books.some(
        (book: any) => book.googleBooksId === googleBookId
      );
    },
    [existingBooksData]
  );

  // Handle individual book import
  const handleImportBook = async (googleBookId: string) => {
    if (
      isBookAlreadyImported(googleBookId) ||
      importingBooks.has(googleBookId)
    ) {
      return;
    }

    setImportingBooks((prev) => new Set([...prev, googleBookId]));

    try {
      await importBookFromGoogle({
        variables: { googleBooksId: googleBookId },
      });

      setImportedBooks((prev) => new Set([...prev, googleBookId]));
      setSelectedBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(googleBookId);
        return newSet;
      });
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImportingBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(googleBookId);
        return newSet;
      });
    }
  };

  // Handle batch import
  const handleBatchImport = async () => {
    const booksToImport = Array.from(selectedBooks).filter(
      (id) => !isBookAlreadyImported(id) && !importingBooks.has(id)
    );

    for (const bookId of booksToImport) {
      await handleImportBook(bookId);
    }
  };

  // Toggle book selection
  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  // Select all books on current page
  const handleSelectAll = () => {
    if (!searchData?.searchGoogleBooks?.items) return;

    const availableBooks = searchData.searchGoogleBooks.items.filter(
      (book: GoogleBookItem) => !isBookAlreadyImported(book.id)
    );

    const allSelected = availableBooks.every((book: GoogleBookItem) =>
      selectedBooks.has(book.id)
    );

    if (allSelected) {
      // Deselect all
      setSelectedBooks((prev) => {
        const newSet = new Set(prev);
        availableBooks.forEach((book: GoogleBookItem) =>
          newSet.delete(book.id)
        );
        return newSet;
      });
    } else {
      // Select all available
      setSelectedBooks((prev) => {
        const newSet = new Set(prev);
        availableBooks.forEach((book: GoogleBookItem) => newSet.add(book.id));
        return newSet;
      });
    }
  };

  const searchResults = searchData?.searchGoogleBooks as
    | GoogleBooksResponse
    | undefined;
  const hasResults =
    searchResults && searchResults.items && searchResults.items.length > 0;
  const selectedCount = selectedBooks.size;
  const availableToImportCount =
    searchResults?.items?.filter((book) => !isBookAlreadyImported(book.id))
      .length || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("import.title")}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("import.searchLabel")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
              placeholder={t("import.searchPlaceholder")}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("import.authorFilter")}
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder={t("import.authorFilterPlaceholder")}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box display="flex" flexDirection="column" gap={1}>
              {hasResults && availableToImportCount > 0 && (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleSelectAll}
                    size="small"
                  >
                    {selectedCount === availableToImportCount
                      ? t("import.deselectAll")
                      : t("import.selectAll")}
                  </Button>
                  {selectedCount > 0 && (
                    <Button
                      variant="contained"
                      onClick={handleBatchImport}
                      startIcon={<ImportIcon />}
                      size="small"
                      disabled={importingBooks.size > 0}
                    >
                      {t("import.importSelected")} ({selectedCount})
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        {searchLoading && <LinearProgress sx={{ mt: 2 }} />}

        {searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t("import.searchError")}: {searchError.message}
          </Alert>
        )}

        {hasResults && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t("import.resultsCount", {
                total: searchResults.totalItems,
                showing: searchResults.items.length,
                available: availableToImportCount,
              })}
            </Typography>
          </Box>
        )}
      </Paper>

      {hasResults && (
        <Grid container spacing={2}>
          {searchResults.items.map((book: GoogleBookItem) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <GoogleBookCard
                book={book}
                isSelected={selectedBooks.has(book.id)}
                isAlreadyImported={isBookAlreadyImported(book.id)}
                isImporting={importingBooks.has(book.id)}
                isImported={importedBooks.has(book.id)}
                onToggleSelection={() => toggleBookSelection(book.id)}
                onImport={() => handleImportBook(book.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!searchLoading && !hasResults && debouncedSearchTerm && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {t("import.noResults")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("import.tryDifferentSearch")}
          </Typography>
        </Paper>
      )}

      {!debouncedSearchTerm && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {t("import.getStarted")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("import.searchInstructions")}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
