import './stylesheet/alignments.css';
import './stylesheet/textelements.css';
import './stylesheet/theme.css';
import './stylesheet/form-element.css';
import './stylesheet/layout.css';
import './stylesheet/custom-component.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/common/Login';
import Home from './pages/common/Home';
import WriteExam from './pages/user/WriteExam';
import Exams from './pages/admin/Exams';
import Register from './pages/common/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import UserReports from './pages/user/UserReports';
import AdminReports from './pages/admin/AdminReports';

function App() {

  const { loading } = useSelector(state => state.loader);

  return (
    <>
    { loading && <Loader />}
    <BrowserRouter>
      <Routes>
        {/* { common routes } */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        
        {/* { user routes } */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        <Route
          path="/user/write-exam/:id"
          element={
            <ProtectedRoute>
              <WriteExam />
            </ProtectedRoute>
          } />
          <Route
          path="/user/reports"
          element={
            <ProtectedRoute>
              <UserReports />
            </ProtectedRoute>
          } />    

        {/* { admin routes } */}
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          } />
          <Route
          path="/admin/exams/add"
          element={
            <ProtectedRoute>
              <AddEditExam />
            </ProtectedRoute>
          } />
          <Route
          path="/admin/exams/edit/:id"
          element={
            <ProtectedRoute>
              <AddEditExam />
            </ProtectedRoute>
          } />
          <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
