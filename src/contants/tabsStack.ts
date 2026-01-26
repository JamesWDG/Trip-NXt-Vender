import { ImageSourcePropType } from "react-native";
import images from "../config/images";

export interface ITabStack {
    name: string;
    image: ImageSourcePropType;
    navigation: string;
    homeScreen?: string; // Optional: default home screen name for the stack
    flow?: string; // Optional: default home screen name for the stack
}

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