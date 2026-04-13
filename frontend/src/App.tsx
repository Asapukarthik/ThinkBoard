import { Route, Routes, Navigate } from "react-router";
import { useEffect, FC } from "react";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MediaLibraryPage from "./pages/MediaLibraryPage";
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from "./store/useAuthStore";

const App: FC = () => {
  const { theme, initTheme } = useThemeStore();
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-base-100 text-base-content transition-colors duration-500 selection:bg-white selection:text-black">
      {theme === "noir" || theme === "dark" ? (
        <div className="fixed inset-0 -z-10 h-full w-full items-center [background:radial-gradient(125%_125%_at_50%_0%,#000_60%,#18181b_100%)] opacity-80" />
      ) : (
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#f4f4f5] [background:radial-gradient(125%_125%_at_50%_0%,#ffffff_60%,#e4e4e7_100%)]" />
      )}
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={user ? <CreatePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/note/:id"
          element={user ? <NoteDetailPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/media"
          element={user ? <MediaLibraryPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
