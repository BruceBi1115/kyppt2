# Know Your Partner & Project Tool

**Know Your Partner & Project Tool** is a web-based risk screening tool that helps staff members to identify modern slavery risks in their supply chain.

It is important to note this tool only works as a screening tool. Based on the outcome, further consultation with the Modern Slavery Unit may be needed.

## Getting Started

The web-based tool consists of frontend and backend, which are stored in their respective folders.

The frontend is built using React, and the backend is built using Django.

### Front End

#### Installation

To install `React`, you need to have `node.js` and `npm` installed.
`npm` is included with `node.js`.
You can download `node.js` from [here](https://nodejs.org/en/download/).

For Mac users, you can also install `node.js` using Homebrew:

```bash
brew install node
```

To test that you have `node.js` installed, you can run the following command in your terminal or command prompt:

```bash
node --version
npm --version
```

If `node.js` is installed, you should be able to see the version number.

#### How to run?

Run the following command to navigate to the frontend folder:

```bash
cd frontend
```

Run the following command to install the dependencies:

```bash
npm install
```

To run the app in the development mode, run the following command:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

To terminate the server, press `Ctrl+C` in the command prompt (Windows) or `Control+C` in the terminal (Mac).

### Back End

#### Prerequisites

##### Python

Ensure you have `Python` installed. You can download `Python` from [here](https://www.python.org/downloads/).

To check if `Python` is installed, run the folowing command:

Windows:

```powershell
py --version
```

Mac/Linux:

```bash
python3 --version
```

If `Python` is installed, you should be able to see the version number.

##### MySQL

The backend database is currently hosted on MySQL.

To install the MySQL server, you can download it from [here](https://dev.mysql.com/downloads/installer/).

***Important!*** Remember to note down the password you set during installation, as it will be required every time you access the command line.

For Mac users, you can also install MySQL using Homebrew:

```bash
brew install mysql
brew install mysql pkg-config
```

If you are installed via Homebrew, by default the password is empty. You can set the password by running the following command:

```bash
mysql_secure_installation
```

To test that you have MySQL installed, you can run the following command in your terminal or command prompt:

```bash
mysql --version
```

If MySQL is installed, you should be able to see the version number.

#### Installation

Run the following command to navigate to the backend folder;

```bash
cd backend
```

Run the following command to install the dependencies:

```bash
pip3 install -r requirements.txt
```

> It is recommended to use a virtual environment to install the dependencies.
> 
> To create a virtual environment, run the following command:
>
> Mac/Linux:
>
> ```bash
> python3 -m venv venv
> ```
> 
> Windows:
>
> ```powershell
> py -m venv venv
> ```
>
> To activate the virtual environment, run the following command:
>
> Mac/Linux:
>
> ```bash
> source venv/bin/activate
> ```
>
> Windows:
>
> ```powershell
> .\venv\Scripts\activate
> ```
>
> To deactivate the virtual environment, run the following command:
>
> ```bash
> deactivate # Works for both Mac/Linux and Windows
> ```

You can also install the dependencies using `conda`:

```bash
conda install --file requirements.txt
```

> You can also use `conda` to create a virtual environment.
>
> To create a virtual environment, run the following command:
>
> ```bash
> conda create --name venv
> ```
>
> To activate the virtual environment, run the following command:
>
> ```bash
> conda activate venv
> ```
>
> To deactivate the virtual environment, run the following command:
>
> ```bash
> conda deactivate
> ```

#### Backend Database Setup

Access the MySQL server by opening `mysql.exe` (Windows user), or access via the command line:

```bash
mysql -u root
```

> If you install MySQL via Homebrew, you need to run the `mysql` services first;
> 
> ```bash
> brew services start mysql
> ```

Execute the following statements in the MySQL command line to set up the database:

```sql
CREATE DATABASE knowyourpartner;
CREATE USER 'group12'@'localhost' IDENTIFIED BY 'group12';
GRANT ALL PRIVILEGES ON knowyourpartner.* TO 'group12'@'localhost';
FLUSH PRIVILEGES;
```

You can show the tables within the database by running the following command:

```sql
SHOW DATABASES;
CONNECT knowyourpartner;
SHOW TABLES;
```

#### How to run?

First store the data list under `./Resources/` folder.

Create a new `.env` file under `./core/` and copy all contents from `scaffold.env` to `.env`. Fill in all relevant information in `.env` file.

Create a new `csv_loader.py` file under `./core/` and copy all contents from `csv_loader_scaffold.py` to `csv_loader.py`. Fill in the TODOs in the `csv_loader.py` file.

Run the following command to initialise the backend database:

```bash
python manage.py makemigrations
python manage.py migrate
python csv_loader.py
```

To apply the database into backend, run the following command:

```bash
python manage.py makemigrations
python manage.py migrate
```

To run the server, run the following command:

```bash
python manage.py runserver
```

> If `python` is not working, try `python3` (Mac/Linux) or `py` (Windows) instead.

## How to Run?

To run this server in *development mode*, you need to run both frontend and backend at the same time.
In other ways, you need to have two separate terminals running, one for frontend and one for backend.

On one terminal, run the following command to run the backend first:

```bash
cd backend
python manage.py runserver
```

On another terminal, run the following command to run the frontend:

```bash
cd frontend
npm start
```

You can now access the web-based tool at [http://localhost:3000](http://localhost:3000).