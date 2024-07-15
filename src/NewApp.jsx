import { BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./HomePage"
import MigrationToFst from "./MigrationToFst";
import FstToMigration from "./FstToMigration"
import StatisticsPage from "./Statistics";
import AboutPage from "./AboutPage";
import { useState } from "react";
export default function NewApp() {
    const [resultMatrices, setResultMatrices] = useState([]);
    return (
      <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/MigrationToFst" element={<MigrationToFst/>} />
          <Route path="/FstToMigration" element={<FstToMigration resultMatrices={resultMatrices} 
                                   setResultMatrices={setResultMatrices}/>}/>   
          <Route path = "/Statistics" element={<StatisticsPage/>} /> 
          <Route path = "/About" element={<AboutPage/>} /> 

        </Routes>
      </BrowserRouter>
    </div>
  );

}