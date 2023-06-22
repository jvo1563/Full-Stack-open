import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAnecdotes, updateAnecdote } from "./requests";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const createNotification = (message) => {
    dispatch({ type: "SET", payload: message });
    setTimeout(() => dispatch({ type: "CLEAR" }), 5000);
  };

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData("anecdotes");
      queryClient.setQueryData(
        "anecdotes",
        anecdotes.map((anecdote) =>
          anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
        )
      );
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    createNotification(`You voted for: ${anecdote.content}`);
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
