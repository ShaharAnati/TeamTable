import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <Router>
      <Routes >
          <Route path='/home/login' element={<> login</>} />
          <Route path='/home/register' element={<> register </>} />
      </Routes>
    </Router>
  );
}

export default App;
