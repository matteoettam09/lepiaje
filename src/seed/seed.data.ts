import { BedType, Property, RoomType } from "@/types";
import { v4 as uuidv4 } from "uuid"
import { RoomGender } from "@/types";
import { Property as PropertyEnum } from "@/enums";
import { la_villa_perlata_location, la_villa_perlata_airbnb_url, la_villa_perlata_google_maps_url } from "@/constants/la_villa_perlata_location";
import { al_centesimo_chilometro_booking_url, al_centesimo_chilometro_google_maps_url, al_centesimo_chilometro_location } from "@/constants/centesimo_chilometro_location";

const generateBeds = (count: number, gender: string): BedType[] => Array.from({ length: count }, () => ({
    uuid: String(uuidv4()),
    room_gender: gender,
    occupants: [],
    submittedAt: new Date()
}))

export const bedSeedDataForLaVillaPerlata = generateBeds(3, "mixed")
export const bedSeedDataForAlCentesimoChilometroFemale = generateBeds(4, "female");
export const bedSeedDataForAlCentesimoChilometroMale = generateBeds(6, "male");

export const roomSeedDataForLaVillaPerlata: RoomType[] = [
    {
        uuid: String(uuidv4()),
        beds: bedSeedDataForLaVillaPerlata.map(bed => bed.uuid), // Link to the beds
        name: "Room 1",
        gender: RoomGender.MIXED,
        submittedAt: new Date(),
    }
]

export const roomSeedDataForAlCentesimoChilometroFemale: RoomType[] = [
    {
        uuid: String(uuidv4()),
        gender: RoomGender.FEMALE,
        name: "Room for females",
        beds: bedSeedDataForAlCentesimoChilometroFemale.map(bed => bed.uuid),
        submittedAt: new Date(),
    }
]

export const roomSeedDataForAlCentesimoChilometroMale: RoomType[] = [
    {
        uuid: String(uuidv4()),
        gender: RoomGender.MALE,
        name: "Room for males",
        beds: bedSeedDataForAlCentesimoChilometroMale.map(bed => bed.uuid),
        submittedAt: new Date(),
    }
]

export const propertySeedDataForLePiaje: Property[] = [
    {
        uuid: String(uuidv4()),
        id: PropertyEnum.LA_VILLA_PERLATA,
        name: "La Villa Perlata",
        location_name: "Via del Lago, 65, 01027 Montefiascone VT, Italy",
        price_per_night: 20,
        price_per_additional_guest: 15,
        description: `The accommodation is located 2km from the shores of Lake Bolsena and close to many country trails. You will love it for its views, vast outdoor spaces, atmosphere and privacy. It is suitable for couples and families (with children).
            The space 
            Located in the so-called "Pearl Valley", you will have the opportunity to immerse yourself in nature, crossing numerous paths and reach the lake on foot without being disturbed by the noise of traffic. The accommodation is framed by the fields of the farm, where fruits, olives and especially grapes are produced.
            Guest access
        
            In addition to the garden, you can walk among the pomegranate and olive plantations in front of the house and between the rows of the two vineyards to the left of it, where you can enjoy a magnificent view.
            If the season allows it, you can pick the products of the garden and the fruit trees of organic production.
        
            Other things to note
        
        The rooms are on the first floor. You will find both bed linen and bath linen. Consumption is included in the price.
        `,
        rooms: roomSeedDataForLaVillaPerlata.map(bed => bed.uuid),
        room_features: [
            "6 guests",
            "2 bedrooms",
            "3 beds",
            "2 baths",
            `#1 Bedroom 
               1 queen bed`,
            `#2 Bedroom 
               1 double bed`,
            `Living room
               1 sofa bed`,
        ],
        features: [
            "Scenic views",
            "Garden view",
            "Valley view",
            "Vineyard view",
            "Bathroom",
            "Hair dryer",
            "Shampoo",
            "Body soap",
            "Bidet",
            "Hot water",
            "Bedroom and laundry",
            "Free washer – In unit",
            "Essentials",
            "Towels, bed sheets, soap, and toilet paper",
            "Hangers",
            "Bed linens",
            "Cotton linens",
            "Iron",
            "Clothing storage: walk-in closet and closet",
            "Entertainment",
            "HDTV",
            "Game console: PS3",
            "Exercise equipment",
            "Books and reading material",
            "Family",
            "Crib - available upon request",
            "Babysitter recommendations",
            "Heating and cooling",
            "Central air conditioning",
            "Indoor fireplace: wood-burning",
            "Heating",
            "Home safety",
            "Fire extinguisher",
            "Internet and office",
            "Wifi",
            "Dedicated workspace",
            "In a private space with a laptop stand",
            "Kitchen and dining",
            "Kitchen",
            "Space where guests can cook their own meals",
            "Refrigerator",
            "Cooking basics",
            "Pots and pans, oil, salt and pepper",
            "Dishes and silverware",
            "Bowls, chopsticks, plates, cups, etc.",
            "Freezer",
            "Dishwasher",
            "Gas stove",
            "Oven",
            "Coffee maker: pour-over coffee",
            "Wine glasses",
            "Baking sheet",
            "Barbecue utensils",
            "Grill, charcoal, bamboo skewers/iron skewers, etc.",
            "Dining table",
            "Coffee",
            "Location features",
            "Lake access",
            "Guests can get to a lake using a path or dock",
            "Private entrance",
            "Separate street or building entrance",
            "Outdoor",
            "Private patio or balcony",
            "Private backyard – Not fully fenced",
            "An open space on the property usually covered in grass",
            "Outdoor furniture",
            "Outdoor dining area",
            "BBQ grill",
            "Parking and facilities",
            "Free parking on premises",
            "Services",
            "Long term stays allowed",
            "Allow stay for 28 days or more",
            "Self check-in",
            "Lockbox",
        ],

        location: la_villa_perlata_location,
        airbnb_url_address: la_villa_perlata_airbnb_url,
        google_maps_url_address: la_villa_perlata_google_maps_url,
        submittedAt: new Date()
    },
    {
        uuid: uuidv4(),
        id: PropertyEnum.AL_CENTESIMO_CHILOMETRO,
        name: "Al Centesimo Chilometro",
        location_name: "164 Via Asinello, 01027 Montefiascone, Italy",
        price_per_night: 20,
        price_per_additional_guest: 13,
        description: `Located in Montefiascone, 18 miles from Duomo Orvieto, Al Centesimo Chilometro - Ristoro del Pellegrino has accommodations with a garden, free private parking and a shared lounge. The property is around 12 miles from Cività di Bagnoregio, 12 miles from Villa Lante and 20 miles from Bomarzo - The Monster Park. Certain accommodations at the property have a patio with a garden view.
            With a private bathroom equipped with a shower and a hairdryer, rooms at the hostel also feature free WiFi, while certain rooms are equipped with a city view.
        
            Natural springs of Bagnaccio is 9.4 miles from Al Centesimo Chilometro - Ristoro del Pellegrino, while Villa Lante al Gianicolo is 12 miles from the property. Perugia San Francesco d'Assisi Airport is 60 miles away.
            Couples in particular like the location – they rated it 8.9 for a two-person trip.`,
        rooms: [...roomSeedDataForAlCentesimoChilometroFemale.map(bed => bed.uuid), ...roomSeedDataForAlCentesimoChilometroMale.map(bed => bed.uuid)],
        room_features: [
            "Bed in 4-Bed Male Dormitory Room",
            "Bed in 4-Bed Female Dormitory Room",
            "Bed in Male Dormitory Room",
        ],
        features: [
            "Bathroom",
            "Toilet paper",
            "Towels",
            "Private Bathroom",
            "Toilet",
            "Hairdryer",
            "Shower",
            "Outdoors",
            "Picnic area",
            "Outdoor furniture",
            "Garden",
            "Kitchen",
            "Shared kitchen",
            "Activities",
            "Walking tours",
            "Additional charge",
            "Internet",
            "Wifi is available in all areas and is free of charge.",
            "Parking",
            "Free private parking is available on site (reservation is not needed).",
            "Accessible parking",
            "Services",
            "Shared lounge/TV area",
            "Entertainment & Family Services",
            "Board games/Puzzles",
            "General",
            "Air conditioning",
            "Heating",
            "Chapel/Shrine",
            "Non-smoking rooms",
            "Languages Spoken",
            "English",
            "Italian",
        ],

        location: al_centesimo_chilometro_location!,
        booking_dot_com_url_address: al_centesimo_chilometro_booking_url!,
        google_maps_url_address: al_centesimo_chilometro_google_maps_url,
        submittedAt: new Date()
    }
]