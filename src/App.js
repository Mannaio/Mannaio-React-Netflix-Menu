import React from 'react';
import './App.scss';
import Dropdown from './Dropdown';
import { dataForSubtitlesMenu } from './Data';

const App = () => {
  return (
    <div className="container">
      <Dropdown title="Seleziona lingua e sottotitoli" items={dataForSubtitlesMenu} multiselect/>
    </div>
  );
}

export default App;
