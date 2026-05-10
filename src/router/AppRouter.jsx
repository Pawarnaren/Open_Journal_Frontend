import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from '../components/Loader';
import ProtectedRoute from './ProtectedRoute';
import RouteLogger from './RouteLogger';

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));
const CreateBlog = lazy(() => import('../pages/CreateBlog'));
const EditBlog = lazy(() => import('../pages/EditBlog'));
const MyBlogs = lazy(() => import('../pages/MyBlogs'));
const MyJournal = lazy(() => import('../pages/MyJournal'));
const JournalEntry = lazy(() => import('../pages/JournalEntry'));
const CreateJournal = lazy(() => import('../pages/CreateJournal'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRouter = () => (
  <BrowserRouter>
    <RouteLogger />
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* Protected */}
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-blog/:id"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-blogs"
          element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-journal"
          element={
            <ProtectedRoute>
              <MyJournal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal/new"
          element={
            <ProtectedRoute>
              <CreateJournal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal/:id"
          element={
            <ProtectedRoute>
              <JournalEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
