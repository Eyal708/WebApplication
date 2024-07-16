import MigrationImage from './Images/DNA.jpg';
import FstImage from './Images/Migration.jpg';
import HomePageCard from './HomePageCard';
import LogoHeader from './LogoHeader';
import {fst, rightArrow} from './constants';
import './index.css';
import SideMenu from './SideMenu';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

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
              title={<><InlineMath math="F_{st}"/> {rightArrow} Migration</>}
              description={<>Upload an <InlineMath math="F_{st}"/> matrix and get possible corresponding migration matrices and summary statistics.</>}
            />
            <HomePageCard
              link="/MigrationToFst" 
              image={FstImage} 
              title={<>Migration {rightArrow} <InlineMath math="F_{st}"/></>}
              description={<>Upload a migration matrix and get the corresponding <InlineMath math=" F_{st}"/>  matrix.</>} 
            />
          </div>
        </div>
      </div>
    );
}