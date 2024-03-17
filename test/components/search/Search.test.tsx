import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SearchComponent from '@components/search/Search';

jest.mock('@context/SystemContext', () => ({
  useSystem: jest.fn(() => ({theme: 'light'})),
}));

const mockSearchFunction = jest.fn();

describe('TagSelector', () => {
  const initialSearchResults = [
    {
      itemId: '003912cc-8b89-4d9f-8ab0-024969bc9ead',
      itemName: 'Smith machine incline bench press',
    },
  ];
  const initialFilters = {
    equipments: {
      label: 'Equipment',
      values: ['Bands', 'Barbell'],
    },
    muscleGroups: {
      label: 'Muscle Groups',
      values: ['Abdominals', 'Back'],
    },
    specificMuscles: {
      label: 'Specific Muscles',
      values: ['Adductor Longus', 'Adductor Magnus'],
    },
  };

  it('Should render when open and toggle filters visibility', () => {
    const {getByText, getByTestId} = render(
      <SearchComponent
        initialSearchResults={initialSearchResults}
        initialFilters={initialFilters}
        searchFunction={mockSearchFunction}
        onClickBack={() => {}}
      />,
    );

    // Simulate pressing the filter button to open the filters
    fireEvent.press(getByTestId('filterButton'));

    const equipmentLabel = getByText('Equipment');
    const exercise = getByText('Smith machine incline bench press');
    const muscleGroupLabel = getByText('Muscle Groups');
    const specificMuscle = getByText('Specific Muscles');

    expect(equipmentLabel).toBeTruthy();
    expect(exercise).toBeTruthy();
    expect(muscleGroupLabel).toBeTruthy();
    expect(specificMuscle).toBeTruthy();
  });
});
