from flask import Flask, jsonify, request, make_response, session
from flask_restful import Api, Resource
from config import app, db, api
from models import *
from sqlalchemy import desc



class Signup(Resource):
    
    def post(self):
        json = request.get_json()
        user = User(
            username=json['username']
        )
        user.password_hash = json['password']
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id

        return user.to_dict(), 201




class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return {'error': 'Unauthorized'}, 401


class Login(Resource):
    def post(self):
        json=request.json
        user = User.query.filter(User.username == json['username']).first()
        password = json['password']
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict(), 200

        return {'error': 'Invalid username or password'}, 401 




class Logout(Resource):
    def delete(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            session['user_id']=None
            return make_response("", 204)
        else:
            return {'error': 'not logged in'}, 401 
        
class UserById(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        
        return make_response(user.to_dict(), 200)

    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        
        db.session.delete(user)
        db.session.commit()
        return make_response("", 204)
    
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        
        data = request.get_json()

        if "username" in data:
            existing_user = User.query.filter(User.username == data["username"]).first()
            if existing_user and existing_user.id != user.id:
                return make_response({"error": "Username already taken! 🐍"}, 400)
            elif existing_user and existing_user.id == user.id:
                return make_response({"error": "That is your current username, silly goose! 🪿"}, 400)
            
            user.username = data["username"]

        if "password" in data:
            user.password_hash = data['password']
        
        db.session.commit()
        return make_response(user.to_dict(), 200)
        
        
class PostSimulation(Resource):
    def post(self):
        data = request.json

        user_id = data.get('user_id')
        total_population = data.get('total_population')
        current_b = data.get('current_b')  
        current_g = data.get('current_g') 
        current_S = data.get('current_S')  
        current_I = data.get('current_I') 
        current_R = data.get('current_R') 

        simulation = Simulation(
            user_id=user_id,
            total_population=total_population,
            current_b=current_b,
            current_g=current_g,
            current_S=current_S,
            current_I=current_I,
            current_R=current_R,
            days_passed=0,
            status="ongoing"
        )

        db.session.add(simulation)
        db.session.commit()

        return simulation.to_dict(), 201
    
class GetScenarioByOrder(Resource):
    def get(self, order):
        scenario = Scenario.query.filter(Scenario.order == order).first()
        if scenario:
            return scenario.to_dict(rules=('choices',)), 200
        return {'error': 'Scenario not found'}, 404

class GetScenarioChoices(Resource):
    def get(self, scenario_id):
        scenario = Scenario.query.get(scenario_id)
        if scenario:
            return scenario.to_dict(), 200
        return {'error': 'Scenario not found'}, 404
    
class GetSimulation(Resource):
    def get(self, simulation_id):
        sim = Simulation.query.get(simulation_id)
        if sim:
            return sim.to_dict(), 200
        return {'error': 'Simulation not found'}, 404

class PostSimulationChoice(Resource):
    def post(self):
        data = request.get_json()
        simulation_id = data['simulation_id']
        scenario_id = data['scenario_id']
        choice_id = data['choice_id']
        timetaken = data['timetaken']

        simulation = Simulation.query.get(simulation_id)
        choice = Choice.query.get(choice_id)

        if not simulation or not choice:
            return {"error": "Invalid simulation or choice ID"}, 400

        before_S = simulation.current_S
        before_I = simulation.current_I
        before_R = simulation.current_R
        old_b = simulation.current_b
        old_g = simulation.current_g
        N = simulation.total_population

        # Step 1: Simulate delay (policy not yet applied)
        # days = timetaken * 
        days = timetaken

        S, I, R = before_S, before_I, before_R
        for _ in range(days):
            new_infected = old_b * S * I / N
            new_recovered = old_g * I
            S = max(S - new_infected, 0)
            I = max(I + new_infected - new_recovered, 0)
            R = min(R + new_recovered, N)
            if I < 1e-6:
                break

        after_S, after_I, after_R = S, I, R

        new_b = old_b * (1 - choice.b_effect)
        new_g = old_g * (1 + choice.g_effect)

        new_b = max(new_b, 0.001)
        new_g = min(new_g, 1.0)

        sim_choice = SimulationChoice(
            simulation_id=simulation_id,
            scenario_id=scenario_id,
            choice_id=choice_id,
            timetaken=timetaken,
            before_S=before_S,
            before_I=before_I,
            after_S=after_S,
            after_I=after_I
        )
        db.session.add(sim_choice)

        # Update simulation state
        simulation.current_S = after_S
        simulation.current_I = after_I
        simulation.current_R = after_R
        simulation.current_b = new_b
        simulation.current_g = new_g
        simulation.days_passed += days

        db.session.commit()

        return sim_choice.to_dict(), 201


# class PostSimulationChoice(Resource):
#     def post(self):
#         data = request.get_json()
#         simulation_id = data['simulation_id']
#         scenario_id = data['scenario_id']
#         choice_id = data['choice_id']
#         timetaken = data['timetaken']

#         simulation = Simulation.query.get(simulation_id)
#         choice = Choice.query.get(choice_id)

#         if not simulation or not choice:
#             return {"error": "Invalid simulation or choice ID"}, 400

#         before_S = simulation.current_S
#         before_I = simulation.current_I
#         before_R = simulation.current_R
#         old_b = simulation.current_b
#         old_g = simulation.current_g
#         N = simulation.total_population

#         # Step 1: Simulate the delay period using OLD b, g
#         days = timetaken * 10
#         S, I, R = before_S, before_I, before_R
#         for _ in range(days):
#             new_infected = old_b * S * I / N
#             new_recovered = old_g * I
#             S = max(S - new_infected, 0)
#             I = max(I + new_infected - new_recovered, 0)
#             R = min(R + new_recovered, N)
#             if I < 1e-6:
#                 break

#         after_S, after_I, after_R = S, I, R  # Before policy is applied

#         # Step 2: Apply policy effects AFTER the delay
#         new_b = old_b + choice.b_effect
#         new_g = old_g + choice.g_effect

#         # Update simulation
#         sim_choice = SimulationChoice(
#             simulation_id=simulation_id,
#             scenario_id=scenario_id,
#             choice_id=choice_id,
#             timetaken=timetaken,
#             before_S=before_S,
#             before_I=before_I,
#             after_S=after_S,
#             after_I=after_I
#         )
#         db.session.add(sim_choice)

#         simulation.current_S = after_S
#         simulation.current_I = after_I
#         simulation.current_R = after_R
#         simulation.current_b = new_b
#         simulation.current_g = new_g
#         simulation.days_passed += days

#         db.session.commit()

#         return sim_choice.to_dict(), 201


  

class GetSimulationResult(Resource):
    def get(self, simulation_id):
        # Order by newest first
        result = (
            SimulationResult
            .query
            .filter_by(simulation_id=simulation_id)
            .order_by(desc(SimulationResult.id))
            .first()
        )
        if not result:
            return {'error': 'Simulation result not found'}, 404
        return result.to_dict(), 200
    
class ListSimulationResults(Resource):
    def get(self):

        results = SimulationResult.query.order_by(SimulationResult.final_I).all()

        return [r.to_dict() for r in results], 200


class PostSimulationResult(Resource):
    def post(self):
        data = request.get_json()
        simulation_id = data.get('simulation_id')

        simulation = Simulation.query.get(simulation_id)
        if not simulation:
            return {'error': 'Simulation not found'}, 404

        S = simulation.current_S
        I = simulation.current_I
        R = simulation.current_R
        b = simulation.current_b
        g = simulation.current_g
        N = simulation.total_population
        days_passed = simulation.days_passed

        while days_passed < 180:
            new_infected = b * S * I / N
            new_recovered = g * I

            S = max(S - new_infected, 0)
            I = max(I + new_infected - new_recovered, 0)
            R = min(R + new_recovered, N)
            days_passed += 1

            if I < 1e-6:
                break  

        win = (I < 0.5 * N) and (S > 0.1 * N)
        winornot = True if win else False

        if I < 1e-6:
            end_reason = "Infection contained"
        elif S <= 0.1 * N:
            end_reason = "Too few susceptible individuals left"
        elif I >= 0.5 * N:
            end_reason = "Too many infected"
        else:
            end_reason = "180 days passed"

        simulation_result = SimulationResult(
            simulation_id=simulation_id,
            final_S=S,
            final_I=I,
            final_R=R,
            win=winornot,
            total_time=days_passed,
            endreason=end_reason
        )
        db.session.add(simulation_result)
        db.session.commit()

        return simulation_result.to_dict(), 201

class UpdateSimulation(Resource):
    def patch(self, simulation_id):
        new_status = request.get_json().get('status')

        sim = Simulation.query.get(simulation_id)
        if not sim:
            return {'error': 'Simulation not found'}, 404

        if new_status:
            sim.status = new_status
            db.session.commit()

        return sim.to_dict(), 200






api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(UserById, '/users/<int:id>')

api.add_resource(PostSimulation, '/simulations')
api.add_resource(GetScenarioByOrder, '/scenarios/order/<int:order>')
api.add_resource(GetScenarioChoices, '/scenarios/<int:scenario_id>')
api.add_resource(GetSimulation, '/simulations/<int:simulation_id>')
api.add_resource(PostSimulationChoice, '/simulation_choices')
api.add_resource(GetSimulationResult, '/simulation_result/<int:simulation_id>')
api.add_resource(PostSimulationResult, '/simulation_result')
api.add_resource(UpdateSimulation, '/simulations/<int:simulation_id>')
api.add_resource(ListSimulationResults, '/simulation_results')











if __name__ == '__main__':
    app.run(port=5555, debug=True)
