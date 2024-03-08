import LabImage from './Images/GreenbaumLab.jpg';
import MigrationImage from './Images/DNA.jpg';
import FstImage from './Images/Migration.jpg';
import HomePageCard from './HomePageCard';

export default function HomePage() {
    let rightArrow =  "\u2192";
    let fst = "F\u209B\u209C";   
    return (
      <div className="page">
        <div className="container">
          <div className="logo-container">
            <img src={LabImage} alt="Greenbaum Lab" className="logo" />
            <p className="logo-text">By Greenbaum Lab</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <HomePageCard
              link="/Migration" 
              image={MigrationImage} 
              title={fst + " " + rightArrow + " " +  "Migration"} 
              description={"Upload an " + fst + " matrix and get possible corresponding migration matrices"}
            />
            <HomePageCard
              link="/Fst" 
              image={FstImage} 
              title={"Migration" + " " + rightArrow + " " +  fst} 
              description={"Upload a migration matrix and get the corresponding " + fst + " matrix"} 
            />
          </div>
        </div>
        <footer className="footer">Designed by Freepik</footer>
      </div>
    );
}