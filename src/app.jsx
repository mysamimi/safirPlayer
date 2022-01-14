import root from 'window-or-global';
import React from 'react';
import ReactDOM from 'react-dom';
import Player from './player';

export default (id, options) => {
  const rootEl = root.document.getElementById(id);
  ReactDOM.render(<App options={options} id={id} />, rootEl);
};
const App = ({ options, id }) => <Player options={options} key={`player-${id}`} />;
