import React from 'react';
import { render } from '@testing-library/react';
import { HarmonicBar } from './harmonic-bar';

it('renders at all', () => {
  render(<HarmonicBar label={0} onValueChange={() => {}}/>);
});

it('renders label', () => {
  const { getByText } = render(<HarmonicBar label={12} onValueChange={() => {}}/>);
  const linkElement = getByText(/12/i);
  expect(linkElement).toBeInTheDocument();
});


it('renders fraction labels', () => {
  const { getByText } = render(<HarmonicBar label={-8} onValueChange={() => {}}/>);
  const numerator = getByText(/1/i);
  const denominator = getByText(/8/i);
  expect(numerator).toBeInTheDocument();
  expect(denominator).toBeInTheDocument();
});
