import { ApolloProvider } from "@apollo/client/react";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { apolloClient } from "./apollo-client";
import { Layout } from "./components/common/Layout";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { AddBookPage } from "./pages/AddBookPage";
import { AuthorsPage } from "./pages/AuthorsPage";
import { BooksPage } from "./pages/BooksPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EditBookPage } from "./pages/EditBookPage";
import { GoogleBooksSearchPage } from "./pages/GoogleBooksSearchPage";
import { LoginPage } from "./pages/LoginPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <ThemeContextProvider>
        <CssBaseline />
        <LoginPage onLogin={handleLogin} />
      </ThemeContextProvider>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeContextProvider>
        <CssBaseline />
        <Router>
          <Layout onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/authors" element={<AuthorsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/import" element={<GoogleBooksSearchPage />} />
              <Route path="/books/add" element={<AddBookPage />} />
              <Route path="/books/edit/:id" element={<EditBookPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeContextProvider>
    </ApolloProvider>
  );
}

export default App;
