import pandas as pd
import numpy as np
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# Step 1: Generate mock data (no categories)
def generate_mock_data(n=500):
    data = []
    for _ in range(n):
        budget = random.randint(500, 5000)
        spent = budget + random.randint(-300, int(budget * 0.5))  # Some overspending
        spent = max(0, spent)
        percent_over = ((spent - budget) / budget) * 100

        # Only two labels: 'low' (within or slight overspend) & 'high' (major overspend)
        label = 'low' if percent_over <= 10 else 'high'

        data.append([budget, spent, round(percent_over, 2), label])

    return pd.DataFrame(data, columns=['budget', 'spent', 'percent_over', 'label'])

# Step 2: Prepare training data
df = generate_mock_data()
features = df[['budget', 'spent', 'percent_over']]
labels = df['label']
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Step 3: Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Step 4: Save model
joblib.dump(clf, 'overspending_model_final.pkl')
print("\nModel training complete!")
print(classification_report(y_test, clf.predict(X_test)))
print("Model saved as 'overspending_model_final.pkl'")

# Step 5: Nudge Generator
def generate_nudge(budget, spent, model):
    percent_over = ((spent - budget) / budget) * 100
    input_features = np.array([[budget, spent, percent_over]])
    
    risk_level = model.predict(input_features)[0]  # 'low' or 'high'

    if risk_level == 'low':
        return None  # No nudge needed
    else:
        return f"Alert: You have overspent your budget by {round(percent_over, 2)}%. Consider pausing spending this week."

# Step 6: Test example
model = joblib.load('overspending_model_final.pkl')
test_budget = 2000
test_spent = 2700

message = generate_nudge(test_budget, test_spent, model)
if message:
    print("\n--- Nudge Example ---")
    print(f"Budget: ₹{test_budget}, Spent: ₹{test_spent}")
    print(message)
else:
    print("No overspending detected.")
