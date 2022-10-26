import './hyde.css';
import LinkForm from './LinkForm';
import MainHeader from './MainHeader';
import SideNav from './SideNav';

export default function MainPage() {
  return (
    <div className="content">
      <div className="aside-column">
        <SideNav />
      </div>
      <div className="main-column">
        <MainHeader />
        <LinkForm />
      </div>
    </div>
  );
}

