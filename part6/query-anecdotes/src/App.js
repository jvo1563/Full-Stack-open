import { useQuery } from "react-query";
import { getAnecdotes } from "./requests";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const handleVote = (anecdote) => {
    console.log("vote");
  };

  const result = useQuery("anecdotes", getAnecdotes, {
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (result.isLoading) {
    return (
      <div>anecdote service not available due to problems in the server</div>
    );
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
