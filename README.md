# Example Express Auth App

### Setup

1. Install packages:

    ```
    npm install
    ```

1. Create a database and run the schema file. In PostgreSQL:

    ```
    createdb auth
    psql -d auth -f db/schema.sql
    ```

1. Add your database credentials to `db/db.js` on line 2:

    ```
    const db = pgp('postgres://xxxxxxx@localhost:5432/auth');
    ```

1. Start the server:

    ```
    npm start
    ```
