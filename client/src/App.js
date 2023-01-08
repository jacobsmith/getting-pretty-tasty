import { useEffect, useState } from 'react';
import './App.css';
import supabaseClient from './clientSupabase';
import Dashboard from './dashboard';
import Login from './login';
  
// TODO:
// 1. ability to "modify" a meal with natural language 

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseClient.supabase.auth.getUser();

      if (user) {
        setUser(user);
      }
    })();
  });

  return (
    <div className="App bg-slate-100">
      { user ? <Dashboard /> : <Login setUser={ setUser } /> }
    </div>
  );
}

export default App;
