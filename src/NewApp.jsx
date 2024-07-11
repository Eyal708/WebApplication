import { BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./HomePage"
import MigrationToFst from "./MigrationToFst";
import FstToMigration from "./FstToMigration"
import StatisticsPage from "./Statistics";
import { useState } from "react";
export default function NewApp() {
    const [resultMatrices, setResultMatrices] = useState([]);
    return (
      <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Fst" element={<MigrationToFst/>} />
          <Route path="/Migration" element={<FstToMigration resultMatrices={resultMatrices} 
                                   setResultMatrices={setResultMatrices}/>}/>   
          <Route path = "/Statistics" element={<StatisticsPage/>} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );

}