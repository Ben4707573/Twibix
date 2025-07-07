score=0
name=input("Enter your name: ")
print(f"Welcome {name} to the quiz!")
print("You will be asked 5 questions. For each correct answer, you will earn 1 point.")
print("Let's begin!\n")
questions = [
    {
        "question1": "In which Hospital was Itamar born?",
        "options": ["A) Beni-Zion", "B) Rambam", "C) Carmel", "D) Shiba"],
        "answer": "A"
    },
    {
        "question2": "How many time did Itamar visit the USA?",
        "options": ["A) 3", "B) 4", "C) 5", "D) 6"],
        "answer": "B"
    },
    {
        "question3": "What is Itamar's favorite color?",
        "options": ["A) Black", "B) Blue", "C) White", "D) Green"],
        "answer": "A"
    },
    {
        "question4": "How many houses did Itamar live in'?",
        "options": ["A) 1", "B) 2", "C) 3", "D) 4"],
        "answer": "B"
    },
    {
        "question5": "In what day was Itamar born?",
        "options": ["A) Sunday", "B) Tuseday", "C) Friday", "D) Wedensday"],
        "answer": "C"
    },
    {
        "question6": "What is Itamar's favorite food?",
        "options": ["A) Pizza", "B) French Fries", "C) Pasta", "D) Hamburger"],
        "answer": "B"
    },
    {
        "question7": "What is Itamar's favorite sport?",
        "options": ["A) Football", "B) Basketball", "C) Tennis", "D) Soccer"],
        "answer": "D"
    },
    {
        "question8": "What is Itamar's favorite animal?",
        "options": ["A) Dog", "B) Cat", "C) Rabbit", "D) Hamster"],
        "answer": "A"
    },
    {
        "question9": "What is Itamar's favorite movie?",
        "options": ["A) The Sound Of Music", "B) The Minions", "C) The Emoji Moovie", "D) The Lion King"],
        "answer": "B"
    },
    {
        "question10": "What is Itamar's favorit TV show?",
        "options": ["A) Young Sheldon", "B) Bluey", "C) Curious George ", "D) Fuller House"],
        "answer": "D"
    },
    {
        "question11": "What is Itamar's favorite book?",
        "options": ["A) Harry Potter", "B) The Hobbit", "C) Fudge", "D) The Chronicles of Narnia"],
        "answer": "A"
    },
    {
        "question12": "What is Itamar's favorite game?",
        "options": ["A) Chess", "B) Monopoly", "C) Checkers", "D) Taki"],
        "answer": "B"
    }, 
    {
        "question13": "What is Itamar's favorite subject in school?",
        "options": ["A) Math", "B) Science", "C) Sports", "D) English"],
        "answer": "C"
    },
    {
        "question14": "What is Itamar's favorite song?",
        "options": ["A) APT.", "B) New Day Will Rise", "C) Bara Bada Bastu", "D) Esspresso Machiatto"],
        "answer": "C"
    },
    {
        "question15": "What is Itamar's favorite season?",
        "options": ["A) Spring", "B) Summer", "C) Fall", "D) Winter"],
        "answer": "B"
    },
    {
        "question16": "What is Itamar's favorite holiday?",
        "options": ["A) Passover", "B) Hanukkah", "C) Thanksgiving", "D) Purim"],
        "answer": "B"
    },
    {
        "question17": "What is Itamar's favorite ice cream flavor?",
        "options": ["A) Chocolate", "B) Vanilla", "C) Strawberry", "D) Salted Caramel"],
        "answer": "A"
    },
    {
        "question18": "What is Itamar's favorite fruit?",
        "options": ["A) Apple", "B) Banana", "C) Water Melon", "D) Grapes"],
        "answer": "C"
    },
    {
        "question19": "What is Itamar's favorite vegetable?",
        "options": ["A) Carrot", "B) Broccoli", "C) Cucumber", "D) Pepper"],
        "answer": "C"
    },
    {
        "question20": "What is Itamar's favorite drink?",
        "options": ["A) Water", "B) Peach Juice", "C) Coca Cola", "D) Coco"],
        "answer": "B"
    },
    {
        "question21": "What is Itamar's favorite dessert?",
        "options": ["A) Cheese Cake", "B) Vanilla Ice Cream", "C) CHocolate Chip Cookies", "D) Brownies"],
        "answer": "D"
    },
    {
        "question22": "What is Itamar's favorite hobby?",
        "options": ["A) Science", "B) Playing Video Games", "C) Swimming", "D) Playing Soccer"],
        "answer": "D"
    },
    {
        "question24": "What is Itamar's favorite place to visit?",
        "options": ["A) The Beach", "B) The Park", "C) The Zoo", "D) The Museum"],
        "answer": "C"
    },
    {
        "question25": "What is Itamar's favorite type of music?",
        "options": ["A) Pop", "B) Rock", "C) Classical", "D) Jazz"],
        "answer": "B"
    }
]

import random
import datetime
import csv
import os

# Randomly select 5 questions from the list
selected_questions = random.sample(questions, 5)

# Initialize lists to store submission data
submission_question_numbers = []
submission_user_answers = []
submission_correct_answers = []
submission_results = []

# Ask each question
for i, question_data in enumerate(selected_questions, 1):
    # Get the question text (it's the first value in the dictionary)
    question_key = list(question_data.keys())[0]
    question_text = question_data[question_key]
    
    print(f"Question {i}: {question_text}")
    
    # Display options
    for option in question_data["options"]:
        print(option)
    
    # Get user answer
    user_answer = input("Your answer (A, B, C, or D) or type 'QUIT' to exit: ").upper().strip()
    
    # Check if user wants to quit
    if user_answer == "QUIT":
        print("\nQuiz ended early. Thanks for playing!")
        print(f"Your current score: {score}/{i-1}")
        
        # Ask if user wants to save partial submission
        if submission_question_numbers:
            save_choice = input("\nWould you like to save your partial progress? (Y/N): ").upper().strip()
            
            if save_choice == "Y" or save_choice == "YES":
                # Save submission to CSV file
                submissions_file = "/home/bengo/Documents/programing/quiz/quiz_submissions.csv"
                current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                # Check if file exists to determine if we need to write headers
                file_exists = os.path.exists(submissions_file)
                
                # Prepare row data for partial submission
                row_data = [
                    name,
                    current_time,
                    score,
                    f"{len(submission_question_numbers)} (quit early)",  # total questions answered
                    "; ".join(submission_question_numbers),
                    "; ".join(submission_user_answers),
                    "; ".join(submission_correct_answers),
                    "; ".join(submission_results)
                ]
                
                try:
                    with open(submissions_file, 'a', newline='', encoding='utf-8') as f:
                        writer = csv.writer(f)
                        
                        # Write headers if file is new
                        if not file_exists:
                            headers = [
                                "Name",
                                "Date",
                                "Score",
                                "Total Questions",
                                "Question Numbers",
                                "User Answers",
                                "Correct Answers",
                                "Results"
                            ]
                            writer.writerow(headers)
                        
                        # Write the partial submission data
                        writer.writerow(row_data)
                    
                    print(f"Your partial submission has been saved to {submissions_file}")
                except Exception as e:
                    print(f"Error saving partial submission: {e}")
            else:
                print("Progress not saved. Thanks for playing!")
        
        exit()  # Exit the program
    
    # Check if answer is correct
    is_correct = user_answer == question_data["answer"]
    if is_correct:
        print("Correct! 🎉")
        score += 1
    else:
        print(f"Incorrect. The correct answer was {question_data['answer']}")
    
    # Store question and answer data for CSV
    submission_question_numbers.append(question_key)
    submission_user_answers.append(user_answer)
    submission_correct_answers.append(question_data["answer"])
    submission_results.append("Correct" if is_correct else "Incorrect")
    
    print()  # Empty line for better readability

# Display final results
print(f"Quiz completed!")
print(f"{name}, your final score is: {score}/5")

# Give feedback based on score
if score == 5:
    print("Perfect! You know Itamar very well! 🌟")
elif score >= 4:
    print("Excellent! You know Itamar quite well! 👏")
elif score >= 3:
    print("Good job! You have a decent knowledge about Itamar! 👍")
elif score >= 2:
    print("Not bad, but you could learn more about Itamar! 📚")
else:
    print("You might want to get to know Itamar better! 😊")

# Save submission to CSV file
submissions_file = "/home/bengo/Documents/programing/quiz/quiz_submissions.csv"
current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Check if file exists to determine if we need to write headers
file_exists = os.path.exists(submissions_file)

# Prepare row data
row_data = [
    name,
    current_time,
    score,
    5,  # total questions
    "; ".join(submission_question_numbers),
    "; ".join(submission_user_answers),
    "; ".join(submission_correct_answers),
    "; ".join(submission_results)
]

try:
    with open(submissions_file, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        
        # Write headers if file is new
        if not file_exists:
            headers = [
                "Name",
                "Date",
                "Score",
                "Total Questions",
                "Question Numbers",
                "User Answers",
                "Correct Answers",
                "Results"
            ]
            writer.writerow(headers)
        
        # Write the submission data
        writer.writerow(row_data)
    
    print(f"\nYour submission has been saved to {submissions_file}")
    
    # Count total submissions
    with open(submissions_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        total_submissions = sum(1 for row in reader) - 1  # -1 for header row
    
except Exception as e:
    print(f"\nError saving submission: {e}")
    total_submissions = "unknown"

# Display submission summary
print(f"\nSubmission Summary:")
print(f"Name: {name}")
print(f"Date: {current_time}")
print(f"Score: {score}/5")
print(f"Total submissions recorded: {total_submissions}") 