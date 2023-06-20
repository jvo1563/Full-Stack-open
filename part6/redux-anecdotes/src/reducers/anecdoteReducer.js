import { createSlice } from "@reduxjs/toolkit";
import ancedoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    addVote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      // console.log(JSON.parse(JSON.stringify(state)));
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote
      );
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { createAnecdote, addVote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await ancedoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export default anecdoteSlice.reducer;
