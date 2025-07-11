"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

bcrypt = Bcrypt()

@api.route('/public', methods=['GET'])
def public_route():

    response_body = {
        "message": "Hola soy una ruta pública"
    }

    return jsonify(response_body), 200


@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({
        "message": f"Hola {user.email}, soy una ruta privada",
        "user": user.serialize()  
    }), 200



@api.route('/user/login', methods=["POST"])
def sign_in():
    data_request = request.get_json()

    if not data_request or 'email' not in data_request or 'password' not in data_request:
        return jsonify({"error": "Los campos: email y password son requeridos"}), 400

    user = User.query.filter_by(email=data_request["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data_request["password"]):
        return jsonify({"msg": "El email o la contraseña es incorrecto"}), 401

    try:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": access_token,
            "user": user.serialize()
        }), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servidor"}), 500



@api.route('/user/create', methods=["POST"])
def create_user():
    data_request = request.get_json()

    if not 'email' in data_request or not 'password' in data_request:
        return jsonify({"error": "Los campos: email,password son requeridos"}), 400

    new_user = User(
        email=data_request["email"],
        password=bcrypt.generate_password_hash(
            data_request["password"]).decode('utf-8'),
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Se creó el usuario"}), 201
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": "Error en el servido"}), 500