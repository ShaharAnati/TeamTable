import dayjs from "dayjs";

const getDate = (value, pos) => {
    if (!value || !value[pos]) return null;

    const [hour, min] = value[pos].split(':');
    return dayjs().hour(hour).minute(min).second(0);
}

export const transformRestaurant = (restaurant) => {
    if (!restaurant) return null;

    return {
        ...restaurant,
        openingTimes: Object.entries(restaurant.openingTimes).reduce(
            (newObj, [key, val]) => ({
                ...newObj,
                [key]: [
                    getDate(val, 0),
                    getDate(val, 1),
                ],
            }),
            {}
        ),
    };
};
