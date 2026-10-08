import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';

import Home from './pages/public/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageClasses from './pages/admin/ManageClasses';
import ManageFeedback from './pages/admin/ManageFeedback';
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
                <div className="flex flex-col lg:flex-row bg-[#f8fafc] text-slate-800 min-h-screen font-['Poppins'] selection:bg-indigo-600 selection:text-white">
                  <AdminSidebar />
                  <main className="flex-1 overflow-y-auto lg:max-h-screen bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(99,102,241,0.08),rgba(6,182,212,0.04),transparent)]">
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/classes" element={<ManageClasses />} />
                      <Route path="/feedback" element={<ManageFeedback />} />
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