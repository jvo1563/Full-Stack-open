import { useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <li>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </li>
  );
};

const AnecdotesList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) =>
    state.filter
      ? [...state.anecdotes] // We have to make a copy of state.anecdotes to keep .sort() from modifying the state
          .filter((anecdote) =>
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
          )
          .sort((a, b) => b.votes - a.votes)
      : [...state.anecdotes].sort((a, b) => b.votes - a.votes)
  );
  return (
    <ul>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => dispatch(addVote(anecdote.id))}
        />
      ))}
    </ul>
  );
};

export default AnecdotesList;
