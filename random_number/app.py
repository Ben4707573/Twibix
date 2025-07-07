import random
import csv

def choose_num():
    num = random.randint(1, 10)
    return num

def update_points(player_name, points):
    with open('/home/bengo/Documents/programing/random_number/points.csv', mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([player_name, points])

def main():
    print("Welcome to the Random Number Game!")
    print("I will choose a random number between 1 and 10.")
    print("Try to guess it!")

    player_name = input("Enter your name: ")
    total_points = 0

    while True:
        chosen_num = choose_num()
        print()

        while True:
            continue_num = input('continue? (y/n): ')
            if continue_num.lower() == 'n':
                print('bye')
                update_points(player_name, total_points)
                return
            elif continue_num.lower() == 'y':
                break
            else:
                print('Invalid input. Please enter y or n.')

        while True:
            try:
                guess = input('enter a number (or type "quit" to exit): ')
                if guess.lower() == 'quit':
                    print("You have quit the game. Progress will not be saved.")
                    return
                guess = int(guess)
                break
            except ValueError:
                print("Invalid input. Please enter a valid number.")

        while guess != chosen_num:
            if guess < chosen_num:
                print("Too low! Try again.")
            elif guess > chosen_num:
                print("Too high! Try again.")
            while True:
                try:
                    guess = input('enter a number (or type "quit" to exit): ')
                    if guess.lower() == 'quit':
                        print("You have quit the game. Progress will not be saved.")
                        return
                    guess = int(guess)
                    break
                except ValueError:
                    print("Invalid input. Please enter a valid number.")

        print(f"Congratulations! You guessed the number {chosen_num} correctly!")
        total_points += 10
        print("Thanks for playing!")

        play_again = input("Do you want to play again? (y/n): ")
        if play_again.lower() != 'y':
            print("Goodbye!")
            update_points(player_name, total_points)
            break

main()
