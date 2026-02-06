import { ImageSourcePropType } from "react-native";
import images from "../config/images";

export interface ITabStack {
    name: string;
    image: ImageSourcePropType;
    navigation: string;
    screen?: string; // Nested screen name for stack (e.g. RestaurantHome, Orders)
    homeScreen?: string;
    flow?: string;
}

/** Restaurant stack: tab bar visible only on these screens */
export const RESTAURANT_TABS: ITabStack[] = [
    {
        name: 'Home',
        image: images.home_tab,
        navigation: 'RestaurantStack',
        screen: 'RestaurantHome',
        flow: 'RestaurantStack',
    },
    {
        name: 'Restaurant',
        image: images.home_tab,
        navigation: 'RestaurantStack',
        screen: 'RestaurantInfo',
        flow: 'RestaurantStack',
    },
    {
        name: 'Orders',
        image: images.food_tab,
        navigation: 'RestaurantStack',
        screen: 'Orders',
        flow: 'RestaurantStack',
    },
    {
        name: 'Profile',
        image: images.user,
        navigation: 'Profile',
        homeScreen: 'Profile',
        flow: 'mixed',
    },
];

/** Accommodation stack: tab bar visible only on these screens */
export const ACCOMMODATION_TABS: ITabStack[] = [
    {
        name: 'Home',
        image: images.home_tab,
        navigation: 'Accomodation',
        screen: 'Home',
        flow: 'Accomodation',
    },
    {
        name: 'My Hotels',
        image: images.car,
        navigation: 'MyHotels',
        homeScreen: 'Home',
        flow: 'Accomodation',
    },
    {
        name: 'My Bookings',
        image: images.booking,
        navigation: 'BookingLogs',
        homeScreen: 'Home',
        flow: 'Accomodation',
    },
    {
        name: 'Profile',
        image: images.user,
        navigation: 'Profile',
        homeScreen: 'Profile',
        flow: 'mixed',
    },
];

export const TabStackArray: ITabStack[] = [
    {
        name: 'Hotel',
        image: images.home_tab,
        navigation: "Accomodation",
        homeScreen: "Home",
        flow: "Accomodation"
    },
    {
        name: 'Bookings',
        image: images.booking,
        navigation: "BookingLogs",
        homeScreen: "Home",
        flow: "Accomodation"
    },
    {
        name: 'My Hotels',
        image: images.car,
        navigation: "MyHotels",
        homeScreen: "Home",
        flow: "Accomodation"
    },
    {
        name: 'Home',
        image: images.home_tab,
        navigation: "RestaurantHome",
        homeScreen: "RestaurantHome",
        flow: "RestaurantStack",
    },
    {
        name: 'Profile',
        image: images.user,
        navigation: "Profile",
        homeScreen: "Profile",
        flow: "mixed"
    },
]