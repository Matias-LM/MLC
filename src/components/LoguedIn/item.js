import React from 'react';

const item = (props) => {
    return(<li>
      <span>title: {props.title}, id= {props.id}</span>
    </li>)
}

export default item;
