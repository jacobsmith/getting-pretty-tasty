import { useState } from "react";
import supabaseClient from "./clientSupabase";

const QuickAsk = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleAskQuestion = async () => {
    setLoading(true);
    const response = await supabaseClient.executeFunction('quick-ask', { question });
    setAnswer(response);
    setLoading(false);
  }

  return (
    <div className="flex flex-col">

      <div className="flex flex-row">
        <input
          value={ question }
          onChange={ (e) => setQuestion(e.target.value) }
          placeholder="Ask me a question!"
        />
        <button onClick={ handleAskQuestion }>Ask</button> 
      </div>
      {
        loading && (
          <div>Loading...</div>
        )
      }
      {
        answer && (
          <div className="flex flex-row">
            { answer }
          </div>
        )
      }
    </div>
  )
}

export default QuickAsk;