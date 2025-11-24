# Product Search Modal Block

## Overview
Search interface with trending searches and promotional banner.

## Purpose
Provides product search functionality with quick access to trending search terms and promotional content.

## Configuration
No configuration options required.

## Features
- **Search Input**: Text input with placeholder for product search
- **Trending Searches**: Clickable pills showing popular search terms
- **Promotional Banner**: Image banner for featured products/offers
- **Flame Icon**: Visual indicator for trending section

## Integration
- Loaded via fragment path `/modal/search-modal`
- Replaces placeholder paragraph with styled input element
- Displays within modal dialog component

## Behavior
- Search input accepts text queries
- Trending search pills are clickable
- Clean, modern UI matching brand guidelines
- Responsive layout for mobile and desktop

## UI Components
1. **Search Bar**: Full-width input at top with bottom border
2. **Trending Section**: Icon + heading + pill tags
3. **Banner**: Full-width promotional image at bottom

## Error Handling
- Gracefully handles missing search paragraph element
- Provides fallback if element replacement fails

## Styling
- White background with proper spacing
- Pill-shaped tags with gray borders
- 700px max width for optimal readability
- Mobile-responsive breakpoints
