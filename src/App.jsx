import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';
import AdminTopNav from './components/AdminTopNav';

import Home from './pages/public/Home';
import BlogDetails from './pages/public/BlogDetails';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageClasses from './pages/admin/ManageClasses';
import ManageFeedback from './pages/admin/ManageFeedback';
import ManageBlogs from './pages/admin/ManageBlogs';
import EditTeacher from './pages/admin/EditTeacher';

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
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/classes" element={<ManageClasses />} />
            <Route path="/feedback" element={<ManageFeedback />} />
            <Route path="/blogs" element={<ManageBlogs />} />
            <Route path="/profile" element={<EditTeacher />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;