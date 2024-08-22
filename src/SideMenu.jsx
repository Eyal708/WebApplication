import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import MenuOpenIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography'; 
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { rightArrow, fst } from './constants';
import { InlineMath } from 'react-katex';

export default function SideMenu() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const useStyles = makeStyles({
    menuButton: {
      color: 'darkblue'
    }
  });
  const classes = useStyles();

  const DrawerList = (
    <Box sx={{ width: '20wh' }} role="presentation" onClick={toggleDrawer(false)}>  
      <List>
        {[
          { text: 'Home', path: "/" },
          { text: <><InlineMath math="F_{st}"/> {rightArrow} Migration</>, path: "/FstToMigration" },
          { text: <>Migration {rightArrow} <InlineMath math="F_{st}"/></>, path: "/MigrationToFst" },
          { text: 'About This Software', path: "/About" }
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>
                {index === 0 ? <HomeIcon style={{color:"black"}} fontSize="large"/> : 
                index === 1 ? <HubRoundedIcon style={{color:'darkblue'}} fontSize="large" /> :
                index === 2 ? <HubRoundedIcon style={{color:"darkgreen"}} fontSize="large" /> : 
                              <InfoIcon fontSize="large"/>}
              </ListItemIcon>
              <ListItemText primary={<Typography style={{ fontSize: '1.5rem' }}>{item.text}</Typography>} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={{position:"fixed", zIndex: 2 ,bottom: 0, left: 0 }}>
      <Button Button onClick={toggleDrawer(true)} size='large'>
        <MenuOpenIcon className={classes.menuButton} style={{fontSize:'7vmin'}}  />
      </Button>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}