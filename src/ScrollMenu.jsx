import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { InlineMath } from 'react-katex';
import { rightArrow } from './constants';
import './index.css';

const useStyles = makeStyles((theme) => ({
  menu: {
    position: 'fixed',
    top: '28vh', // Adjust based on your logo's position
    right: '1vmin',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white', // Optional: Add background color to the menu for better visibility
    padding: theme.spacing(2), // Optional: Add some padding around the menu items
    borderRadius: theme.shape.borderRadius, // Optional: Round the corners of the menu
    boxShadow: theme.shadows[2], // Optional: Add shadow to the menu for a lifted effect
  },
  title: {
    marginBottom: theme.spacing(2), // Space between title and first menu item
    fontSize: '3.5vmin', // Increase font size for bigger headline
    color: 'grey', // Change color, example uses Material-UI's primary color
  },
  menuItem: {
    margin: theme.spacing(1),
    fontSize: '2.5vmin', // Correct font size
    fontFamily: 'Roboto, sans-serif', // Correct font family
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

const ScrollMenu = () => {
  const classes = useStyles();
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };
  
  const sections = [
    { id: 'setting', label: 'Setting' },
    { id: 'migrationToFst', label: <>Migration <span style={{ marginLeft: '5px' }}></span>{rightArrow}<span style={{ marginRight: '5px' }}></span><InlineMath math="F_{st}" /></> },
    { id: 'fstToMigration', label: <><InlineMath math="F_{st}" /> <span style={{ marginLeft: '5px' }}></span>{rightArrow}<span style={{ marginRight: '5px' }}></span> Migration </> },
    { id: 'code', label: 'Code'},
    { id: 'references', label: 'References' },
    { id: 'credits', label: 'Credits' },
  ];


  return (
    <div className={classes.menu}>
      <Typography variant="h6" align='center' className={classes.title}>
        Contents
      </Typography>
      {sections.map((section) => (
        <Button
          key={section.id}
          className={classes.menuItem}
          onClick={() => handleScroll(section.id)}
          color={activeSection === section.id ? 'primary' : 'default'}
          style={{ textTransform: 'none' }}
        >
          {section.label}
        </Button>
      ))}
    </div>
  );
};

export default ScrollMenu;