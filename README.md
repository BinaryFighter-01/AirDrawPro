# AirDrawPro

## Overview

AirDrawPro is a state-of-the-art gesture-recognition drawing application that leverages computer vision and hand-tracking technologies to enable intuitive air-based drawing. The application utilizes MediaPipe's advanced hand landmark detection coupled with OpenCV for real-time video processing, allowing users to draw seamlessly in the air using natural hand gestures. This project demonstrates the integration of multiple machine learning models, computer vision techniques, and modern web technologies to create an interactive user experience.

---

## Table of Contents

1. [Project Overview](#overview)
2. [Features and Capabilities](#features-and-capabilities)
3. [System Architecture](#system-architecture)
4. [Technical Stack](#technical-stack)
5. [Project Structure](#project-structure)
6. [Installation Guide](#installation-guide)
7. [Usage Instructions](#usage-instructions)
8. [Screenshots and Demonstrations](#screenshots-and-demonstrations)
9. [Model Training](#model-training)
10. [Web Application](#web-application)
11. [Configuration Parameters](#configuration-parameters)
12. [Troubleshooting](#troubleshooting)
13. [Contributing Guidelines](#contributing-guidelines)
14. [License](#license)

---

## Features and Capabilities

### Core Drawing Features

- **Gesture-Based Drawing**: Use your right hand with index finger extended to draw on a virtual canvas in real-time
- **Multi-Hand Recognition**: Simultaneously detects and processes up to two hands for advanced gesture support
- **Canvas Clearing**: Perform left-hand gesture to immediately clear the drawing canvas
- **Smooth Stroke Rendering**: Implements line interpolation between frames for smooth, continuous strokes
- **Real-Time Processing**: Processes video frames at optimal speeds for responsive user interaction
- **Separate Display Windows**: Maintains independent rendering windows for camera feed and drawing canvas

### Technical Capabilities

- **Hand Landmark Detection**: Identifies 21 distinct hand landmarks for precise gesture recognition
- **Finger State Recognition**: Detects index finger pointing position versus resting state
- **Gesture Recognition**: Recognizes thumbs-up and other hand gestures for extended functionality
- **Mirror Image Processing**: Automatically flips camera input for intuitive left-to-right matching
- **Configurable Detection Parameters**: Adjustable confidence thresholds for detection and tracking accuracy

---

## System Architecture

The application follows a modular architecture with clearly defined responsibilities:

```
┌─────────────────────────────────────────────────────┐
│           Video Input (Webcam)                      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│      Image Preprocessing and Conversion             │
│  (BGR to RGB, frame flipping, size adjustment)      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│    Hand Detection and Landmark Extraction           │
│      (MediaPipe HandLandmarker Model)                │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│   Gesture Recognition and State Analysis            │
│  (Finger position, hand type, drawing intent)       │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│    Canvas Rendering and Output Display              │
│    (OpenCV drawing, real-time visualization)        │
└─────────────────────────────────────────────────────┘
```

---

## Technical Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Hand Detection** | MediaPipe | Latest | Real-time hand landmark detection and tracking |
| **Video Processing** | OpenCV (cv2) | 4.x+ | Frame capture, preprocessing, and visualization |
| **Machine Learning** | TensorFlow/Keras | 2.x+ | MNIST model training and inference |
| **Numerical Computing** | NumPy | 1.x+ | Efficient array and numerical operations |
| **Frontend Framework** | Next.js | Latest | Web application interface and deployment |
| **Styling** | Tailwind CSS | Latest | Modern responsive UI design |
| **Language** | Python 3.8+ | 3.8+ | Core application logic |
| **TypeScript** | TypeScript | Latest | Frontend type safety |

---

## Project Structure

```
AirDrawPro/
├── README.md                          # Project documentation (this file)
├── requirements.txt                   # Python package dependencies
├── hand_landmarker.task              # MediaPipe hand tracking model (pre-trained)
├── air_mnist.py                      # Main air drawing application
├── hand_tracking.py                  # Hand detection and landmark extraction module
├── train_models.py                   # MNIST model training script
├── utils.py                          # Utility functions for preprocessing
├── assets/                           # Project assets and screenshots
│   ├── Screenshot 2026-02-19 204334.png
│   ├── Screenshot 2026-02-19 230013.png
│   ├── Screenshot 2026-02-19 230118.png
│   ├── Screenshot 2026-02-19 230400.png
│   └── Screenshot 2026-02-20 151634.png
├── models/                           # Pre-trained machine learning models
│   ├── mnist_model_0.h5             # MNIST model checkpoint 1
│   ├── mnist_model_1.h5             # MNIST model checkpoint 2
│   └── mnist_model_2.h5             # MNIST model checkpoint 3
└── web-app/                          # Next.js web application
    ├── src/
    │   └── app/
    │       ├── layout.tsx            # Root layout component
    │       ├── page.tsx              # Home page
    │       ├── globals.css           # Global styles
    │       └── draw/
    │           └── page.tsx          # Drawing interface page
    ├── package.json                  # NPM dependencies
    ├── tsconfig.json                 # TypeScript configuration
    ├── next.config.js                # Next.js configuration
    ├── tailwind.config.js            # Tailwind CSS configuration
    ├── postcss.config.js             # PostCSS configuration
    └── vercel.json                   # Deployment configuration
```

---

## Installation Guide

### Prerequisites

- Python 3.8 or higher installed on your system
- Webcam or camera device connected to your computer
- At least 4GB RAM for optimal performance
- Modern operating system (Windows, macOS, or Linux)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/AirDrawPro.git
cd AirDrawPro
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# For Windows
python -m venv venv
venv\Scripts\activate

# For macOS and Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

The primary dependencies include:
- **opencv-python**: For video capture and frame processing
- **mediapipe**: For hand detection and landmark extraction
- **numpy**: For numerical computations
- **tensorflow-cpu**: For machine learning model inference

### Step 4: Verify Installation

```bash
python -c "import cv2, mediapipe, tensorflow, numpy; print('All dependencies installed successfully')"
```

---

## Usage Instructions

### Running the Air Drawing Application

Execute the main application with the following command:

```bash
python air_mnist.py
```

### Gesture Controls

| Gesture | Hand | Action | Description |
|---------|------|--------|-------------|
| Index finger extended | Right hand | Draw | Move your right hand with index finger pointing upward to draw on the canvas |
| Index finger folded | Right hand | Pause | Fold your index finger to stop drawing without clearing the canvas |
| Any gesture | Left hand | Clear | Perform any recognizable gesture with your left hand to clear the entire canvas |
| Thumbs up | Either hand | Recognition | Gesture recognized for extended functionality |

### Window Controls

- **Camera Window**: Displays real-time video feed with hand detection overlays and landmark visualization
- **Canvas Window**: Shows the drawing surface where strokes are rendered
- **Exit Application**: Press 'Q' key or close the camera window to terminate the application

### Example Usage Scenario

1. Launch the application: `python air_mnist.py`
2. Allow the webcam to activate and display the video feed
3. Raise your right hand and extend your index finger
4. Move your hand to draw on the canvas display
5. Fold your index finger to pause drawing
6. Use your left hand to clear the canvas
7. Press 'Q' to exit the application

---

## Screenshots and Demonstrations

### Application in Action

The following images demonstrate the AirDrawPro application during operation:

#### Figure 1: Initial Setup
![Application Startup](assets/Screenshot%202026-02-19%20204334.png)
*Initial application window showing camera feed with hand detection enabled*
#### Figure 2: Full Interface
![Full Interface](assets/Screenshot%202026-02-20%20151634.png)
*Complete application interface with synchronized camera and canvas windows*

---

## Model Training

### MNIST Model Overview

The project includes trained MNIST models for digit recognition. These models were created using the TensorFlow/Keras framework.

### Training Process

To train new MNIST models, execute:

```bash
python train_models.py
```

### Training Configuration

- **Dataset**: MNIST (60,000 training samples, 10,000 test samples)
- **Model Architecture**: Convolutional Neural Network (CNN)
  - Conv2D layer: 32 filters, 3x3 kernel, ReLU activation
  - MaxPooling2D: 2x2 pool
  - Conv2D layer: 64 filters, 3x3 kernel, ReLU activation
  - MaxPooling2D: 2x2 pool
  - Flatten layer
  - Dense layer: 128 units, ReLU activation
  - Output layer: 10 units, Softmax activation

- **Training Parameters**:
  - Optimizer: Adam
  - Loss Function: Sparse Categorical Crossentropy
  - Batch Size: 64
  - Epochs: 2 (configurable)
  - Validation Split: 10%

- **Output**: Models saved as `models/mnist_model_0.h5`, `models/mnist_model_1.h5`, `models/mnist_model_2.h5`

### Expected Performance

- Training Accuracy: Approximately 98-99% on MNIST dataset
- Inference Speed: Real-time on CPU
- Model Size: Approximately 1-2 MB per model file

---

## Web Application

### Overview

The web application portion of AirDrawPro provides a modern user interface built with Next.js and React.

### Access the Web Application

Navigate to the `web-app` directory and follow the frontend setup instructions:

```bash
cd web-app
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

### Web Application Features

- **Real-time Canvas Display**: Stream drawing data to web interface
- **Gesture Visualization**: Display detected gestures and hand positions
- **Session Management**: Save and load drawing sessions
- **Responsive Design**: Optimized for various screen sizes using Tailwind CSS
- **Performance Metrics**: Monitor application performance and detection accuracy

---

## Configuration Parameters

### Hand Tracker Configuration

Edit the `HandTracker` initialization in `air_mnist.py` to adjust:

```python
tracker = HandTracker(
    maxHands=2,                    # Maximum number of hands to detect (1-2)
    detection_conf=0.7,            # Hand detection confidence (0.0-1.0)
    tracking_conf=0.7              # Hand tracking confidence (0.0-1.0)
)
```

### Drawing Parameters

Modify line drawing properties in `air_mnist.py`:

```python
line_thickness = 8                 # Stroke thickness in pixels (1-20)
```

### Canvas Preprocessing

Adjust canvas preprocessing in `utils.py` for image enhancement and filtering.

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Webcam Not Detected

**Solution:** Ensure your webcam is properly connected and not in use by another application. Check device permissions in your operating system settings.

#### Issue: Low Detection Accuracy

**Solution:** Improve lighting conditions, increase `detection_conf` and `tracking_conf` values incrementally, and ensure your hand is clearly visible to the camera.

#### Issue: Slow Performance

**Solution:** Reduce video resolution, lower the number of hands being tracked, or use a more powerful machine for processing.

#### Issue: Module Import Errors

**Solution:** Verify all dependencies are installed: `pip install -r requirements.txt`

#### Issue: MediaPipe Model File Not Found

**Solution:** Ensure `hand_landmarker.task` file is in the root directory of the project. Download from MediaPipe official repository if missing.

---

## Contributing Guidelines

### Code Standards

- Follow PEP 8 style guidelines for Python code
- Use meaningful variable and function names
- Implement comprehensive docstrings for functions
- Include inline comments for complex logic
- Maintain type hints where applicable

### Contribution Process

1. Fork the repository on GitHub
2. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
3. Make your changes with appropriate commits
4. Push to your fork: `git push origin feature/your-feature-name`
5. Create a Pull Request with detailed description

### Testing Requirements

- Test all new features thoroughly on multiple systems
- Ensure backward compatibility with existing functionality
- Document any new parameters or configuration options
- Include usage examples in commit messages

---

## License

This project is licensed under the MIT License. See LICENSE file for complete details.

---

## Support and Contact

For issues, feature requests, or contributions, please visit the GitHub repository.

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintained by**: Anil Abhange


