export type Point = {
  x: number;
  y: number;
};

/**
 * Represents a polygon defined by a series of points.
 */
export class Polygon {
  constructor(public polygonPoints: Point[]) {}

  /**
   * Determines if a given point is inside the polygon using the ray-casting algorithm.
   *
   * @param point - The point to check.
   * @returns true if the point is inside the polygon; otherwise, false.
   */
  isPointInPolygon(point: Point): boolean {
    let isInside = false;
    const n = this.polygonPoints.length;
    if (n < 3) {
      return false;
    }

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const {x: xi, y: yi} = this.polygonPoints[i];
      const {x: xj, y: yj} = this.polygonPoints[j];

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) {
        isInside = !isInside;
      }
    }

    return isInside;
  }
}

export type PolygonGroups<TKey extends string | number> = {
  [key in TKey]?: Polygon[];
};

/**
 * Manages a group of polygons, allowing for point-in-polygon checks across the group.
 */
export class PolygonGroup<TKey extends string | number> {
  constructor(private polygonGroups: PolygonGroups<TKey>) {}

  /**
   * Checks if a point is inside any of the polygons in the group.
   *
   * @param point - The point to check.
   * @returns The key of the polygon group that contains the point, or null if not found.
   */
  isPointInAnyPolygon(point: Point): TKey | null {
    for (const groupKey in this.polygonGroups) {
      const polygons = this.polygonGroups[groupKey];
      if (
        polygons &&
        polygons.some(polygon => polygon.isPointInPolygon(point))
      ) {
        console.log(`Point is inside a polygon in the group: ${groupKey}`);
        return groupKey as TKey;
      }
    }
    return null;
  }
}
