import React from 'react';
import './Navbar.scss';





const Navbar = ({connectWallet, currentAccount}) => {
  
  return (
    <nav className='app__navbar'>
      <div className='app__navbar-title'>
        <p>SUPERPUSH</p>
      </div>
      <ul className='app__navbar-links'>
        {['home','create','update','delete'].map((items)=>(
         <li className='app__flex p-text' key={`link-${items}`}>
          <a href={`#${items}`}>{items}</a>
         </li> 
        ))}
      </ul>
      {currentAccount === "" ? (
        <button id="connectWallet" className="button1" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <button className="button1">
          {`${currentAccount.substring(0, 4)}...${currentAccount.substring(
            38
          )}`}
        </button>
      )}
    </nav>
  )
}
//navbar done
export default Navbar