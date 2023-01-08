import { useState } from "react";
import supabaseClient from "./clientSupabase";
import spoon from './assets/spoon.png'

const QuickAsk = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleAskQuestion = async () => {
    setLoading(true);
    const tempQuestion = question;
    setQuestion('');
    const response = await supabaseClient.executeFunction('quick-ask', { question: tempQuestion });
    setAnswer(response);

    setMessages(m => [...m, { question: tempQuestion, response }])
    setLoading(false);
  }

  return (
    <div className='fixed bottom-2 right-2'>

      <div className="relative">
        {
          showChat && (
            <div className="flex flex-col w-[300px] bg-white rounded p-2 h-[400px] mb-2">
              <div className="float-right text-blue-300 cursor-pointer hover:text-blue-400" onClick={ () => setShowChat(false) }>Close</div>
              <div className="flex-1 overflow-auto mb-2 space-y-2">
                <div className="text-left bg-blue-50 rounded p-2">
                  Hi! Here are some example questions you can ask:
                  <br />
                  <div className="mt-2" onClick={ ()=>{ setQuestion('What can I make with chicken?'); setTimeout(() => handleAskQuestion()) }}>What can I make with chicken?</div>
                  <div>What is a good side dish for a vegan meal?</div>
                  <div>What wine pairs well with salmon?</div>
                </div>
                {
                  messages.map((m, i) => (
                    <div key={ i } className="space-y-2">
                      { m.question && <div className="flex flex-row text-left bg-slate-50 rounded p-2">
                        { m.question }
                      </div>
                      }
                      { m.response && <div className="flex flex-row text-left bg-blue-50 rounded p-2">
                        { m.response }
                      </div>
                      }
                    </div>
                  ))
                }
                {/* { messages } */}
              </div>
              
              {
                loading && (
                  <div>Checking my database of answers...</div>
                )
              }
             
              <div className="flex flex-row sticky -bottom-2 pb-2 mt-2 bg-white">
                <input
                  value={ question }
                  onChange={ (e) => setQuestion(e.target.value) }
                  placeholder="Ask me a question!"
                  className="w-full p-2 rounded"
                />
                <button onClick={ handleAskQuestion } className='border-2 border-geen-100 rounded p-2'>Ask</button>
              </div>
              
            </div>
          ) }
        
        <div className='w-16 h-16 object-cover float-right' onClick={ () => setShowChat(s => !s) }>
          <img src={ spoon } className='w-16 h-16' />
        </div>
      </div>
    </div>

  )
}

export default QuickAsk;