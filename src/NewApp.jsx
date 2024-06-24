import { BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./HomePage"
import  usePyodideLoader from './pyodideLoader';
import MigrationToFst from "./MigrationToFst";
import FstToMigration from "./FstToMigration"
import StatisticsPage from "./Statistics";
import { useState } from "react";
export default function NewApp() {
    const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
    const [pythonScript, setPythonScript] = useState('');
    const pyodide = usePyodideLoader(setPythonScript, setIsPyodideLoaded);
    const [resultMatrices, setResultMatrices] = useState([]);
    return (
      <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Fst" element={<MigrationToFst isPyodideLoaded={isPyodideLoaded} 
                 pythonScript={pythonScript} pyodide={pyodide}/>} />
          <Route path="/Migration" element={<FstToMigration isPyodideLoaded={isPyodideLoaded} 
                 pythonScript={pythonScript} pyodide={pyodide} resultMatrices={resultMatrices} 
                 setResultMatrices={setResultMatrices}/>} />   
          <Route path = "/Statistics" element={<StatisticsPage/>} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );

}