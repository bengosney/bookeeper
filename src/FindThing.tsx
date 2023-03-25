import { useDoc, usePouch, useFind, useAllDocs } from "use-pouchdb";

import Scanner from "./Scanner";

interface docType {
  _id: string;
  type: string;
  title: string;
  done: boolean;
}

const FindThing = () => {
  const { docs, loading, error } = useFind<docType>({
    index: {
      fields: ["type", "title"],
    },
    selector: {
      type: "book",
      title: { $exists: true },
    },
    fields: ["_id", "title"],
  });

  if (error && !loading) {
    return <div>something went wrong: {error.message}</div>;
  }

  if (docs == null && loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {docs.map((doc) => (
          <li key={doc._id}>{doc.title}</li>
        ))}
      </ul>
      <Scanner on={false} />
    </div>
  );
};

export default FindThing;
