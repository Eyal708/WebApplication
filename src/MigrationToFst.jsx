import React from "react";
import './index.css';
import {fst, rightArrow, migrationExplanation} from './constants';
import FstImage from './Images/Migration.svg';
import TransformationPage from './TransformationPage';
import { InlineMath } from "react-katex";

export default function MigrationToFst() {
  // const cardTitle = <>  Migration {`${rightArrow }`} <InlineMath math="F_{st}"/></>;
  const cardTitle = (
    <>
      Migration <span style={{ marginRight: '5px' }}></span>
      {rightArrow}
      <span style={{ marginLeft: '5px' }}></span>
      <InlineMath math="F_{st}" />
    </>
  );
  
  return <TransformationPage inputMatrixType="Migration" cardTitle = 
                            {cardTitle} cardImage = {FstImage} cardDescription={migrationExplanation} />
}
