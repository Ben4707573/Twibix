import time
print('Welcome to my calculator')
time.sleep(0.3)
print("Please use only the following expressions: '+' addition, '-' subtraction, '*' multiplication, '/' division")

history = []

while True:
    expr = input('Enter an expression: ')
    choice = input("Press Enter to continue, 'x' + Enter to edit expression, or 'h' + Enter to show history: ")
    
    if choice.lower() == 'x':
        print('Your previous expression was:', expr)
        time.sleep(1)
        expr = input('Enter a new expression: ')
    elif choice.lower() == 'h':
        count = 1
        for item in history:
            print('#', count, item)
            count += 1
        continue  # Skip calculation after showing history
    
    try:
        result = eval(expr)
    except Exception as e:
        print('Error in expression:', e)
        continue
    
    history.append(f"{expr} = {result}")
    print('Your expression is equal to', result)
