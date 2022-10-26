import PropTypes from 'prop-types';

export type ValueList = {
  id: string;
  value: string;
};

export const defaultValueList: ValueList = {
  id: 'default',
  value: 'default',
};
export type UtmTarget = {
  label: string;
  tooltip: string;
  error: string;
  RestrictBases: boolean;
  ShowLinks: boolean;
  value: [ValueList];
  target_field: {
    showName: boolean;
    name: string;
    label: string;
    ariaLabel: string;
    tooltip: string;
    error: string;
    value: [ValueList];
  };
};

export const defaultUtmTarget: UtmTarget = {
  label: 'UTM Target',
  tooltip: 'The target URL for the UTM link',
  error: 'Please enter a valid URL',
  RestrictBases: false,
  ShowLinks: false,
  value: [defaultValueList],
  target_field: {
    showName: false,
    name: 'target',
    label: 'Target URL',
    ariaLabel: 'Target URL',
    tooltip: 'The target URL for the UTM link',
    error: 'Please enter a valid URL',
    value: [defaultValueList],
  },
};

export type UtmMedium = {
  showName: boolean;
  label: string;
  tooltip: string;
  error: string;
  ariaLabel: string;
  value: [ValueList];
};

export const defaultUtmMedium: UtmMedium = {
  showName: false,
  label: 'UTM Medium',
  tooltip: 'The medium for the UTM link',
  error: 'Please enter a valid medium',
  ariaLabel: 'UTM Medium',
  value: [defaultValueList],
};

export type UtmObj = {
  showName: boolean;
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
};

export const defaultUtmObj: UtmObj = {
  showName: false,
  label: 'UTM Object',
  ariaLabel: 'UTM Object',
  tooltip: 'The object for the UTM link',
  error: 'Please enter a valid object',
};

export type UtmParams = {
  utm_campaign: UtmObj;
  utm_target: UtmTarget;
  utm_term: UtmMedium;
  utm_medium: UtmMedium;
  utm_source: UtmObj;
};

export const defaultUtmParams: UtmParams = {
  utm_campaign: defaultUtmObj,
  utm_target: defaultUtmTarget,
  utm_term: defaultUtmMedium,
  utm_medium: defaultUtmMedium,
  utm_source: defaultUtmObj,
};

export type TxtFieldParams = {
  ariaLabel: string;
  label: string;
  tooltip: string;
  error: string;
  showName: boolean;
  validated: boolean;
};

export const defaultTxtFieldParams: TxtFieldParams = {
  ariaLabel: 'UTM Object',
  label: 'UTM Object',
  tooltip: 'The object for the UTM link',
  error: 'Please enter a valid object',
  showName: false,
  validated: false,
};

