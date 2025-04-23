# My FastAPI Project

This is a FastAPI project structured for modular development. Below are the details for setting up and running the application.

## Project Structure

```
trip-service
├── app
│   ├── main.py                # Entry point of the FastAPI application
│   ├── api                    # Directory for API routes
│   │   ├── __init__.py
│   │   └── main.py            # Directory for endpoint definitions
│   │   
│   ├── schemas                # Pydantic schemas for data validation
│   │   └── __init__.py
|   |
│   ├── services               # Business logic and services
│   |    └── __init__.py
|   ├── db.py
├── tests/                     # Contains test files
├── Dockerfile                  
├── docker-compose.dev.yml
├── requirements.txt           # Project dependencies
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <service-name>
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate   # linux 
   venv\Scripts\activate  # Windows
   ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

To run the FastAPI application using Docker, execute the following command:

```
docker compose -f docker-compose.dev.yml up --build -d
```

Visit `http://127.0.0.1:8000/docs` to access the interactive API documentation.

## Environment Variables

Create a `.env` file in your service directory to define your environment variables, such as database connection strings and secret keys.

## Running Migrations
Migrations are needed to run when you make any change to the models. From this project perspective, the models are defined in the ```snake-charmers/models/main.py``` file. If you make any changes to the file, follow the steps below:

**[The commands are specific to Linux terminal]**
```
cd <your-service-name>         # Go inside your service directoy
source venv/bin/activate   
cd ..                          # Project root 
export DATABASE_URL="url"
export PYTHONPATH=$(pwd)
alembic revision --autogenerate -m "migration msg"
alembic upgrade head
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.