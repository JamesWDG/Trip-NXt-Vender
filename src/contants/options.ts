import images from "../config/images";
import labels from "../config/labels";
export interface IOption {
    id: number,
    title: string;
    image: any;
    selected?: boolean
}
export const options: IOption[] = [
    {
        id: 0,
        title: "Create a Ride",
        image: images.bookARide
    },
    {
        id: 1,
        title: labels.manageRestaurant,
        image: images.foodOrder
    },
    {
        id: 2,
        title: "Create Accomodation",
        image: images.bookYourPlace
    }
]