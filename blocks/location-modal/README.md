# Location Modal Block

## Overview
Pincode entry modal with floating label input and API validation.

## Purpose
Allows users to set their delivery location by entering a 6-digit pincode.

## Configuration
No configuration options required.

## Features
- **Floating Label Input**: Animated label on focus/input
- **6-digit Validation**: Max length restriction
- **Auto-complete Support**: Pincode autocomplete enabled

## Integration
- Loaded via fragment path `/modal/location`
- API validation through `checkPincode` function
- Updates parent header location on successful validation

## Behavior
- Label animates to top position when input has focus or value
- Input limited to 6 characters
- Validates pincode format and availability via API

## Error Handling
- Gracefully handles missing DOM elements
- Provides console warnings for debugging
- Falls back to appending wrapper if target element not found

## Dependencies
- `postload.js`: Contains `checkPincode` API function
- `aes-util.mjs`: Utility for encryption/decryption
