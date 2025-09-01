import React, { useState } from 'react';

const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

const TRAILER_TYPES = [
  'Dry Van',
  'Reefer',
  'Flatbed',
  'Step Deck',
  'Lowboy',
  'Tanker',
  'Car Hauler',
  'Box Truck',
  'Container',
  'Power Only',
  'Other',
];

const COMMODITY_TYPES = [
  'General Freight',
  'Household Goods',
  'Metals',
  'Machinery',
  'Automotive',
  'Electronics',
  'Food & Beverage',
  'Pharmaceuticals',
  'Chemicals',
  'Hazardous Materials',
  'Oversized Loads',
  'Temperature Controlled',
  'Livestock',
  'Construction Materials',
  'Retail Goods',
  'Agricultural Products',
  'Paper Products',
  'Textiles',
  'Furniture',
  'Medical Supplies',
];

export interface TravelLimitsCommoditiesData {
  travelLimits: {
    maxDistance: number;
    preferredStates: string[];
    restrictedStates: string[];
    maxDaysAway: number;
    homeBaseRadius: number;
    overnightRestrictions: boolean;
    weekendRestrictions: boolean;
  };
  commodities: {
    approved: string[];
    restricted: string[];
    hazmatCertified: boolean;
    temperatureControlled: boolean;
    oversizedCapable: boolean;
    specializedEquipment: string[];
  };
  equipment: {
    maxWeight: number;
    maxLength: number;
    maxHeight: number;
    maxWidth: number;
    trailerTypes: string[];
    powerUnits: number;
  };
}

interface Props {
  onDataConfigured: (data: TravelLimitsCommoditiesData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TravelLimitsCommodities: React.FC<Props> = ({
  onDataConfigured,
  onNext,
  onBack,
}) => {
  const [travelLimits, setTravelLimits] = useState({
    maxDistance: 500,
    preferredStates: [],
    restrictedStates: [],
    maxDaysAway: 7,
    homeBaseRadius: 100,
    overnightRestrictions: false,
    weekendRestrictions: false,
  });
  const [commodities, setCommodities] = useState({
    approved: ['General Freight'],
    restricted: [],
    hazmatCertified: false,
    temperatureControlled: false,
    oversizedCapable: false,
    specializedEquipment: [],
  });
  const [equipment, setEquipment] = useState({
    maxWeight: 80000,
    maxLength: 53,
    maxHeight: 13.5,
    maxWidth: 8.5,
    trailerTypes: ['Dry Van'],
    powerUnits: 1,
  });
  const [tab, setTab] = useState<'travel' | 'commodities' | 'equipment'>(
    'travel'
  );

  const handleNext = () => {
    onDataConfigured({ travelLimits, commodities, equipment });
    onNext();
  };

  return (
    <div>
      <h1>Travel Limits Commodities</h1>
    </div>
  );
};
