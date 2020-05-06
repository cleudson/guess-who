import React from 'react';

function Feature(props) {
  const {name, value} = props;
  return (
    <li className="card__feature-element">{name}: {value}</li>
  );
}

export default Feature;