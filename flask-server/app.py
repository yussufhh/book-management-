from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Book Model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    author = db.Column(db.String(255))
    description = db.Column(db.String(255))

# Book Schema
class BookSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Book

# Initialize the database (uncomment to create the database)
# db.create_all()

# Routes
@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return BookSchema(many=True).jsonify(books)

@app.route('/books', methods=['POST'])
def add_book():
    title = request.json['title']
    author = request.json['author']
    description = request.json['description']
    new_book = Book(title=title, author=author, description=description)
    db.session.add(new_book)
    db.session.commit()
    return BookSchema().jsonify(new_book)

@app.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get(id)
    if book is None:
        return jsonify({'message': 'Book not found'}), 404
    
    book.title = request.json.get('title', book.title)
    book.author = request.json.get('author', book.author)
    book.description = request.json.get('description', book.description)
    db.session.commit()
    return BookSchema().jsonify(book)

@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if book is None:
        return jsonify({'message': 'Book not found'}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted'})

if __name__ == '__main__':
    app.run(debug=True)
