# Active Context: FluencyTrail

*This document tracks the current focus of development, recent significant changes, immediate next steps, and active decisions. It's the most dynamic part of the Memory Bank.*

## 1. Current Focus

*   **Task:** Language Feature Implementation and Memory Bank Update
*   **Goal:**
    * Implement language management and per-language activity tracking
    * Update Memory Bank documentation to reflect new features

## 2. Recent Changes (Last Session/Significant Updates)

*   Added Language Support:
    * Created `Language` model with migrations
    * Modified `User` model for M-M language relationships and primary language
    * Updated `Activity` model to require language selection
    * Added language management UI in Settings
    * Implemented language selection in ActivityForm
    * Created `NewActivityCell` to handle language data fetching
*   Updated Memory Bank:
    * Refreshed project documentation to reflect language features
    * Enhanced functional requirements with language-specific details

## 3. Immediate Next Steps

*   Update dashboard components to support language filtering:
    * Modify `HeatMapCell`
    * Update `StreakCell`
    * Enhance `TotalTimeCell`
*   Add language-specific stats and analytics
*   Consider UX improvements for language selection and management

## 4. Active Decisions & Considerations

*   Decision: Users must have at least one language (primary) but can add more
*   Decision: Language is required when logging activities
*   Decision: Used Cell pattern for language data fetching in NewActivity
*   Consideration: How to handle historical activities when changing primary language?

## 5. Important Patterns & Preferences

*   Pattern: Using Cells to fetch and prepare data for components (e.g., `NewActivityCell`)
*   Pattern: Required field validation in forms (e.g., `ActivitySchema`)
*   Pattern: Consistent language selection UI across features
*   Pattern: Per-language stats and filtering in analytics

## 6. Learnings & Insights

*   Insight: Cell pattern effectively separates data fetching from presentation
*   Insight: Language management adds complexity to activity stats calculations
*   Insight: User experience benefits from defaulting to primary language in forms

*(This file MUST be updated frequently, ideally at the start and end of work sessions or after significant changes.)*
