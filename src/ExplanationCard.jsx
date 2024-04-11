import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ExplanationCard({title, description, image}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card style={{ 
      position: 'absolute', 
      top: '1vh', 
      left: '1vh',  
      minWidth: '25vw',
      maxWidth: '25vw',
      minHeight: '30vh',
      maxHeight: '90vh',
      overflow: 'auto', 
    }}>
        <CardMedia
        component="img"
        height="150vh"
        image={image}
        alt="Explanation"
      />
      <CardContent sx={{ overflow: 'hidden', textOverflow: 'ellipsis'}}
        >
        <Typography gutterBottom fontSize='4vh'  component="div" align='center' 
                style={{ height: '100%', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center'}}
                inputProps={{ style: { fontSize: '10vw'}}}>
          {title}
          </Typography>
          </CardContent>
      <CardActions disableSpacing style={{paddingTop: 0}}>
        <ExpandMore style={{paddingTop:0 }}
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon style={{paddingTop:0, top: 0 }} />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph fontSize='2.2vmin'>
            {description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}