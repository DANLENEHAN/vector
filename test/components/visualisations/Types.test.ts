import {
  Polygon,
  Point,
  PolygonGroup,
} from '@components/visualisations/BodyMap/Types';

describe('Polygon', () => {
  test('should throw an error if initialized with less than 3 points', () => {
    expect(
      () =>
        new Polygon([
          {x: 0, y: 0},
          {x: 1, y: 1},
        ]),
    ).toThrow('Polygon must have at least three points to form a valid shape.');
  });

  test('should correctly identify a point inside the polygon', () => {
    const polygon = new Polygon([
      {x: 0, y: 0},
      {x: 0, y: 10},
      {x: 10, y: 10},
      {x: 10, y: 0},
    ]);
    const point: Point = {x: 5, y: 5};
    expect(polygon.isPointInPolygon(point)).toBe(true);
  });

  test('should correctly identify a point outside the polygon', () => {
    const polygon = new Polygon([
      {x: 0, y: 0},
      {x: 0, y: 10},
      {x: 10, y: 10},
      {x: 10, y: 0},
    ]);
    const point: Point = {x: 15, y: 15};
    expect(polygon.isPointInPolygon(point)).toBe(false);
  });

  test('should throw an error if initialized with an empty object', () => {
    expect(() => new PolygonGroup({})).toThrowError(
      'PolygonGroup must be initialized with at least one group of polygons.',
    );
  });

  const polygon1 = new Polygon([
    {x: 0, y: 0},
    {x: 0, y: 10},
    {x: 10, y: 10},
    {x: 10, y: 0},
  ]);

  const polygon2 = new Polygon([
    {x: 20, y: 20},
    {x: 20, y: 30},
    {x: 30, y: 30},
    {x: 30, y: 20},
  ]);

  const group = new PolygonGroup({
    'Group 1': [polygon1],
    'Group 2': [polygon2],
  });

  test('should return the correct group key for a point inside one of the polygons', () => {
    const pointInsidePolygon1: Point = {x: 5, y: 5};
    expect(group.isPointInAnyPolygon(pointInsidePolygon1)).toBe('Group 1');

    const pointInsidePolygon2: Point = {x: 25, y: 25};
    expect(group.isPointInAnyPolygon(pointInsidePolygon2)).toBe('Group 2');
  });

  test('should return null for a point outside all polygons', () => {
    const pointOutside: Point = {x: 40, y: 40};
    expect(group.isPointInAnyPolygon(pointOutside)).toBeNull();
  });
});
