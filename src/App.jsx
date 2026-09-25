import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';

import Home from './pages/public/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageClasses from './pages/admin/ManageClasses';
import EditTeacher from './pages/admin/EditTeacher';
import ViewInquiries from './pages/admin/ViewInquiries';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <div className="flex bg-[#070913] text-slate-100 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
                  <AdminSidebar />
                  <main className="flex-1 overflow-y-auto max-h-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/classes" element={<ManageClasses />} />
                      <Route path="/profile" element={<EditTeacher />} />
                      <Route path="/inquiries" element={<ViewInquiries />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;