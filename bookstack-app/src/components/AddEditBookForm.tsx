import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  useAddBookMutation,
  useGetAuthorsQuery,
  useGetBookByIdQuery,
  useGetCategoriesQuery,
  useUpdateBookMutation,
  type GetAuthorsQuery,
  type GetCategoriesQuery,
} from "../graphql/__generated__/types";

const createBookSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("books.validation.titleRequired")),
    isbn: z.string().optional(),
    description: z.string().optional(),
    publishedDate: z.date().optional(),
    pageCount: z.number().min(1).optional(),
    thumbnail: z.url().optional().or(z.literal("")),
    language: z.string().optional(),
    authorIds: z.array(z.number()).min(1, t("books.validation.authorRequired")),
    categoryIds: z
      .array(z.number())
      .min(1, t("books.validation.categoryRequired")),
  });

type BookFormData = z.infer<ReturnType<typeof createBookSchema>>;

interface AddEditBookFormProps {
  bookId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddEditBookForm: React.FC<AddEditBookFormProps> = ({
  bookId,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const isEditing = !!bookId;
  const [selectedAuthors, setSelectedAuthors] = useState<
    Pick<GetAuthorsQuery["authors"][0], "id" | "name">[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    Pick<GetCategoriesQuery["categories"][0], "id" | "name">[]
  >([]);

  // Create the schema with translations
  const bookSchema = createBookSchema(t);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      isbn: "",
      description: "",
      publishedDate: undefined,
      pageCount: undefined,
      thumbnail: "",
      language: "",
      authorIds: [],
      categoryIds: [],
    },
  });

  // GraphQL queries and mutations
  const { data: authorsData, loading: authorsLoading } = useGetAuthorsQuery();
  const { data: categoriesData, loading: categoriesLoading } =
    useGetCategoriesQuery();
  const { data: bookData, loading: bookLoading } = useGetBookByIdQuery({
    variables: { id: bookId! },
    skip: !isEditing,
  });

  const [addBook, { loading: addLoading, error: addError }] =
    useAddBookMutation();
  const [updateBook, { loading: updateLoading, error: updateError }] =
    useUpdateBookMutation();

  // Populate form when editing
  useEffect(() => {
    if (isEditing && bookData?.bookById) {
      const book = bookData.bookById;

      reset({
        title: book.title || "",
        isbn: book.isbn || "",
        description: book.description || "",
        publishedDate: book.publishedDate
          ? new Date(book.publishedDate)
          : undefined,
        pageCount: book.pageCount || undefined,
        thumbnail: book.thumbnail || "",
        language: book.language || "",
        authorIds: book.bookAuthors?.map((ba) => ba.author.id) || [],
        categoryIds: book.bookCategories?.map((bc) => bc.category.id) || [],
      });

      setSelectedAuthors(book.bookAuthors?.map((ba) => ba.author) || []);
      setSelectedCategories(
        book.bookCategories?.map((bc) => bc.category) || []
      );
    }
  }, [bookData, isEditing, reset]);

  const authors = authorsData?.authors || [];
  const categories = categoriesData?.categories || [];

  const onSubmit = async (data: BookFormData) => {
    try {
      const input = {
        title: data.title,
        isbn: data.isbn || undefined,
        description: data.description || undefined,
        publishedDate: data.publishedDate?.toISOString() || undefined,
        pageCount: data.pageCount || undefined,
        thumbnail: data.thumbnail || undefined,
        language: data.language || undefined,
        authorIds: data.authorIds,
        categoryIds: data.categoryIds,
      };

      if (isEditing) {
        await updateBook({
          variables: { id: bookId, input },
        });
      } else {
        await addBook({
          variables: { input },
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleAuthorChange = (
    _event: React.SyntheticEvent,
    newValue: Pick<GetAuthorsQuery["authors"][0], "id" | "name">[]
  ) => {
    setSelectedAuthors(newValue);
    setValue(
      "authorIds",
      newValue.map((author) => author.id)
    );
    trigger("authorIds");
  };

  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue: Pick<GetCategoriesQuery["categories"][0], "id" | "name">[]
  ) => {
    setSelectedCategories(newValue);
    setValue(
      "categoryIds",
      newValue.map((category) => category.id)
    );
    trigger("categoryIds");
  };

  if (bookLoading || authorsLoading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const loading = addLoading || updateLoading;
  const error = addError || updateError;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {isEditing ? t("books.editBook") : t("books.addBook")}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("books.fields.title")}
                      fullWidth
                      required
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>

              {/* ISBN */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="isbn"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("books.fields.isbn")}
                      fullWidth
                      error={!!errors.isbn}
                      helperText={errors.isbn?.message}
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("books.fields.description")}
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              {/* Published Date */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="publishedDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label={t("books.fields.publishedDate")}
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.publishedDate,
                          helperText: errors.publishedDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Page Count */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="pageCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("books.fields.pageCount")}
                      type="number"
                      fullWidth
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      error={!!errors.pageCount}
                      helperText={errors.pageCount?.message}
                    />
                  )}
                />
              </Grid>

              {/* Language */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("books.fields.language")}
                      fullWidth
                      error={!!errors.language}
                      helperText={errors.language?.message}
                    />
                  )}
                />
              </Grid>

              {/* Thumbnail URL */}
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("books.fields.thumbnail")}
                      fullWidth
                      error={!!errors.thumbnail}
                      helperText={errors.thumbnail?.message}
                    />
                  )}
                />
              </Grid>

              {/* Authors */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="authorIds"
                  control={control}
                  render={() => (
                    <Autocomplete<
                      Pick<GetAuthorsQuery["authors"][0], "id" | "name">,
                      true
                    >
                      multiple
                      options={authors}
                      getOptionLabel={(option) => option.name}
                      value={selectedAuthors}
                      onChange={handleAuthorChange}
                      disablePortal
                      renderTags={(value, getTagProps) =>
                        value.map((option, index: number) => (
                          <Chip
                            variant="outlined"
                            label={option.name}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("books.fields.author")}
                          error={!!errors.authorIds}
                          helperText={errors.authorIds?.message}
                          required={false}
                          inputProps={{
                            ...params.inputProps,
                            required: false,
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Categories */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={() => (
                    <Autocomplete<
                      Pick<GetCategoriesQuery["categories"][0], "id" | "name">,
                      true
                    >
                      multiple
                      options={categories}
                      getOptionLabel={(option) => option.name}
                      value={selectedCategories}
                      onChange={handleCategoryChange}
                      disablePortal
                      renderTags={(value, getTagProps) =>
                        value.map((option, index: number) => (
                          <Chip
                            variant="outlined"
                            label={option.name}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("books.fields.category")}
                          error={!!errors.categoryIds}
                          helperText={errors.categoryIds?.message}
                          required={false}
                          inputProps={{
                            ...params.inputProps,
                            required: false,
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Actions */}
              <Grid size={{ xs: 12 }}>
                <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                  <Button onClick={onCancel} disabled={loading}>
                    {t("common.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : undefined
                    }
                  >
                    {isEditing ? t("books.editBook") : t("books.addBook")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};
