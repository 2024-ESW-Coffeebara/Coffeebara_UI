from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins = '*')

cup_class_id = 0
entrance_class_id = 1
holder_class_id = 2
straw_class_id = 3

PY_RESET = 0
PY_READY = 1
PY_START = 2
PY_DETECTING = 3
PY_DETECTED = 4
current_state = PY_RESET
class Cup:
    def __init__(self, x1, y1, x2, y2, width, height):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.width = width
        self.height = height

class Entrance:
    def __init__(self, x1, y1, x2, y2, width, height):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.width = width
        self.height = height

class Holder:
    def __init__(self, x1, y1, x2, y2, width, height):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.width = width
        self.height = height


def results_processing(largest_cup, largest_entrance, largest_holder):
    commend = 0x00

    # 아예 인식되지 않은 경우는 바로 리턴
    if largest_cup is None or largest_entrance is None:
        print("there's no cup")
        return commend
    
    # 인식됐지만 유효하지 않은 경우도 리턴
    # 추후 수정

    if largest_holder:
        print("w. Holder ")
        # size 잘 맞으면 홀더로 인식 // 
        commend = commend | 0x01
    
    commend = commend << 2

    # 컵 크기에 따른 size
    entrance_2_cup = largest_cup.y2 - largest_entrance.y2
    if entrance_2_cup >= 420:
        print("Cup size : Large")
        commend = commend | 0x03
    elif entrance_2_cup < 420 and entrance_2_cup > 350:
        print("Cup size : Regular")
        commend = commend | 0x02
    else:
        print("Cup size : Small")
        commend = commend | 0x01

    commend = commend << 2

    # entrance 크기에 따른 size
    entrance_x_diff = largest_entrance.x2 - largest_entrance.x1
    if entrance_x_diff >= 280:
        print("Ent size : Large")
        commend = commend | 0x03
    elif entrance_x_diff < 280 and entrance_x_diff > 245:
        print("Ent size : Regular")
        commend = commend | 0x02
    else:
        print("Ent size : Small")
        commend = commend | 0x01

    commend = commend << 3
    return commend

    # 인식된 컵 없는 경우 'F' 리턴
    # 인식된 컵이 있는 경우 



def state_update():
    global current_state

    largest_cup = None
    largest_entrance = None
    largest_holder = None
    state = 0

    print(f"current_state : {current_state}")
    if current_state == PY_RESET:
        time.sleep(3)
        current_state = PY_READY
        return

    elif current_state == PY_READY:
        time.sleep(5)
        current_state = PY_START
        return
    
    elif current_state == PY_START:
        print("Capture...")
        time.sleep(2)
        current_state = PY_DETECTING
        return
    
    elif current_state == PY_DETECTING:
        largest_cup = Cup(0, 298, 0, 544, 298, 544)
        largest_entrance = Entrance(0, 296, 0,  83, 296, 83)
        largest_holder = Holder(0, 157, 0, 204, 157, 204)

        commend = results_processing(largest_cup, largest_entrance, largest_holder)
        print(commend)
        socketio.emit('cup update', {'cup' : commend})
        print("Commend : ", commend)
        time.sleep(1)
        current_state = PY_DETECTED
        return
    
    elif current_state == PY_DETECTED:
        response = state

        while state != 10:
            state += 1
            print(f"Current main state : {state}")
            
            time.sleep(2)

            socketio.emit('state update', {'current main state' : state})

        current_state = PY_READY

@app.route('/')
def index():
    return render_template('UI_test.html')

def start_state_update_loop():
    while True:
        state_update()

if __name__ == "__main__":
    socketio.start_background_task(target=start_state_update_loop)
    socketio.run(app, host = 'localhost', port = 5111, debug = True)