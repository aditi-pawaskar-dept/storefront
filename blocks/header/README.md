# Header Block

## Overview
The header block provides the main navigation bar for the storefront, including location selection, search functionality, and navigation menu items.

## Features
- **Location Modal**: Click location icon to select delivery pincode (6-digit validation)
- **Search Modal**: Product search with trending searches
- **Responsive Navigation**: Desktop and mobile-friendly navigation menu

## Configuration
The header is loaded from the `/nav` fragment path (configurable via `nav` metadata).

## Integration Details

### Location Modal
- Opens `/modal/location` fragment
- Validates 6-digit pincode input
- Updates header location text with city name and pincode
- Calls `checkPincode()` API for validation

### Search Modal
- Opens `/modal/search-modal` fragment
- Displays trending product searches

## Behavior
- Location icon shows pointer cursor on hover
- Apply button in location modal is disabled until valid 6-digit pincode is entered
- Modal closes automatically after successful pincode submission
- Removes duplicate navigation sections from main content area

## Error Handling
- Invalid pincode displays alert message
- API errors are caught and logged to console
- Graceful fallback if modal elements are not found
