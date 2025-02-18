import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute";
import MainPage from "./router/MainPage";
import RecipePage from "./router/RecipePage";
import LoginPage from "./router/LoginPage";
import NotFound from "./router/NotFound";

import Logincom from "./router/LoginCom";
import ProfilePage from "./router/ProfilePage";
import SearchPage from "./router/SearchPage";
import RecipeDetail from "./router/RecipeDetail";
import RecipeEdit from "./router/RecipeEdit";
import Community from "./router/community/Community";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE}>
      <Router>
        <Routes>
          {/* 로그인 없이 접근 가능한 페이지 */}
          <Route path="/budda" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />

          {/* 로그인해야 접근 가능한 페이지 */}
          <Route
            path="/login/com"
            element={
              <ProtectedRoute>
                <Logincom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipe"
            element={
              <ProtectedRoute>
                <RecipePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:googleId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/recipes/edit/:id"
            element={
              <ProtectedRoute>
                <RecipeEdit />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
