import MigrationImage from './Images/DNA.jpg';
import FstImage from './Images/Migration.jpg';
import HomePageCard from './HomePageCard';
import LogoHeader from './LogoHeader';
import {fst, rightArrow} from './constants';
import './index.css';
import SideMenu from './SideMenu';

export default function HomePage() {
    return (
      <div className="page">
        <div className="container">
          <SideMenu />
          <LogoHeader />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 
                      'flex-start', gap: '20px' }}>
            <HomePageCard
              link="/FstToMigration" 
              image={MigrationImage} 
              title={fst + " " + rightArrow + " " +  "Migration"} 
              description={"Upload an " + fst + " matrix and get possible corresponding migration matrices."}
            />
            <HomePageCard
              link="/MigrationToFst" 
              image={FstImage} 
              title={"Migration" + " " + rightArrow + " " +  fst} 
              description={"Upload a migration matrix and get the corresponding " + fst + " matrix."} 
            />
          </div>
        </div>
      </div>
    );
}