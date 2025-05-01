from app import app, db
from models import User, Scenario, Choice

def create_user():
    user = User(username="yeji")
    user.password_hash = "0101"
    db.session.add(user)
    db.session.commit()
    print("User added")

def create_scenarios():
    scenarios = [
        Scenario(order=1, description="Initial Spread - First cases reported. How will you respond?"),
        Scenario(order=2, description="Mutation - A faster-spreading variant emerges."),
        Scenario(order=3, description="Economic Strain - Lockdowns hurt the economy."),
        Scenario(order=4, description="Vaccine Hesitancy - Public mistrust slows vaccination."),
        Scenario(order=5, description="Mutation Spread - A second wave gains momentum."),
    ]
    db.session.add_all(scenarios)
    db.session.commit()
    print("Scenarios added")

def create_choices():
    choices = [
        # Scenario 1
        Choice(scenario_id=1, description="Enforce Citywide Curfews", b_effect=-0.04, g_effect=0.0),
        Choice(scenario_id=1, description="Launch Public Awareness Campaign", b_effect=-0.05, g_effect=0.0),
        Choice(scenario_id=1, description="Mass Testing and Isolation", b_effect=-0.01, g_effect=0.02),

        # Scenario 2
        Choice(scenario_id=2, description="Strict Lockdowns in Hotspots", b_effect=-0.04, g_effect=0.0),
        Choice(scenario_id=2, description="Accelerate Vaccination Rollout", b_effect=-0.02, g_effect=0.05),
        Choice(scenario_id=2, description="Ban Public Events", b_effect=-0.05, g_effect=0.0),

        # Scenario 3
        Choice(scenario_id=3, description="Subsidize Small Businesses", b_effect=0.0, g_effect=0.02),
        Choice(scenario_id=3, description="Relax Lockdown for Low-risk Industries", b_effect=0.02, g_effect=0.0),
        Choice(scenario_id=3, description="Citizen Stimulus Checks", b_effect=0.01, g_effect=0.01),

        # Scenario 4
        Choice(scenario_id=4, description="Educate Public on Vaccines", b_effect=-0.03, g_effect=0.03),
        Choice(scenario_id=4, description="Mandate Vaccines for Healthcare Workers", b_effect=0.0, g_effect=0.02),
        Choice(scenario_id=4, description="More Vaccination Centers", b_effect=-0.1, g_effect=0.025),

        # Scenario 5
        Choice(scenario_id=5, description="Strict Border Controls", b_effect=-0.1, g_effect=0.0),
        Choice(scenario_id=5, description="Expand Healthcare Capacity", b_effect=0.0, g_effect=0.04),
        Choice(scenario_id=5, description="Nationwide Mask Mandate", b_effect=-0.03, g_effect=0.0),
    ]
    db.session.add_all(choices)
    db.session.commit()
    print("Choices added")

def simulate_game(choices):
    population = 100000
    S = 99990
    I = 10
    R = 0
    b = 0.08
    g = 0.005
    WIN_THRESHOLD_S = 0.1 * population
    LOSS_THRESHOLD_I = 0.5 * population

    for choice in choices:
        b = max(0, b + choice.b_effect)
        g = max(0, g + choice.g_effect)

        new_infections = int(b * S * I / population)
        new_recoveries = int(g * I)

        I += new_infections - new_recoveries
        R += new_recoveries
        S -= new_infections

        if I > LOSS_THRESHOLD_I:
            return "loss"
        if S < WIN_THRESHOLD_S:
            return "win"

    return "continue"

if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()
        create_user()
        create_scenarios()
        create_choices()

        # Optional simulation test
        test_choices = Choice.query.filter(Choice.id.in_([1, 4, 7, 10, 13])).all()
        result = simulate_game(test_choices)
        print("Simulation result:", result)
