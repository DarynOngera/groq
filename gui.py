import tkinter as tk
from tkinter import simpledialog, messagebox, scrolledtext
import os
import requests

# Dummy resource data for demonstration (match groq-cli.js structure)
resources = {
    "Python": {
        "Beginner": [
            {"title": "Python for Beginners", "link": "https://coursera.org/xyz"},
            {"title": "Intro to Python - YouTube", "link": "https://youtube.com/xyz"},
        ],
        "Intermediate": [
            {"title": "Intermediate Python", "link": "https://coursera.org/abc"},
        ],
    },
    "DataScience": {
        "Beginner": [
            {"title": "Data Science with Python", "link": "https://coursera.org/xyz"},
            {"title": "Data Science Overview - YouTube", "link": "https://youtube.com/xyz"},
        ],
    },
}

def get_study_path(user_profile):
    study_path = []
    for goal in user_profile['goals']:
        goal_resources = resources.get(goal)
        if goal_resources:
            study_path.append({
                'goal': goal,
                'resources': goal_resources.get(user_profile['skillLevel'], [])
            })
    return study_path

# Simulated Groq API chat completion (replace with real API call if needed)
def get_groq_chat_completion():
    # Example: Use requests to call Groq API if apiKey is set in env
    api_key = os.environ.get('GROQ_API_KEY')
    if api_key:
        response = requests.post(
            'https://api.groq.com/v1/chat/completions',
            headers={'Authorization': f'Bearer {api_key}'},
            json={
                'messages': [{
                    'role': 'user',
                    'content': 'What are the most important trends in Data Science?'
                }],
                'model': 'llama-3.3-70b-versatile'
            }
        )
        if response.ok:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"API Error: {response.text}"
    else:
        return "(Simulated) Data Science trends: AI, ML, Data Engineering, MLOps, Responsible AI..."

class GroqGUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Groq Study Path GUI")
        self.geometry("600x500")
        self.create_widgets()

    def create_widgets(self):
        self.profile_btn = tk.Button(self, text="Enter User Profile", command=self.get_user_profile)
        self.profile_btn.pack(pady=10)

        self.study_btn = tk.Button(self, text="Show Study Path", command=self.show_study_path, state=tk.DISABLED)
        self.study_btn.pack(pady=10)

        self.chat_btn = tk.Button(self, text="Groq Chat Completion", command=self.show_chat_completion)
        self.chat_btn.pack(pady=10)

        self.output = scrolledtext.ScrolledText(self, wrap=tk.WORD, width=70, height=20)
        self.output.pack(pady=10)

        self.user_profile = None

    def get_user_profile(self):
        name = simpledialog.askstring("Name", "What is your name?", parent=self)
        if not name:
            return
        skill_level = simpledialog.askstring("Skill Level", "What is your skill level? (Beginner, Intermediate, Advanced)", parent=self)
        if not skill_level:
            return
        goals = simpledialog.askstring("Goals", "What are your goals? (comma separated)", parent=self)
        if not goals:
            return
        interests = simpledialog.askstring("Interests", "What are your interests? (comma separated)", parent=self)
        if not interests:
            return
        self.user_profile = {
            'name': name,
            'skillLevel': skill_level,
            'goals': [g.strip() for g in goals.split(",")],
            'interests': [i.strip() for i in interests.split(",")],
        }
        self.study_btn.config(state=tk.NORMAL)
        messagebox.showinfo("Profile Saved", "User profile saved successfully.")

    def show_study_path(self):
        if not self.user_profile:
            messagebox.showwarning("No Profile", "Please enter your user profile first.")
            return
        study_path = get_study_path(self.user_profile)
        self.output.delete(1.0, tk.END)
        self.output.insert(tk.END, "Here is your personalized study path:\n\n")
        for goal in study_path:
            self.output.insert(tk.END, f"Goal: {goal['goal']}\n")
            for resource in goal['resources']:
                self.output.insert(tk.END, f"- {resource['title']}: {resource['link']}\n")
            self.output.insert(tk.END, "\n")

    def show_chat_completion(self):
        self.output.delete(1.0, tk.END)
        chat_result = get_groq_chat_completion()
        self.output.insert(tk.END, f"Groq Chat Completion:\n{chat_result}\n")

if __name__ == "__main__":
    app = GroqGUI()
    app.mainloop()
