# Header Block

## Overview
Main navigation header with location selector, search functionality, and authentication features.

## Purpose
Provides primary site navigation, location selection via pincode, and product search capabilities.

## Configuration
- Navigation structure loaded from `/nav` fragment
- Modal paths configured for location and search

## Features
- **Location Selector**: Click to open pincode entry modal
  - 6-digit pincode validation
  - API integration for pincode verification
  - Updates header with city name and pincode
- **Search Modal**: Opens product search interface with trending searches
- **Hover Listeners**: Tracks menu item interactions

## Integration
- Uses `loadFragment` for navigation content
- Integrates with `createModal` for modals
- Calls `checkPincode` API for location validation

## Behavior
- Location icon shows pointer cursor on hover
- Apply button disabled until valid 6-digit pincode entered
- Modal closes on successful pincode submission
- Updates header location text dynamically

## Error Handling
- Validates pincode format before API call
- Shows alert for invalid pincodes
- Closes modal on API validation failure
- Console warnings for missing elements
