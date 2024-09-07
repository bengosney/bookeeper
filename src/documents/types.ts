export type PouchDocument<T extends {}> = T & PouchDB.Core.IdMeta;
export type PouchDocumentRev<T extends {}> = PouchDocument<T> & PouchDB.Core.GetMeta;
