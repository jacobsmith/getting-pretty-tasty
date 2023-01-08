import { useEffect, useState } from "react";
import supabaseClient from "./clientSupabase";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const { user, session, error } = await supabaseClient.supabase.auth.signUp({ email, password });
    if (user) {
      setUser(user);
    }
    setError(error);
  }

  const handleSignIn = async () => {
    const { user, session, error } = await supabaseClient.supabase.auth.signInWithPassword({ email, password });
    if (user) {
      console.log('user', user);
      setUser(user);
    }
    setError(error);
  }

  const signInWithMagicLink = async () => {
    const { error } = await supabaseClient.supabase.auth.signInWithOtp({ email }, { redirectTo: window.location.host });
    setError(error);
  }

  return (
    <div>
      <h1>Login</h1>

      <input type="email" placeholder="email" value={ email } onChange={ (e) => setEmail(e.target.value) } />
      <input type="password" placeholder="password" value={ password } onChange={ (e) => setPassword(e.target.value) } />
      <div>{ error?.message }</div>
      <button onClick={ handleSignUp }>Sign Up</button>
      <button onClick={ handleSignIn }>Sign In</button>
      <button onClick={ signInWithMagicLink }>Sign In With Magic Link</button>
    </div>
  )
}

export default Login;