const { withGradleProperties } = require('@expo/config-plugins');

const withKotlinVersion = (config) => {
  return withGradleProperties(config, (config) => {
    // Add or update kotlinVersion
    const kotlinVersionProp = config.modResults.find(
      (item) => item.type === 'property' && item.key === 'kotlinVersion'
    );
    if (kotlinVersionProp) {
      kotlinVersionProp.value = '1.9.25';
    } else {
      config.modResults.push({
        type: 'property',
        key: 'kotlinVersion',
        value: '1.9.25',
      });
    }

    // Add suppressKotlinVersionCompatibilityCheck
    const suppressProp = config.modResults.find(
      (item) => item.type === 'property' && item.key === 'kotlin.suppressKotlinVersionCompatibilityCheck'
    );
    if (!suppressProp) {
      config.modResults.push({
        type: 'property',
        key: 'kotlin.suppressKotlinVersionCompatibilityCheck',
        value: 'true',
      });
    }

    return config;
  });
};

module.exports = withKotlinVersion;
