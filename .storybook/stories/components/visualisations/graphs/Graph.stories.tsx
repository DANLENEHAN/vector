import React from 'react';
import Graph from '../../../../../src/components/visualisations/graphs/Graph'; // Adjust the import path as necessary
import {SystemProvider} from '../../../../../src/context/SystemContext'; // Adjust the import path as necessary
import {loadingGraphPeriodData} from '../../../../../src/services/timeSeries/Constants'; // Adjust the import path as necessary

export default {
  title: 'components/visualisations/graphs/Graph',
  component: Graph,
  decorators: [
    (Story: any) => (
      <SystemProvider>
        <Story />
      </SystemProvider>
    ),
  ],
};

const Template = args => <Graph {...args} />;

const numberOfDataPoints = 50;
const data = Array.from({length: numberOfDataPoints}).map((_, index) => ({
  value: Math.round(Math.random() * 100),
  index,
  startDate: Date.now() - (numberOfDataPoints - index) * 24 * 60 * 60 * 1000, // Generate a date for each point
  endDate: Date.now() - (numberOfDataPoints - 1 - index) * 24 * 60 * 60 * 1000, // Generate an end date for each point
  showLabel: index % 5 === 0, // Show label every 5 points
  unit: 'kg',
  label: `Day ${index + 1}`,
  axisLabel: `D${index + 1}`,
  numberOfDataPoints: 1,
}));

const remainingArgs = {
  averageValue: 50, // Example average value
  averageLabel: 'Average',
  unit: 'kg',
  maxYValue: 100, // Example max Y value
  minYValue: 0, // Example min Y value
};

export const TenPointsLine = Template.bind({});
TenPointsLine.args = {
  data: data.slice(0, 10),
  chartType: 'line',
  ...remainingArgs,
};

export const TenPointsBar = Template.bind({});
TenPointsBar.args = {
  data: data.slice(0, 10),
  chartType: 'bar',
  ...remainingArgs,
};

export const TwentyFivePointsLine = Template.bind({});
TwentyFivePointsLine.args = {
  data: data.slice(0, 25),
  chartType: 'line',
  ...remainingArgs,
};

export const FiftyPointsLine = Template.bind({});
FiftyPointsLine.args = {
  data: data.slice(0, 50),
  chartType: 'line',
  ...remainingArgs,
};
export const FiftyPointsBar = Template.bind({});
FiftyPointsBar.args = {
  data: data.slice(0, 50),
  chartType: 'bar',
  ...remainingArgs,
};

export const NoData = Template.bind({});
NoData.args = {
  data: [],
  ...remainingArgs,
};

export const Loading = Template.bind({});
Loading.args = {
  ...loadingGraphPeriodData.day,
  loading: true,
};
