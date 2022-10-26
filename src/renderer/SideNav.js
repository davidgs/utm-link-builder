import './hyde.css';
import StarTree from '../../assets/images/ST_Logo_WhiteYellow.svg';

function SideNav() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <aside className="theme-base-09 sidebar">
      <p />
      <p />
        <a href="https://startree.ai/" target="_blank" rel="noreferrer">
          <img src={StarTree} alt="StarTree Logo" />
        </a>
        <div className="container sidebar-sticky">
          <div className="sidebar-about">
            {/* <h1>Tools:</h1>
            <ul>
              <li>
                <a href="https://sentiment.camunda.com/linker">
                  Link Generator
                </a>{' '}
              </li>
              <li>
                <a href="https://sentiment.camunda.com/">Sentiment Analyzer</a>
              </li>
            </ul> */}
            <p className="lead">A Content Referral Link Generator</p>
            <p className="lead">Brought to you by</p>
            <p>
              <a href="mailto:davidgs@davidgs.com">David G. Simmons</a>
            </p>
          </div>
          <nav>
            <ul className="sidebar-nav">
              <li>
                <a href="https://davidgs.com">Home</a>{' '}
              </li>
              <li>
                <a href="https://github.com/davidgs/"> Github </a>
              </li>
            </ul>
          </nav>
          <p>&copy; David G. Simmons 2022</p>
          <p>All rights reserved</p>
        </div>
      </aside>
    </div>
  );
}

export default SideNav;
