# Dependability Tracker

Dependability Tracker is a Node.JS Application built with `Next.JS`, `React.JS`,`TailwindCSS`, and `TypeScript`, for the sole purpose of tracking when an employee calls out of work.

## Table of Contents

- [Installation](#installation)
  - [Download](#1-download-project-from-github)
  - [Create Database](#2-create-mariadb-database)
  - [Remove Telemetry Reporting](#3-remove-nextjs-telemetry-reporting)
  - [Create Env File](#4-create-the-env-file)
  - [Installing, Building, and Starting Server](#5a-if-using-a-linux-distributions-with-systemd)  
     -[Linux](#5a-if-using-a-linux-distributions-with-systemd)  
     -[Any Other OS](#5b-if-using-any-other-operating-system)
  - [Seeding Database With Default Data](#6-seed-the-database-with-default-data)
  - [Send Default Admin Their Sign-Up Invite](#7-send-the-create-credential-email-invite-to-the-default-admin)
- [Updating](#updating)
- [Remove Service](#uninstall-service)
- [Employee Callout Kiosk Display](#employee-callout-kiosk-display)

## Installation

`Node.JS` and `MariaDB` are prerequisites but their installation is beyond the scope of the installation methods, you can refer to their documentation if installation is required.

### 1. Download Project from GitHub

#### Via SSH - Linked Key is Required

Open a terminal and navigate to a folder on your system where you would like to save the project folder.

Then run:

```bash
git clone git@github.com:umershahid84/new-dependability-tracker.git
```

#### Via HTTPS - Linked Key is Required

Open a terminal and navigate to a folder on your system where you would like to save the project folder.

```bash
git clone https://github.com/umershahid84/new-dependability-tracker.git
```

#### Via Zip File Download

A zipped project folder can be downloaded from GitHub as well.

[Dependability Tracker.zip](https://github.com/umershahid84/new-dependability-tracker/archive/refs/heads/main.zip)

### 2. Create MariaDB Database

Open a terminal and create the `dependability_tracker` database using the MySQL/MariaDB shell.

The shell can be accessed via:

```bash
mysql -u <user> -p
```

Replace `<user>` with the user needed to access your database, this is typically `root` in development environments but should be something different in production.

Enter your password.

Create the database and test database

```bash
CREATE DATABASE dependability_tracker;
```

```bash
CREATE DATABASE dependability_tracker_test;
```
Then exit the shell:

```bash
quit;
```

```bash
if needed run this:
command ALTER TABLE employees ADD COLUMN shuttle_number VARCHAR(255) NULL;

### 3. Remove Next.JS Telemetry Reporting

Run the following command to disable telemetry collection:

```bash
npm run removeTel
```

### 4. Create the .env File

A script has been provided to generate a .env file and populate it with default values. For convenience, a script has been provided that will generate the file with the necessary keys. However, there are variables unique to your environment which can be added manually _AFTER_ the file has been created, _**OR**_ they can be passed as arguments when invoking the script, this is the recommended method. This will generate the file and all the keys with a single command-line command.

#### 4.a Generate .env File with Arguments

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

#### 4.b Generate .env File with Placeholder values

To generate a .env file with placeholder values run:

```bash
npm run createEnv
```

Then open the file and replace the `EMAIL_PORT` and any values within `<>` with your unique environment values. Be sure to save the file and exit.

### 5.a If Using Linux Distributions With Systemd

#### (Arch, CentOS, CoreOs, Debian, Fedora, Mageia, Manjaro, Mint, OpenSUSE, RHEL, Rocky, Solus, Ubuntu)

#### Install Dependability Tracker as a Service

Installs any dependencies if necessary, builds the project, generates TLS certificates if needed, and installs dependability tracker as a systemd service, with the necessary SELinux policies to run if SELinux is enabled.

```bash
npm run install-service
```

#### Verify Service Output

```bash
# to view the last few lines
tail log

#to view the last few lines with updates
tail -f log
```

[Go to Next Step](#6-seed-the-database-with-default-data)

---

### 5.b If Using Any Other Operating System

#### Install project dependencies:

```bash
npm i
```

#### Generate a Production Build:

```bash
npm run build
```

#### Start the Server

```bash
npm start
```

### 6. Seed the Database with Default Data

To seed the database run the following command:

> `WARNING` Seeding the Database `WILL DESTROY ANY EXISTING DATA`

```bash
npm run seed
```

### 7. Send the Create Credential Email Invite to the Default Admin

To send the email invite so a supervisor can generate login credentials, open a new terminal and navigate to the project root. (Make sure the server is running) Then type the following command, replacing `<emailAddress>` with the destination email and `<supervisorName>` with the supervisor's employee name. If `<supervisorName>` is omitted, it defaults to `SEND_INVITE_DEFAULT_SUPERVISOR_NAME` (or `Umer Shahid` when that env var is not set). Currently only `@portseattle.org` addresses are supported.

```bash
npm run sendInvite -- <emailAddress> "<supervisorName>"
```

### 8. Reset or Update a Supervisor Password From CLI

To reset an existing supervisor password (or update credentials by issuing a fresh invite), run:

```bash
npm run resetPassword -- <emailAddress> "<supervisorName>"
```

`updatePassword` is also available as an alias:

```bash
npm run updatePassword -- <emailAddress> "<supervisorName>"
```

## Updating

To check for updates and rebuild upon any changes:

```bash
npm run update
```

## Uninstall Service

To remove the Dependability Service and all created files:

```bash
npm run uninstall
```

## Seeding CallOut Data for Test Purposes

### When specifying an Arbitrary Number

```bash
npm run seed-callout numberOfCallOutsToGenerate
```

### Generate 365 CallOuts

```bash
npm run seed-callouts-365
```

## Employee Callout Kiosk Display

Dependability Tracker includes a read-only kiosk display for on-duty employees to check whether someone has called out for their shift, without needing a login.

### Accessing the Kiosk

Once the server is running (see [Installation](#installation)), open the following URL in a browser on the kiosk screen, replacing `<host>` with your server's address:

```
http://<host>:<port>/kiosk
```

For example, on a local dev server this is typically `http://localhost:3000/kiosk`.

This page is intentionally public and does **not** require a supervisor/admin login, since it's meant to be left running unattended on a break-room or common-area display. It is excluded from the auth-protected routes in `src/proxy.ts`.

### Per-Division Kiosks

A separate kiosk display is also available for each line of business, showing only callouts for employees in that division:

| Division | URL |
| --- | --- |
| All Divisions | `/kiosk` |
| Public Parking | `/kiosk/public-parking` |
| Employee Parking | `/kiosk/employee-parking` |
| Ground Transportation | `/kiosk/ground-transportation` |

Each kiosk page has a small nav bar at the top linking to the other divisions, so you can switch which board is showing without typing a new URL. Point a dedicated screen at whichever URL matches the line of business it's posted in.

### What It Shows

The kiosk only ever displays callouts entered within the **last 24 hours**, most recent first, and only the following fields per callout:

- Call Date
- Shift Date From
- Shift Date To
- Shift Time
- **Shuttle Number** — Employee Parking kiosk (`/kiosk/employee-parking`) only. Public Parking and Ground Transportation do not show this field.

No other employee or callout information (leave type, supervisor comments, IDs, edit history, etc.) is exposed on this page or by its API endpoint (`/api/kiosk/callouts`). Leave Type was removed for now and may be added back later.

### Auto-Updating

The kiosk page polls for new callouts automatically every 15 seconds, so a callout entered by a supervisor appears on screen without anyone needing to refresh the page.

### Running It as an Actual Kiosk

To display this on a dedicated screen (e.g. a TV or monitor in a break room), point any browser at the `/kiosk` URL and run it fullscreen. Most browsers support a kiosk mode flag, for example with Chrome/Chromium:

```bash
chromium --kiosk http://<host>:<port>/kiosk
```

### Shuttle Number (Employee Parking)

Employee Parking employees can be assigned a **Shuttle Number** on their profile in the admin Employees screen — the field only appears when Employee Parking is one of the employee's assigned divisions. Options are `Shuttle 1` through `Shuttle 15`, `Lunch Relief`, `Fueler`, and `Express Shuttle`.

Once an employee has a shuttle number, it auto-fills as a read-only field on the callout form as soon as that employee is selected (it isn't part of what a supervisor enters — it's just informational). It also shows up on the Employee Parking kiosk display for that employee's callouts, as described above.

## Managing Services With Systemd

Here is a link to a short guide for using systemd for [managing system services](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units).

For more information refer to the man page documentation for the systemd command.

```bash
man systemd
sudo systemctl status dependability
sudo systemctl start dependability
sudo systemctl stop dependability
```

## Disregard this one please
```bash
This is just a test to update.
```
