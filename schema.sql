CREATE TABLE table_name (
    title VARCHAR(255),
    time VARCHAR(255),
    comments VARCHAR(255)
);

-- Add the id column to the table
ALTER TABLE table_name ADD COLUMN id SERIAL PRIMARY KEY;

-- Update the existing data to set the id column to the next available value
UPDATE table_name SET id = DEFAULT;