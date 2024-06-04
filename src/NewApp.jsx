import { BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./HomePage"
import  usePyodideLoader from './pyodideLoader';
import MigrationToFst from "./MigrationToFst";
import FstToMigration from "./FstToMigration"
import { useState } from "react";
export default function NewApp() {
    const [isPyodideLoaded, setIsPyodideLoaded] = useState(false);
    const [pythonScript, setPythonScript] = useState('');
    usePyodideLoader(setPythonScript, setIsPyodideLoaded);
    return (
      <div>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/Fst" element={<MigrationToFst isPyodideLoaded={isPyodideLoaded} 
                 pythonScript={pythonScript}/>} />
          <Route path="/Migration" element={<FstToMigration isPyodideLoaded={isPyodideLoaded} 
                 pythonScript={pythonScript}/>} />      
        </Routes>
      </BrowserRouter>
    </div>
  );

}