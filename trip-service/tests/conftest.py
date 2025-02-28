import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

database_url = os.getenv('DATABASE_URL')

@pytest.fixture(scope="module")
def db_session():
    
    # Create an engine
    engine = create_engine(database_url)
    
 
    # Create a session maker
    session_maker = sessionmaker(bind=engine)
    session = session_maker()
    
    yield session  # This will provide the session to the test functions
    
    session.close()  # Cleanup after the test is done