import * as turf from '@turf/turf';

export function isPointInPolygon(pointLocation: any, ploygonCoordinates: any) {

    const pt = turf.point([pointLocation.lng,pointLocation.lat]);

    return turf.booleanPointInPolygon(pt, ploygonCoordinates)
}