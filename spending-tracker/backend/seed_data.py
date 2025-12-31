from app import app, db 
from models import SpendingRecord

def seed_database(): 
    with app.app_context():
        
        ## clearing existing data
        db.drop_all()
        db.create_all()
        
        ## mock data for 2024
        mock_data =  [{'state': 'California', 'num_children': 2, 'age': 35, 'spending': 5200.50},
            {'state': 'California', 'num_children': 1, 'age': 28, 'spending': 3800.00},
            {'state': 'Texas', 'num_children': 3, 'age': 42, 'spending': 4500.75},
            {'state': 'Texas', 'num_children': 2, 'age': 38, 'spending': 4100.00},
            {'state': 'New York', 'num_children': 1, 'age': 30, 'spending': 6200.25},
            {'state': 'New York', 'num_children': 2, 'age': 45, 'spending': 5800.00},
            {'state': 'Florida', 'num_children': 1, 'age': 27, 'spending': 3200.50},
            {'state': 'Florida', 'num_children': 4, 'age': 40, 'spending': 5500.00},
            {'state': 'Washington', 'num_children': 2, 'age': 33, 'spending': 4800.75},
            {'state': 'Washington', 'num_children': 1, 'age': 29, 'spending': 3500.00}]    
        for data in mock_data: 
            record = SpendingRecord(**data)
            db.session.add(record) 
        
        db.session.commit() 
        print(f"Database seeded with {len(mock_data)} records!")
if __name__ == '__main__':
    seed_database()