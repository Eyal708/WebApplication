import LabImage from './Images/GreenbaumLab.jpg';
import './index.css';
export default function LogoHeader() {
  return (
        <div className="logo-container">
          <a href="https://greenbaumlab.com" target="_blank" rel="noopener noreferrer">
            <img src={LabImage} alt="Greenbaum Lab" className="logo" />
          </a>
            <p className="logo-text">By Greenbaum Lab</p>
        </div>
  );
}
