# Travel Wiz~ A Tour Management System

Welcome to **Travel Wiz**, your one-stop solution for all your worldwide travel needs. Whether you're planning a solo adventure, a family vacation, or a romantic getaway, Travel Wiz is here to turn your travel dreams into reality. Our expert team of travel planners is dedicated to providing you with a hassle-free and unforgettable journey by booking through our website.

# Table of Contents

1. [System Description](#system-description)
2. [Component Design](#component-design)
    - [Login/Sign Up Page](#login-sign-up-page)
    - [Auto Search Functionality, Accommodation, Travel Search(Flights), and Attractions](#auto-search-functionality-accommodation-travel-searchflights-and-attractions)
    - [First Half of the Itinerary](#first-half-of-the-itinerary)
    - [Second Half of the Itinerary](#second-half-of-the-itinerary)
    - [Review and Ratings](#review-and-ratings)
    - [Sharing Itinerary, Booking, and Payments](#sharing-itinerary-booking-and-payments)

## System Description
Travel Wiz features a comprehensive dashboard that encompasses a wide range of functionalities to enhance your travel experience. Users interact with an intuitive interface to carry out various activities, including searching and exploring destinations, making reservations for accommodations, finding available flights, managing bookings, and creating customizable itineraries.

## Component Design

### Login/Sign Up Page
- **Component Description:** Users can log in using their email address or a special user ID and password. Options for password reset and various authentication methods including Google OAuth and email OTP are provided.
- **Component User Interface:** The login/signup page allows both new users to create an account and existing users to sign in.
- **Component Objects:** Creation of the signup page, unique user IDs generation, email verification, password encryption, OAuth/OAuth 2.0 Sign in with Google/Facebook.
- **Component Interfaces:** Internal interaction with the database for user data storage, external interaction with Google for OAuth sign-in.
- **Component Error Handling:** Validation for existing email addresses during signup, verification of correct username and password, ensuring uniqueness of usernames.

### Auto Search Functionality, Accommodation, Travel Search(Flights), and Attractions
- **Component Description:** Users can search for places using an autocomplete feature, apply filters for accommodations based on price and reviews, and search for available flights between destinations.
- **Component User Interface:** Autocomplete search bar for cities, filtering hotels based on reviews and prices, displaying available flights between chosen destinations.
- **Component Objects:** Autocomplete search bar, hotel and flight search functionalities, submission forms for hotels and flights.
- **Component Interfaces:** Internal interaction with the database for data retrieval, external interaction for Google Maps API.
- **Component Error Handling:** Validation for available places entered by users.

### First Half of the Itinerary
- **Component Description:** Displaying hotel details, flight submission form, UI changes for itinerary, and backend functionality for "Add to cart" feature.
- **Component User Interface:** Users can add places, hotels, and flights to the cart for itinerary display.
- **Component Objects:** Functionality for displaying hotel details, "Add to cart" feature, account authentication for verified users.
- **Component Interfaces:** Internal interaction with the database for data retrieval.
- **Component Error Handling:** Validation for user input and user authentication.

### Second Half of the Itinerary
- **Component Description:** Enhanced UI for sharing the itinerary and adding comments, ability to view saved locations on the map.
- **Component User Interface:** Users can share the itinerary, add comments, and view saved locations on the map.
- **Component Objects:** Displaying itinerary details, buttons for sharing and commenting, frontend and backend development for comments.
- **Component Interfaces:** Internal interaction with the database for data retrieval, external interaction for Google Maps API.
- **Component Error Handling:** Validation for user input and user authentication.

### Review and Ratings
- **Component Description:** Users can post reviews and ratings for hotels to enhance reliability and customer satisfaction.
- **Component User Interface:** Users can post reviews, give ratings, and delete their own reviews.
- **Component Objects:** Displaying reviews and ratings, button for deleting reviews.
- **Component Interfaces:** Internal interaction with the database for data retrieval.
- **Component Error Handling:** Validation for review ownership and user authentication.

### Sharing Itinerary, Booking, and Payments
- **Component Description:** Users can make flight and accommodation bookings, receive confirmation emails, and share the itinerary with fellow travelers.
- **Component User Interface:** Options for booking flights and hotels, validation for card payments, email confirmation for successful bookings, and sharing functionality.
- **Component Objects:** Buttons for booking, validation for payments, email confirmation, functionality for sharing itinerary.
- **Component Interfaces:** Internal interaction with the database for data retrieval, external interaction for Google Maps API.
- **Component Error Handling:** Validation for user input and user authentication.

## Conclusion
Travel Wiz offers a seamless and comprehensive travel planning experience, providing users with a wide array of features to make their journey hassle-free and memorable. With functionalities ranging from itinerary creation to booking and sharing, Travel Wiz ensures that every aspect of your travel is taken care of efficiently.
