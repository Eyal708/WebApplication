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
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { rightArrow } from './constants';

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
        {['Home', `Fst ${rightArrow} Migration`, `Migration ${rightArrow} Fst`, 
                                    'About Our Software'].map((text, index) => (
          <ListItem key={text} disablePaddin>
            <ListItemButton component={Link} to={ index == 0 ? "/": index == 1?
            "/FstToMigration": index == 2? "/MigrationToFst": "/About"}>
              <ListItemIcon>
                {index === 0 ? <HomeIcon style={{color:"black"}}/> : index === 1 ? 
                <HubRoundedIcon style={{color:'darkblue'}}/> : 
                index === 2 ? <HubRoundedIcon style = {{color:"darkgreen"}} /> : 
                              <InfoIcon/>}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={{position:"fixed", zIndex: 2 ,bottom: 0, right: 0 }}>
      <Button Button onClick={toggleDrawer(true)} size='large'>
        <MenuOpenIcon className={classes.menuButton} fontSize='large'  />
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}