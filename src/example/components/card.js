import React from 'react';
import {Link} from 'react-router';
const cardStyle= {
  flex: 1,
  minWidth: '300px',
  maxWidth: '300px',
  marginTop: '7px',
  marginRight: '20px',
  marginBottom: '20px'
};
const Card = ({title,description, route, destination }) => {
  return (
      <div style={cardStyle} className="demo-card-wide mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{title}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {description}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <Link to={route} className="mdl-button mdl-button--colored">
            {destination}
          </Link>
        </div>
    </div>
  );
}
export default Card;
