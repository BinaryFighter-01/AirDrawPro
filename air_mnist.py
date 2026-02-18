import cv2
import numpy as np
from hand_tracking import HandTracker
from utils import preprocess_canvas

# Initialize camera
cap = cv2.VideoCapture(0)
tracker = HandTracker(maxHands=2)

# Canvas for drawing
canvas = None

# Previous fingertip position
prev_x, prev_y = None, None  # None to indicate new stroke

# Line thickness
line_thickness = 8

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)  # Mirror image
    h, w, c = frame.shape

    # Initialize canvas same size as frame
    if canvas is None:
        canvas = np.zeros_like(frame)

    hands = tracker.get_hands(frame)

    draw = False
    clear = False
    x, y = 0, 0

    for hand in hands:
        # NOTE: Due to mirror flip, MediaPipe's "Left" is user's RIGHT hand
        hand_type = hand['type']
        landmarks = hand['landmarks']
        fingertip = hand['fingertip']
        
        # MediaPipe "Left" = User's RIGHT hand (drawing hand)
        if hand_type == "Left":
            x, y = fingertip
            # Draw only when index finger is up (pointing)
            index_tip_y = landmarks[8].y
            index_pip_y = landmarks[6].y
            if index_tip_y < index_pip_y:
                draw = True
            else:
                draw = False
                
        # MediaPipe "Right" = User's LEFT hand (control hand)
        elif hand_type == "Right":
            # Clear canvas only with THUMBS UP gesture (deliberate action)
            if hand['thumbs_up']:
                clear = True

    # Add instruction text on camera frame
    cv2.putText(frame, "RIGHT hand: Point index finger to draw", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    cv2.putText(frame, "LEFT hand: Thumbs up to clear canvas", (10, 60), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    cv2.putText(frame, "ESC to exit", (10, 90), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    if clear:
        canvas[:] = 0
        prev_x, prev_y = None, None

    if draw:
        if prev_x is None or prev_y is None:
            # Start a new stroke
            prev_x, prev_y = x, y

        # Draw smooth line
        cv2.line(canvas, (prev_x, prev_y), (x, y), (0, 0, 255), line_thickness)
        prev_x, prev_y = x, y
    else:
        # Stop drawing, reset previous point (allows lifting finger to start new stroke)
        prev_x, prev_y = None, None

    # Show frames
    cv2.imshow("Camera", frame)
    cv2.imshow("Canvas", canvas)

    key = cv2.waitKey(1)
    if key == 27:  # ESC to exit
        break

cap.release()
cv2.destroyAllWindows()
