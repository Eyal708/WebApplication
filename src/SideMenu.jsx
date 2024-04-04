import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import PhotoCameraFrontTwoToneIcon from '@mui/icons-material/PhotoCameraFrontTwoTone';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

export default function SideMenu() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const useStyles = makeStyles({
    menuButton: {
      fontSize: '100vmin'
    },
  });
  const classes = useStyles();

  const DrawerList = (
    <Box sx={{ width: '20wh' }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Home', 'About Our Software', 'Contact Us', 'Credits'].map((text, index) => (
          <ListItem key={text} disablePaddin>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                {index === 0 ? <HomeTwoToneIcon /> : index === 1 ? <InfoTwoToneIcon /> : 
                index === 2 ? <CallTwoToneIcon /> : <PhotoCameraFrontTwoToneIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={{position:"fixed", zIndex: 2 ,bottom: 0, left: 0 }}>
      <Button Button onClick={toggleDrawer(true)} size='large'>
        <MenuOpenIcon className={classes.menuButton}/>
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}