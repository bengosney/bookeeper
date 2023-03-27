const Settings = () => {
  return (
    <form>
      <div>
        <label htmlFor="couchdb_server">Sync Server</label>
        <input name="couchdb_server" />
      </div>
      <div>
        <label htmlFor="couchdb_username">Username</label>
        <input name="couchdb_username" />
      </div>
      <div>
        <label htmlFor="couchdb_password">Password</label>
        <input type="password" name="couchdb_password" />
      </div>
    </form>
  );
};

export default Settings;
