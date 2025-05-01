from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from datetime import datetime, time
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    simulations = db.relationship('Simulation', back_populates='user',)

    serialize_only = ('id', 'username') 
    
    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))


class Scenario(db.Model, SerializerMixin):
    __tablename__ = "scenarios"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    order = db.Column(db.Integer, nullable=False)

    choices = db.relationship('Choice', back_populates='scenario')
    simulation_choices = db.relationship('SimulationChoice', back_populates='scenario')

    # serialize_rules = ("-choices.scenario", "-simulation_choices.scenario",)  # Exclude circular references
    serialize_only = ('id','description','order')

class Choice(db.Model, SerializerMixin):
    __tablename__ = "choices"

    id = db.Column(db.Integer, primary_key=True)
    scenario_id = db.Column(db.Integer, db.ForeignKey("scenarios.id"), nullable=False)
    description = db.Column(db.String, nullable=False)
    b_effect = db.Column(db.Float, nullable=False)
    g_effect = db.Column(db.Float, nullable=False)

    scenario = db.relationship('Scenario', back_populates='choices')
    simulation_choices = db.relationship('SimulationChoice', back_populates='choice')

    serialize_rules = ("-simulation_choices.choice",)  # Exclude circular references


class Simulation(db.Model, SerializerMixin):
    __tablename__ = "simulations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    total_population = db.Column(db.Integer, nullable=False)
    current_b = db.Column(db.Float, nullable=False)
    current_g = db.Column(db.Float, nullable=False)
    current_S = db.Column(db.Float, nullable=False)
    current_I = db.Column(db.Float, nullable=False)
    current_R = db.Column(db.Float, nullable=False)
    days_passed = db.Column(db.Integer, default=0)
    status = db.Column(db.String)

    user = db.relationship('User', back_populates='simulations')
    simulation_choices = db.relationship('SimulationChoice', back_populates='simulation')
    simulation_result = db.relationship('SimulationResult', back_populates='simulation')

    # serialize_rules = ("-simulation_choices.simulation", "-simulation_result.simulation",)  # Exclude circular references
    serialize_only = ('id', 'user_id', 'total_population', 'current_b', 'current_g', 'current_S', 'current_I', 'current_R', 'days_passed', 'status')


class SimulationChoice(db.Model, SerializerMixin):
    __tablename__ = "simulationchoices"

    id = db.Column(db.Integer, primary_key=True)
    simulation_id = db.Column(db.Integer, db.ForeignKey("simulations.id"), nullable=False)
    scenario_id = db.Column(db.Integer, db.ForeignKey("scenarios.id"), nullable=False)
    choice_id = db.Column(db.Integer, db.ForeignKey("choices.id"), nullable=False)
    timetaken = db.Column(db.Integer)
    before_I = db.Column(db.Float)
    before_S = db.Column(db.Float)
    after_I = db.Column(db.Float)
    after_S = db.Column(db.Float)

    simulation = db.relationship('Simulation', back_populates='simulation_choices')
    scenario = db.relationship('Scenario', back_populates='simulation_choices')
    choice = db.relationship('Choice', back_populates='simulation_choices')

    serialize_rules = ("-simulation.simulation_choices", "-scenario.simulation_choices", "-choice.simulation_choices",)  # Exclude circular references


class SimulationResult(db.Model, SerializerMixin):
    __tablename__ = "simulationresults"

    id = db.Column(db.Integer, primary_key=True)
    simulation_id = db.Column(db.Integer, db.ForeignKey("simulations.id"), nullable=False)
    final_S = db.Column(db.Float)
    final_I = db.Column(db.Float)
    final_R = db.Column(db.Float)
    win = db.Column(db.Boolean, default=False)
    endreason = db.Column(db.String)
    total_time = db.Column(db.Integer)

    simulation = db.relationship('Simulation', back_populates='simulation_result')

    serialize_rules = ("-simulation.simulation_result",)  # Exclude circular references
