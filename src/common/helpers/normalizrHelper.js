import { denormalize } from 'normalizr';

const defaultObject = {};

export function denormalizedData(data, denormalizeKey, schema, entities) {
  if (data) {
    const denormalizedItems = denormalize(data[denormalizeKey], schema, entities);
    return {
      ...data,
      [denormalizeKey]: denormalizedItems
    };
  }
  else {
    return defaultObject;
  }
}
