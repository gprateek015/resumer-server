import engineeringTemplates from './templates/engineering/index.js';

export const serializeDescription = point => {
  const pattern = /[`&!@#$%^&*_\=\[\];:|<>?~]/g;

  point = point.replace(pattern, match => {
    return '\\' + match;
  });

  return point;
};

const templates = {
  engineeringTemplates
};

export default templates;
