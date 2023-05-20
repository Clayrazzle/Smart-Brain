import React from 'react';
import Tilt from 'react-parallax-tilt';
import metroid from './metroid.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='Tilt grow h6 w4 ma5 mt0'>
      <Tilt className= 'Tilt shadow-3'
            options={{max: 55}}>
        <div className='pa2'>
          <img style={{paddingTop: '5px'}} 
               alt='logo'
               src={metroid}/>
        </div>
      </Tilt>
     </div>
  );
}

export default Logo;