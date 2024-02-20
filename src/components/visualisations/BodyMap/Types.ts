/**
 * Represents a point in a two-dimensional space.
 *
 * @type {Object} Point
 * @property {number} x - The x-coordinate of the point.
 * @property {number} y - The y-coordinate of the point.
 */
export type Point = {
  x: number;
  y: number;
};

/**
 * Represents a polygon defined by a series of points.
 * Utilizes the ray-casting algorithm to determine if a point is inside the polygon.
 */
export class Polygon {
  constructor(public polygonPoints: Point[]) {
    if (polygonPoints.length < 3) {
      throw new Error(
        'Polygon must have at least three points to form a valid shape.',
      );
    }
  }

  /**
   * Determines if a given point is inside the polygon using the ray-casting algorithm.
   * The algorithm works by casting a horizontal ray from the point to infinity and
   * counting how many times the ray intersects the edges of the polygon. If the count is odd,
   * the point is inside; if even, the point is outside.
   *
   * @param point - The point to check.
   * @returns {boolean} true if the point is inside the polygon; otherwise, false.
   */
  isPointInPolygon(point: Point): boolean {
    let isInside = false;
    const points = this.polygonPoints;
    const n = points.length;

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const {x: xi, y: yi} = points[i];
      const {x: xj, y: yj} = points[j];

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

/**
 * Represents a mapping of keys to arrays of Polygons, facilitating the organization
 * and retrieval of polygonal shapes associated with specific identifiers.
 *
 * @type {Object} PolygonGroups
 * @template TKey - The type of the keys used to index the groups, constrained to string or number types.
 * @property {Polygon[]} [key] - An optional array of Polygon objects associated with a given key.
 *                                Each key represents a distinct group of polygons, potentially
 *                                corresponding to different areas or features within a graphical representation.
 */
export type PolygonGroups<TKey extends string | number> = {
  [key in TKey]?: Polygon[];
};

/**
 * Manages a group of polygons, allowing for point-in-polygon checks across the group.
 * Enables efficient determination of point containment within any polygon in the group.
 */
export class PolygonGroup<TKey extends string | number> {
  constructor(private polygonGroups: PolygonGroups<TKey>) {
    if (Object.keys(polygonGroups).length === 0) {
      throw new Error(
        'PolygonGroup must be initialized with at least one group of polygons.',
      );
    }
  }

  /**
   * Checks if a point is inside any of the polygons in the group.
   * This method iterates over each group of polygons, using the ray-casting algorithm
   * to determine if the point lies within any polygon. Logs the result if debugging is enabled.
   *
   * @param point - The point to check.
   * @returns {TKey | null} The key of the polygon group that contains the point, or null if not found.
   */
  isPointInAnyPolygon(point: Point): TKey | null {
    for (const groupKey in this.polygonGroups) {
      const polygons = this.polygonGroups[groupKey];
      if (polygons?.some(polygon => polygon.isPointInPolygon(point))) {
        return groupKey as TKey;
      }
    }
    return null;
  }
}
