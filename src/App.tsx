import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useDoc, usePouch, useFind } from 'use-pouchdb'

interface docType {
  content?: string;
}

function App() {
  const id = "bob";
  const db = usePouch();

  const { docs, loading, error } = useFind({
    index: {
      fields: ['type', 'title'],
    },
    selector: {
      type: 'story',
      title: { $exists: true },
    },
    sort: ['title'],
    fields: ['_id', 'title'],
  });

  if (error && !loading) {
    //return <div>something went wrong: {error.name}</div>
  }

  if (docs == null && loading) {
    return null
  }

  const handleAddTodo = async () => {
    const doc = {
      _id: new Date().toJSON(), // give the document a unique id
      type: 'todo',
      text: "bob",
      done: false,
    }

    await db.put(doc) // put the new document into the database
  }

  return (
    <div className="App">
      <button onClick={() => handleAddTodo()}>Add</button>
      <div>
        {docs.map(doc => {
          <p key={doc.id}>{doc.text}</p>
        })}
      </div>
    </div>
  );
}

export default App;
