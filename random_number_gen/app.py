import random
print('welcome to my random number gen, to use enter 2 numbers and the compueter will choose a random num between them')

while True:
    choice=input('press enter to continue or type done to exit or type r to redo')
    if choice in ['done', 'Done', 'DONE']:
        break
    
    elif choice in ['r', 'R']:
        randomnum=random.randint(number1, number2)
        print(randomnum)
    else:   
        number1=int(input('choose your 1st number'))
        number2=int(input('choose your 2nd number'))
        randomnum=random.randint(number1, number2)
        print(randomnum)