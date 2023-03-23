import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useDoc, usePouch, useFind, useAllDocs } from 'use-pouchdb'

interface docType {
  _id: string;
  type: string;
  title: string; 
  done: boolean;
}

function App() {
  const db = usePouch();

  const { rows: docs, loading, error } = useAllDocs<docType>({include_docs: true});
  /*
  const { docs, loading, error } = useFind<docType>({
    index: {
      fields: ['type', 'title'],
    },
    selector: {
      type: 'todo',
      title: { $exists: true },
    },
    sort: ['title'],
    fields: ['_id', 'title'],
  });
  //*/


  console.log('info', docs, loading, error);

  if (error && !loading) {
    return <div>something went wrong: {error.message}</div>
  }

  if (docs == null && loading) {
    return null
  }

  const handleAddTodo = async () => {
    const doc: docType = {
      _id: new Date().toJSON(),
      type: 'todo',
      title: `bob - (${new Date().toJSON()})`,
      done: false,
    }

    await db.put(doc);
  }

  docs.map(i => console.log('doc: ', i.doc?.title));

  return (
    <div className="App">
      <button onClick={() => handleAddTodo()}>Add</button>
      <div>
        {docs.map(doc => <p key={doc.id}>{doc.doc?.title}</p>)}
      </div>
    </div>
  );
}

export default App;
