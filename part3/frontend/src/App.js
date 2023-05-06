import PersonForm from "./components/Personform";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personsService from "./services/persons";

import { useState, useEffect } from "react";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [noticationMessage, setNotifcationMessage] = useState(null);

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    console.log(personToDelete);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .remove(id)
        .then((response) => {
          // console.log(response);
          const newPersons = persons.filter((person) => person.id !== id);
          setPersons(newPersons);
          setNotifcationMessage(
            `Success: Deleted ${personToDelete.name} from the server`
          );
          setTimeout(() => {
            setNotifcationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          const newPersons = persons.filter((person) => person.id !== id);
          setPersons(newPersons);
          setNotifcationMessage(
            `Error: Something went wrong deleting ${personToDelete.name}`
          );
          setTimeout(() => {
            setNotifcationMessage(null);
          }, 5000);
        });
    }
  };
  const addPerson = (event) => {
    event.preventDefault();
    const personToAdd = persons.find((person) => person.name === newName); //check to see if person exist

    // personToAdd will be undefined if person doesnt exist
    if (personToAdd === undefined) {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personsService.create(personObject).then((returnedPersons) => {
        setPersons(persons.concat(returnedPersons));
        setNotifcationMessage(`Success: Added ${newName}`);
        setTimeout(() => {
          setNotifcationMessage(null);
        }, 5000);
      });
    } else {
      //if person already exist
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPerson = { ...personToAdd, number: newNumber };
        personsService
          .update(personToAdd.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToAdd.id ? person : returnedPerson
              )
            );
            setNotifcationMessage(
              `Success: Updated ${newName}'s number to ${newNumber}`
            );
            setTimeout(() => {
              setNotifcationMessage(null);
            }, 5000);
          });
      }
    }
    setNewName("");
    setNewNumber("");
  };
  const handleNameChange = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    // console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = !filter.length
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(filter));

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={noticationMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
