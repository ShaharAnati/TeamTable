import { RankedTag, Restaurant, TagGroup } from '../models/Restaurant';
import { getAllRestaurants } from '../mongoose/RestaurantsSchema';
import { getAllTagGroups } from '../mongoose/TagsSchema';


export const rankByTags = async (tagNames: string[]): Promise<Restaurant[]> => {
    const restaurants: Restaurant[] = (await getAllRestaurants()).filter(res => res.isVerified);

    if (tagNames.length > 0) {
        const rankedTags: RankedTag[] = await getTagsConstraints(tagNames);
        const singleConstraintValue: number = 1/rankedTags.reduce((sum, currTag) => sum + currTag.constraintLevel, 0);
    
        const rankedRestaurants = restaurants.map(restaurant => {
            return ({
                rank: getSingleRestaurantRankByTags(restaurant, rankedTags, singleConstraintValue),
                ...restaurant
            })
        })
    
        return rankedRestaurants.sort((a, b) => b.rank - a.rank);
    }

    return restaurants;
}

const getSingleRestaurantRankByTags = (restaurant: Restaurant, tags: RankedTag[], singleConstraintValue: number): number => {
    
    return tags.reduce(
        (currRank, currTag) => {
            const doesHaveCurrTag = restaurant.tags.includes(currTag.tagName);
            return currRank + (doesHaveCurrTag ? 1 : 0)*currTag.constraintLevel*singleConstraintValue 
        }
    , 0)
}

const getTagsConstraints = async (tagNames: string[]): Promise<RankedTag[]> => {
    const allTagGroups: TagGroup[] = await getAllTagGroups();

    return tagNames.map(tagName => {
        const currTagGroup: TagGroup = 
            allTagGroups.filter(tagGroup => tagGroup.tags.map(tag => tag.name).includes(tagName))[0];
    
        return {
            tagName,
            constraintLevel: currTagGroup.constraintLevel
        }
    })
}

