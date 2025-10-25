import {
  CheckCircle as CheckIcon,
  CloudDownload as ImportIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import type { SearchGoogleBooksQuery } from "../graphql/__generated__/types";

type GoogleBookItem = NonNullable<
  SearchGoogleBooksQuery["searchGoogleBooks"]
>["items"][number];

interface GoogleBookCardProps {
  book: GoogleBookItem;
  isSelected: boolean;
  isAlreadyImported: boolean;
  isImporting: boolean;
  isImported: boolean;
  onToggleSelection: () => void;
  onImport: () => void;
}

export const GoogleBookCard: React.FC<GoogleBookCardProps> = ({
  book,
  isSelected,
  isAlreadyImported,
  isImporting,
  isImported,
  onToggleSelection,
  onImport,
}) => {
  const { t } = useTranslation();

  const { volumeInfo } = book;
  const thumbnail =
    volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") || "";
  const authors = volumeInfo.authors?.join(", ") || t("common.unknown");
  const publishedYear = volumeInfo.publishedDate
    ? new Date(volumeInfo.publishedDate).getFullYear()
    : null;

  // Truncate description
  const description = volumeInfo.description || "";
  const shortDescription =
    description.length > 150
      ? description.substring(0, 150) + "..."
      : description;

  // Get ISBN
  const isbn = volumeInfo.industryIdentifiers?.find(
    (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
  )?.identifier;

  const getCardStatus = () => {
    if (isImported) return "imported";
    if (isAlreadyImported) return "duplicate";
    if (isImporting) return "importing";
    return "available";
  };

  const status = getCardStatus();

  const getStatusColor = () => {
    switch (status) {
      case "imported":
        return "success";
      case "duplicate":
        return "warning";
      case "importing":
        return "info";
      default:
        return "primary";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "imported":
        return <CheckIcon />;
      case "duplicate":
        return <WarningIcon />;
      case "importing":
        return <CircularProgress size={20} />;
      default:
        return <ImportIcon />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "imported":
        return t("import.status.imported");
      case "duplicate":
        return t("import.status.duplicate");
      case "importing":
        return t("import.status.importing");
      default:
        return t("import.status.available");
    }
  };

  const canImport = status === "available";
  const canSelect = canImport;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? "primary.main" : "divider",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      {/* Selection Checkbox */}
      {canSelect && (
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
          <Checkbox checked={isSelected} onChange={onToggleSelection} />
        </Box>
      )}

      {/* Status Indicator */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <Tooltip title={getStatusText()}>
          <Chip
            size="small"
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor()}
            variant={status === "available" ? "outlined" : "filled"}
          />
        </Tooltip>
      </Box>

      {/* Book Cover */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: thumbnail ? "transparent" : "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!thumbnail && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", p: 2 }}
          >
            {t("import.noCover")}
          </Typography>
        )}
      </CardMedia>

      {/* Book Details */}
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: "1rem",
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {volumeInfo.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {t("books.fields.author")}: {authors}
        </Typography>

        {publishedYear && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("books.fields.publishedDate")}: {publishedYear}
          </Typography>
        )}

        {volumeInfo.pageCount && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("books.fields.pageCount")}: {volumeInfo.pageCount}
          </Typography>
        )}

        {isbn && (
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            ISBN: {isbn}
          </Typography>
        )}

        {shortDescription && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mt: 1,
            }}
          >
            {shortDescription}
          </Typography>
        )}

        {volumeInfo.categories && volumeInfo.categories.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {volumeInfo.categories.slice(0, 2).map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              ))}
              {volumeInfo.categories.length > 2 && (
                <Chip
                  label={`+${volumeInfo.categories.length - 2}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant={canImport ? "contained" : "outlined"}
          onClick={onImport}
          disabled={!canImport}
          startIcon={getStatusIcon()}
          color={getStatusColor()}
        >
          {getStatusText()}
        </Button>
      </CardActions>
    </Card>
  );
};
