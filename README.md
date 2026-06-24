# <img src="assets/CustomSplashScreenImage.png" width="40" height="44" align="center" /> BuildRate

BuildRate is a premium **Construction Price Platform** designed to simplify sourcing building materials. It allows users to track daily updated prices of essential construction products, identify lowest local rates, and connect with verified suppliers.

---

## The Idea & Value Proposition

In the construction sector, material costs fluctuate dynamically. Builders, contractors, and individuals often struggle to find the best local rates, wasting hours calling multiple suppliers or dealing with middle-men.

**BuildRate** addresses this by providing:

- **Instant Location-Based Discovery**: Automatically identifies the user's specific local area (e.g., Sarkhej, Thaltej, etc.) to search for nearby suppliers and pricing.
- **Price Transparency**: Compare lowest prices across core construction categories (Cement, Steel, RMC, Sand, Aggregate, Bricks) at a glance.
- **Verified Supplier Catalog**: Discover verified suppliers, highlight top suppliers, and see material details and counts.
- **Supplier Features**: Suppliers can check if their listings offer the lowest price or rank among top performers, with highlighting borders.

---

## Technology Stack

Here are the technologies powering the BuildRate mobile application:

<p align="left">
  <a href="https://reactnative.dev/">
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  </a>
  <a href="https://expo.dev/">
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  </a>
  <a href="https://convex.dev/">
    <img src="https://img.shields.io/badge/Convex-362C5B?style=for-the-badge&logo=convex&logoColor=white" alt="Convex" />
  </a>
  <a href="https://callstack.github.io/react-native-paper/">
    <img src="https://img.shields.io/badge/React_Native_Paper-6200EE?style=for-the-badge&logo=materialdesign&logoColor=white" alt="React Native Paper" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://github.com/react-native-netinfo/react-native-netinfo">
    <img src="https://img.shields.io/badge/NetInfo-000000?style=for-the-badge&logo=react&logoColor=white" alt="NetInfo" />
  </a>
</p>

- **Frontend Framework**: Expo (React Native) for building cross-platform native mobile applications.
- **Database & Backend**: Convex for reactive query updates and server-side data synchronization.
- **UI Library**: React Native Paper for fully customizable Material Design components.
- **Location Services**: Expo Location for device-level GPS tracking and reverse geocoding.
- **Navigation**: Expo Router (file-based navigation system).
- **Network Status Monitoring**: `@react-native-community/netinfo` for device-level network reachability monitoring.

---

## Key Features

1. **Local Area Customization**: GPS-based location detection showing precise area (neighborhood/locality level) rather than just the city.
2. **Advanced Area Filters**: Easily filter suppliers by area in the supplier browser list.
3. **Fluid Interactions**: Micro-animations, bottom sheets, and native screen transitions.
4. **Real-time Live Sync**: Dynamic pricing updates from Convex real-time synchronization framework.
5. **Offline-First Support & Caching**: Cache all suppliers, materials, categories, and pricing locally using persistent AsyncStorage. Cached data loads immediately on screen mount, while background queries refresh data in the background. If the device is offline, it continues displaying cached data alongside a non-intrusive "No Connection" bottom banner.
6. **Gujarati Language Support (ગુજરાતી અનુવાદ)**: Full support for both English and Gujarati languages, allowing users to toggle their preferred language seamlessly.
