import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import os

class HandTracker:
    def __init__(self, maxHands=2, detection_conf=0.7, tracking_conf=0.7):
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, "hand_landmarker.task")
        
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.HandLandmarkerOptions(
            base_options=base_options,
            num_hands=maxHands,
            min_hand_detection_confidence=detection_conf,
            min_tracking_confidence=tracking_conf,
            running_mode=vision.RunningMode.IMAGE
        )
        self.detector = vision.HandLandmarker.create_from_options(options)

    def get_hands(self, frame):
        frameRGB = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frameRGB)
        results = self.detector.detect(mp_image)
        all_hands = []

        if results.hand_landmarks:
            for hand_landmarks, handedness in zip(results.hand_landmarks, results.handedness):
                handType = handedness[0].category_name  # "Left" or "Right"

                # Tip of index finger = landmark 8
                h, w, c = frame.shape
                x = int(hand_landmarks[8].x * w)
                y = int(hand_landmarks[8].y * h)

                # Thumb tip 4, index tip 8 → distance small = thumbs up
                thumb_tip = hand_landmarks[4]
                index_tip = hand_landmarks[8]
                dist = ((thumb_tip.x - index_tip.x)**2 + (thumb_tip.y - index_tip.y)**2)**0.5
                thumbs_up = dist < 0.07  # tuned value

                all_hands.append({
                    "type": handType,
                    "fingertip": (x, y),
                    "thumbs_up": thumbs_up,
                    "landmarks": hand_landmarks
                })

        return all_hands
