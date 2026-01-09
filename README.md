# Quiz Challenge Application

A timed quiz application built with NextJs, TypeScript, and Tailwind CSS that fetches trivia questions from the Open Trivia Database API.

## Overview

This application presents users with a 15-question quiz experience featuring a countdown timer, progress tracking, and detailed results. Users enter their email, select a difficulty level, and navigate through questions with the ability to review and change answers before submission.

### Approach

The application follows a component-based architecture with centralized state management using React Context. Key architectural decisions include:

- **Context-based State Management**: All quiz state (questions, answers, timer, user progress) is managed in a single QuizContext, ensuring predictable state updates and easy access across components.
- **localStorage Persistence**: Quiz progress and user email are persisted to localStorage, allowing users to resume interrupted sessions.
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes.
- **Animation-first UX**: Framer Motion powers smooth page transitions, selection effects, and celebratory confetti on high scores.

### Components

| Component             | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| **StartPage**         | Email entry with validation, difficulty selection, resume functionality |
| **QuizPage**          | Main quiz interface with timer, question display, navigation panel      |
| **ResultsPage**       | Score breakdown with visual performance bar and question review         |
| **QuestionCard**      | Individual question display with answer options                         |
| **QuestionNavigator** | Visual grid showing question states (visited, answered, current)        |
| **ProgressBar**       | Animated progress indicator with completion percentage                  |
| **Timer**             | Countdown display with visual warnings for low time                     |
| **ThemeToggle**       | Dark/light mode switcher with smooth transitions                        |

### Features

- 30-minute countdown timer with auto-submit
- Question navigation panel with visited/attempted indicators
- Difficulty selection (Easy, Medium, Hard, Mixed)
- Dark mode with vibrant color palette
- Email persistence across sessions
- Resume interrupted quiz sessions
- Detailed question-by-question review

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JainArchit16/Quiz_App.git
   cd quiz-challenge
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Technology Stack

- Next.Js with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn/ui for accessible UI components

## Assumptions

1. Users have a stable internet connection to fetch questions from the Open Trivia Database API.
2. The API is available and returns valid data in the expected format.
3. Users are on a modern browser with JavaScript enabled.
4. Timer continues running even if user navigates between questions within the same session.
5. Users complete the quiz in a single browser tab; multi-tab behavior is not supported.

## Challenges and Solutions

### HTML Entity Decoding

**Problem**: The API returns HTML-encoded strings (e.g., `&quot;` instead of quotes).  
**Solution**: Created a decode helper function using a textarea element to properly decode HTML entities before displaying questions and answers.

### Timer Persistence During Navigation

**Problem**: Timer needed to continue running as users navigate between questions without resetting.  
**Solution**: Used useRef to maintain interval reference and Context for state, ensuring the timer persists across component re-renders.

### Answer Shuffling Consistency

**Problem**: Answers needed random order but had to remain consistent when revisiting questions.  
**Solution**: Shuffle answers once when questions are initially loaded and store the shuffled order, rather than shuffling on each render.

### Auto-submit on Timer End

**Problem**: Required careful cleanup of intervals to prevent memory leaks and ensure proper submission.  
**Solution**: Implemented using useEffect cleanup functions and ref-based interval tracking with proper state validation.

### Quiz State Recovery

**Problem**: Users losing progress when accidentally closing the browser.  
**Solution**: Implemented localStorage persistence that saves quiz state on every change and offers resume option on return.

## Browser Compatibility

Tested and compatible with:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
