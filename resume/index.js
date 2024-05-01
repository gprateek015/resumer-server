import engineeringTemplates from './templates/engineering/index.js';

export const serializedescription = point => {
  const pattern = /[`&!@#$%^&*_\=\[\]{};:\\|<>?~]/g;
  const matches = [...point.matchAll(pattern)];
  if (matches) {
    let count = 0;
    for (let match of matches) {
      const ind = match.index;
      point = point.split('');
      point.splice(ind + count, 0, '\\');
      point = point.join('');
      count += 1;
    }
    return point;
  }
};

const templates = {
  engineeringTemplates
};

export default templates;
