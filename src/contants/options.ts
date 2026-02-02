import images from "../config/images";
import labels from "../config/labels";
export interface IOption {
    id: number,
    title: string;
    image: any;
    selected?: boolean
    type: string;
    screenName: string;
    stack: string;
}
export const options: IOption[] = [
    // {
    //     id: 0,
    //     title: "Create a Ride",
    //     type: 'car_owner',
    //     screenName: 'DriverRegistration',
    //     stack: 'CabStack',
    //     image: images.bookARide
    // },
    {
        id: 1,
        title: labels.manageRestaurant,
        image: images.foodOrder,
        screenName: 'RestaurantDetails',
        stack: 'RestaurantStack',
        type: 'restaurant_owner',
    },
    {
        id: 2,
        title: "Create Accomodation",
        image: images.bookYourPlace,
        type: 'accommodation_owner',
        screenName: 'Accomodation',
        stack: 'Accomodation',
    }
]