import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';
import AdminTopNav from './components/AdminTopNav';

// Public Primary Page (Synchronously bundled for fastest First Contentful Paint)
import Home from './pages/public/Home';

// Code-Split Dynamic Pages (Loaded on-demand only when the user navigates to them)
const BlogDetails = lazy(() => import('./pages/public/BlogDetails'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageClasses = lazy(() => import('./pages/admin/ManageClasses'));
const ManageFeedback = lazy(() => import('./pages/admin/ManageFeedback'));
const ManageBlogs = lazy(() => import('./pages/admin/ManageBlogs'));
const EditTeacher = lazy(() => import('./pages/admin/EditTeacher'));

// Minimal, non-intrusive spinner fallback during route transitions
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[300px] w-full">
    <div className="w-7 h-7 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
  </div>
);

const AdminShell = () => {
  const { darkMode } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      className={`min-h-screen font-['Poppins'] flex transition-colors duration-200 ${
        darkMode
          ? 'dark admin-dark bg-[#12151d] text-slate-100'
          : 'bg-[#ebedef] text-slate-800'
      }`}
    >
      {/* CoreUI Left Dark Sidebar */}
      <AdminSidebar 
        mobileOpen={mobileSidebarOpen} 
        setMobileOpen={setMobileSidebarOpen} 
      />

      {/* Main Content View with Top Nav & Breadcrumbs */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopNav 
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} 
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/classes" element={<ManageClasses />} />
              <Route path="/feedback" element={<ManageFeedback />} />
              <Route path="/blogs" element={<ManageBlogs />} />
              <Route path="/profile" element={<EditTeacher />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminShell />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;