import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    width: '28vw',
    height: '40vh',
    margin: "3vmin",
    transition: 'transform 0.3s ease-in-out', // Add transition
    '&:hover': { // Add hover pseudo-class
      transform: 'scale(1.05)', // Scale up the card
    },
  },
  media: {
    height: '20vh',
  },
}));

export default function HomePageCard({ link, image, title, description }) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={link} style={{ textDecoration: 'none', height: '100%' }}>
        <CardMedia
          component="img"
          className={classes.media}
          image={image}
          alt="green iguana"/>
        <CardContent sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography gutterBottom style={{ fontSize: '5vmin' }} component="div">
            {title}
          </Typography>
          <Typography style={{ fontSize: '2.5vmin' }} color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}