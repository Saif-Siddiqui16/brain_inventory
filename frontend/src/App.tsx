import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import ExpensePage from './pages/ExpensePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
     <Router>
    <Routes>
      <Route path="/" element={<AuthForm/>} />
       <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/expense/:groupId" element={<ExpensePage />} />
      <Route path="/group/:groupId" element={<GroupDetails />} />
    </Route>
    </Routes>
  </Router>
  )
}

export default App


