# Modal Block

## Overview
Reusable modal component with close functionality and customizable content.

## Purpose
Provides a standardized modal dialog for displaying various content types including location selection and product search.

## Configuration
Accepts content blocks as parameters to display within the modal.

## Features
- **Close Button**: Clickable X button to dismiss modal
- **Backdrop Click**: Closes modal when clicking outside content
- **Keyboard Support**: ESC key support for closing
- **Customizable Content**: Accepts any block content

## Integration
- Created programmatically via `createModal(content)` function
- Returns dialog element with `showModal()` method
- Used by header for location and search modals

## Behavior
- Opens centered on screen
- Prevents body scroll when open
- Closes on backdrop click or close button
- Returns focus to trigger element on close

## Error Handling
- Safely handles missing content
- Prevents multiple instances
- Cleans up event listeners on close

## Styling
- Rounded corners (16px border-radius)
- Responsive sizing
- Custom padding for different modal types
