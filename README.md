STUDYFLOW
A Frontend-Only Weekly Study Timetable Planner

Course: ICT 235 – Frontend Software Development
Level: 200 Level
Institution: Bells University of Technology
PROJECT NAME : Web App

1. Introduction

StudyFlow is a frontend-only web app designed to help out students in planning, organizing, their weekly study schedules. The project focuses on solving common academic isusses such as poor time management, overlapping study sessions, and unbalanced work.

Unlike normal  timetable apps that rely heavily on backend infrastructure, StudyFlow is intentionally adding as a client-side solution. This design choice focuses frontend logic, state management, user experience, and responsiveness—key objectives of the ICT 235 course.

The application allows users to create, edit, and manage study sessions within a planned 
weekly view while providing insights into productivity levels and available free time.

2. Project Objectives

The primary objectives of StudyFlow are:

To design a interactive and user-friendly study timetable application 

To enable students to manage study sessions without backend dependencies

To implement intelligent conflict detection between study sessions

To provide productivity insights based on study duration and intensity

To demonstrate modern frontend development practices using React and TypeScript

3. System Architecture Overview

StudyFlow follows a simple , component-based architecture using React and TypeScript.

All application state is handled on the client This ensures that user data remains available across page reloads without requiring a backend server.

Key plan Principles

Clear separation of concerns

Reusable custom hooks for logic

Centralized utility functions for time calculations

Type safety using TypeScript interfaces

Predictable data flow

4. File Structure Overview

The project structure is organized to reflect responsibility-based separation:

types/ – Defines core TypeScript interfaces and constants

hooks/ – Contains reusable logic for session management, persistence, free-time detection, and keyboard shortcuts

lib/ – Utility functions for time calculations and sample data generation

components/ – UI components responsible for rendering the timetable, forms, and insights

styles & config – Tailwind CSS configuration and design tokens

This structure improves readability and supports long-term project maintenance.

5. Design System and User Interface
Design Philosophy

StudyFlow adopts a soft-flat dark interface designed to reduce eye strain and maintain focus during extended study periods. The interface avoids excessive visual noise and prioritizes clarity and calmness.

Color Scheme

Primary background: Dark charcoal (#1e1e1e)

Primary accent: Soft teal (used for actions and highlights)

Muted subject colors for different session types

Low-saturation workload indicators for intensity levels

Typography

Primary font: Inter (for readability)

Monospace font: JetBrains Mono (used for time-related elements)

6. Core Functionalities
6.1 Study Session Management

Users can:

Create new study sessions

Edit existing sessions

Delete sessions when no longer needed

Each session contains:

Course name

Day of the week

Start and end time

Session type (Lecture, Personal Study, Revision)

Study intensity level

Optional notes

6.2 Time Collision Detection

The application prevents overlapping study sessions on the same day.
When a conflict is detected:

The user is informed immediately

The session cannot be saved until the conflict is resolved

This feature ensures schedule consistency and reflects real-world timetable constraints.

6.3 Productivity and Workload Analysis

StudyFlow analyzes total study time and classifies workload levels:

Daily and weekly study duration is calculated

Workload is categorized as:

Light

Balanced

Heavy

Overloaded

This allows users to evaluate whether their schedules are realistic and healthy.

6.4 Focus Mode

Focus Mode helps users concentrate on relevant tasks by:

Highlighting the current day’s sessions

Dimming non-relevant sessions

Displaying a live current-time indicator

This feature improves usability during active study periods.

6.5 Free Time Detection

The application automatically identifies available free time slots between scheduled sessions (within defined study hours).
These slots can be used for:

Revision

Breaks

Additional study planning

7. Data Model

Study sessions are represented using a structured TypeScript interface:

Unique identifier

Time fields stored in 24-hour format

Metadata for creation and updates

This ensures consistency, type safety and reliability 

8. Data Persistence

All user data is stored locally using the browser’s localStorage API.

Key characteristics:

No backend or database required

Data persists across page refreshes

Cross-tab synchronization using storage events

9. Tools and Technologies Used

React (v18) – Component-based UI development

TypeScript – Static typing and reliability

Tailwind CSS – Utility-first styling

Radix UI – Accessible UI primitives

Lucide Icons – Minimal iconography

date-fns – Date and time manipulation

Sonner – Toast notifications

10. Production Readiness

StudyFlow meets production-level frontend standards through:

Complete CRUD functionality

Robust conflict handling

Persistent state management

Responsive design across devices

Accessible UI components

Clean component structure

Strict TypeScript configuration

11. Conclusion

StudyFlow successfully demonstrates how a frontend-only application can deliver meaningful functionality without backend complexity. The project emphasizes user experience, logical correctness, and modern frontend engineering practices.

By combining structured scheduling, intelligent analysis, and a calm user interface, StudyFlow provides a practical solution to academic time management while fulfilling the objectives of the ICT 235 course.
