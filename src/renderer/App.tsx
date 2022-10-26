import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import MainPage from './MainPage';
// import LinkForm from './LinkForm';
// import MainHeader from './MainHeader';
// import SideNav from './SideNav';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainPage />
              {/* <MainHeader />
              <LinkForm />
              <SideNav /> */}
            </>
          }
        />
      </Routes>
    </Router>
  );
}
