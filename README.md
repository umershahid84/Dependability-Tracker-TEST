# Dependability Tracker

Dependability Tracker is a Node.JS Application built with `Next.JS`, `React.JS`,`TailwindCSS`, and `TypeScript`, for the sole purpose of tracking when an employee calls out of work.

## Installation

`Node.JS` and `MySQL` are prerequisites but their installation is beyond the scope of the installation methods, you can refer to their documentation if installation is required.

### Download Project from GitHub

#### Via SSH - Linked Key is Required

Open a terminal and navigate to a folder on your system where you would like to save the project folder.

Then run:

```bash
git clone git@github.com:umershahid84/new-dependability-tracker.git
```

#### Via Zip File Download

A zipped project folder can be downloaded from GitHub as well.

[Dependability Tracker.zip](https://github.com/umershahid84/new-dependability-tracker/archive/refs/heads/main.zip)

### Create MySQL Database

Open a terminal and create the `dependability_tracker` database using the MySQL shell.

The shell can be accessed via:

```bash
mysql -u <user> -p
```

Replace `<user>` with the user needed to access your MySQL database, this is typically root but could be something different.

Enter your password.

Create the database and test database

```bash
CREATE DATABASE dependability_tracker;
```

```bash
CREATE DATABASE dependability_tracker_test;
```

Then exit the MySQL shell:

```bash
quit;
```

### Install Project Dependencies

After the repo has been downloaded and the database has been created, from the root of the project run the following command to install the dependencies:

```bash
npm i
```

### Remove Next.JS Telemetry Reporting

Run the following command to disable telemetry collection:

```bash
npm run removeTel
```

### Create the .env File

A script has been provided to generate a .env file and populate it with default values. For convenience, a script has been provided that will generate the file with the necessary keys. However, there are variables unique to your environment which can be added manually _AFTER_ the file has been created, _**OR**_ they can be passed as arguments when invoking the script, this is the recommended method. This will generate the file and all the keys with a single command-line command.

#### Generate .env File with Arguments

The following environment variables are unique to your environment and will need to be added. They must be provided, in the same order they are listed here:

Args:

- CREATE_TEST_ENV - true/false : true to generate the env.test file, false to generate a .env file.
- EMAIL_PORT - number : port for the SMTP relay, typically 465 or 587.
- DB_USER - string : username for MySQL database access, typically root.
- DB_PASSWORD - string : password for MySQL database access
- EMAIL_USER - string : email username for SMTP relay access - This is the noreply address
- EMAIL_HOST - string : host address for SMTP relay, this can be an IP address or FQDN
- EMAIL_SENDER - string : email address to 'send' the emails from, this will also be the no reply address
- TEST_EMAIL_USER - string : email send to address used when running any tests

The syntax for the command is `npm run createEnv -- ARGS IN ORDER, SEPARATED BY A SINGLE SPACE`

Example: `DO NOT COPY AND PASTE THIS COMMAND`

```bash
npm run createEnv -- false 587 root dbPassword test@test.com smtp.google.com noreply@test.com noreply@test.com testUser@gmail.com
```

If you make an error, delete the file with `rm .env` and try again. The env file will not overwrite itself once it has been created.

#### Generate .env File with Placeholder values

To generate a .env file with placeholder values run:

```bash
npm run createEnv
```

Then open the file and replace the `EMAIL_PORT` and any values within `<>` with your unique environment values. Be sure to save the file and exit.

### Seed the Database with Default Data

To seed the database run the following command:

> `WARNING` Seeding the Database `WILL DESTROY ANY EXISTING DATA`

```bash
npm run seed
```

### Generate the Certificate and Keys for TLS:

To generate the credentials needed for TLS run:

```bash
npm run genTLS
```

### Generate a Production Build:

```bash
npm run build
```

### Start the Server

```bash
npm start
```

### Send the Create Credential Email Invite to the Default Admin

To send the email invite so the Admin can generate their login credentials, open a new terminal and navigate to the project root. (Make sure the server is running) Then type the following command, be sure to replace `<emailAddress>` with the administrator's email address. Currently only `@portseattle.org` addresses are supported.

```bash
npm run sendCredInvite -- <emailAddress>
```
