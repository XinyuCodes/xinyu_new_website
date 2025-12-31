from flask_sqlalchemy import SQLAlchemy 

db = SQLAlchemy() 

## setting up simple database 

class SpendingRecord(db.Model):
    __tablename__ = 'spending_records'
    
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(50), nullable=False)
    num_children=db.Column(db.Integer, nullable=False)
    age=db.Column(db.Integer, nullable=False)
    spending=db.Column(db.Float, nullable=False)
    year=db.Column(db.Integer, default=2024)
    
    def to_dict(self):
        return{
            'id': self.id, 
            'state': self.state, 
            'num_children': self.num_children, 
            'age': self.age, 
            'spending': self.spending, 
            'year': self.year
        }