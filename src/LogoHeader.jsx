import LabImage from './Images/GreenbaumLab.jpg';
import './index.css';
export default function LogoHeader() {
  return (
        <div className="logo-container">
          <img src={LabImage} alt="Greenbaum Lab" className="logo" />
          <p className="logo-text">By Greenbaum Lab</p>
        </div>
  );
}
