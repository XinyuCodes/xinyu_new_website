from flask import Flask, jsonify, request
from flask_cors import CORS 
from models import db, SpendingRecord

app = Flask(__name__)
CORS(app) 

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///spending.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app) 

@app.route('/')
def home():
    return jsonify({"message": "Spending Tracker API"})

@app.route('/api/health')
def health_check():
    return jsonify({"message":"Still healthy"})

# Get all spending records
@app.route('/api/spending', methods=['GET'])
def get_spending():
    records = SpendingRecord.query.all()
    return jsonify([record.to_dict() for record in records])

# Query spending by filters
@app.route('/api/spending/filter', methods=['GET'])
def filter_spending():
    state = request.args.get('state')
    num_children = request.args.get('num_children')
    age = request.args.get('age')
    
    query = SpendingRecord.query
    
    if state:
        query = query.filter_by(state=state)
    if num_children:
        query = query.filter_by(num_children=int(num_children))
    if age:
        query = query.filter_by(age=int(age))
    
    records = query.all()
    return jsonify([record.to_dict() for record in records])

# Get spending statistics
@app.route('/api/spending/stats', methods=['GET'])
def get_stats():
    records = SpendingRecord.query.all()
    if not records:
        return jsonify({"error": "No data available"})
    
    total = sum(r.spending for r in records)
    avg = total / len(records)
    max_spending = max(r.spending for r in records)
    min_spending = min(r.spending for r in records)
    
    return jsonify({
        "total": total,
        "average": avg,
        "max": max_spending,
        "min": min_spending,
        "count": len(records)
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=True, port=5001)