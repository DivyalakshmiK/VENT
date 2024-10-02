import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';  // Import Chat component
import Landing from './components/Landing';
import Calendar from'./components/Calendar';
import JournalList from'./components/JournalList';
import Notepad from './components/Notepad';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/list" element={<JournalList/>}/>
        <Route path="/calendar" element={<Calendar/>}/>
        <Route path="/ai" element={<Chat/>}/>
        <Route path="/new" element={<Notepad/>}/>
      </Routes>
    </Router>
  );
}

export default App;
