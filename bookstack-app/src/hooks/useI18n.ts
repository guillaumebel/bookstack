import { useTranslation } from 'react-i18next';

/**
 * Custom hook that provides common translation utilities
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  /**
   * Get current language code
   */
  const currentLanguage = i18n.language;

  /**
   * Check if current language is RTL
   */
  const isRTL = ['ar', 'he', 'fa'].includes(currentLanguage);

  /**
   * Change language programmatically
   */
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  /**
   * Common translation patterns
   */
  const common = {
    // Actions
    add: () => t('common.add'),
    edit: () => t('common.edit'),
    delete: () => t('common.delete'),
    save: () => t('common.save'),
    cancel: () => t('common.cancel'),
    login: () => t('common.login'),
    logout: () => t('common.logout'),
    
    // States
    loading: () => t('common.loading'),
    error: () => t('common.error'),
    success: () => t('common.success'),
    
    // Navigation
    dashboard: () => t('navigation.dashboard'),
    books: () => t('navigation.books'),
    authors: () => t('navigation.authors'),
    categories: () => t('navigation.categories'),
  };

  /**
   * Book-related translations
   */
  const books = {
    title: () => t('books.title'),
    addBook: () => t('books.addBook'),
    editBook: () => t('books.editBook'),
    noBooks: () => t('books.noBooks'),
    deleteConfirm: () => t('books.deleteConfirm'),
    
    fields: {
      title: () => t('books.fields.title'),
      author: () => t('books.fields.author'),
      category: () => t('books.fields.category'),
      isbn: () => t('books.fields.isbn'),
      description: () => t('books.fields.description'),
      publishedDate: () => t('books.fields.publishedDate'),
      pageCount: () => t('books.fields.pageCount'),
      price: () => t('books.fields.price'),
    },
  };

  return {
    t,
    currentLanguage,
    isRTL,
    changeLanguage,
    common,
    books,
  };
};