import React from "react";
import './index.css';
import {fst, rightArrow, migrationExplanation} from './constants';
import FstImage from './Images/Migration.jpg';
import TransformationPage from './TransformationPage';

export default function MigrationToFst() {
  const cardTitle = "Migration" + " " + rightArrow + " " +  fst;
  return <TransformationPage inputMatrixType="Migration" cardTitle = {cardTitle} cardImage = {FstImage} 
                             cardDescription={migrationExplanation} />
}
