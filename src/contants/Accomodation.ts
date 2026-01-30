

export interface IHomeCardData {
    title: string;
    description: string;
}

export const homeCardData: IHomeCardData[] = [
    {
        title: "05",
        description: "Active Rentals",
    },
    {
        title: "$5344",
        description: "My Earnings",
    },
    {
        title: "$54",
        description: "Pending Earnings",
    },
]


import images from "../config/images"
import labels from "../config/labels"

export interface IconList {
    id: string,
    icon: string,
    title: string
}

export interface AccomodationCard {
    id: string,
    image: string,
    title: string
}

export interface Hotel {
    hotelId: number,
    ownerId: number,
    name: string,
    locationId: number,
    status: string,
    phoneNumber: string,
    website: string,
    description: string,
    isActive: boolean,
    rentPerDay: number,
    rentPerHour: number,
    hotelType: string,
    numberOfRooms: number,
    numberOfBathrooms: number,
    numberOfGuests: number,
    numberOfBeds: number,
    checkInTime: string,
    checkOutTime: string,
    images: string[],
    createdAt: string,
    updatedAt: string
}

export const IconListArray: IconList[] = [
    {
        id: "1",
        icon: images.single_room,
        title: labels.singleRoom
    },
    {
        id: "2",
        icon: images.studios,
        title: labels.studios
    },
    {
        id: "3",
        icon: images.appartment,
        title: labels.appartment
    },
    {
        id: "4",
        icon: images.condos,
        title: labels.condos
    },
    {
        id: "5",
        icon: images.hotel_room,
        title: labels.hotelRoom,
    },

]


export const AccomodationListCard: AccomodationCard[] = [
    {
        id: "1",
        image: images.next_gateway,
        title: labels.parisFrance
    },
    {
        id: "2",
        image: images.next_gateway,
        title: labels.oxfordEngland
    },
    {
        id: "3",
        image: images.next_gateway,
        title: labels.newYorkCity
    },
    {
        id: "4",
        image: images.next_gateway,
        title: labels.newYorkCity
    },
    {
        id: "5",
        image: images.next_gateway,
        title: labels.newYorkCity
    },
    {
        id: "6",
        image: images.next_gateway,
        title: labels.newYorkCity
    },
]




export interface CarouselData {
    id: string,
    image: string,
    title: string,
    description: string
}
export const CarouselData: CarouselData[] = [
    {
        id: "1",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "2",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "3",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "4",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
    {
        id: "5",
        image: images.slider_accomodation,
        title: "Journey Starts with a Great Stay",
        description: "Get Extra 25% Off On 1st Booking"
    },
]

export interface RealtorProfileCardType {
    id: string,
    title: string,
}

export const RealtorProfileCard: RealtorProfileCardType[] = [
    {
        id: "1",
        title: "My work: Entrepreneur",
    },
    {
        id: "2",
        title: "I spend too much time: watching reels",
    },
    {
        id: "3",
        title: "For guests, I always: make them feel",
    },
    {
        id: "4",
        title: "What makes my home unique: Cozy.",
    },
    {
        id: "5",
        title: "Most useless skill: Eat - sleep - Netflix.",
    },
    {
        id: "6",
        title: "I'm obsessed with: exploring new places",
    },
    {
        id: "7",
        title: "Speaks English and German",
    },
    {
        id: "8",
        title: "Identity verified",
    }
]
