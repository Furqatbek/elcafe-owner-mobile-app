const { withGradleProperties, withProjectBuildGradle } = require('@expo/config-plugins');

const withKotlinVersion = (config) => {
  // First, modify gradle.properties
  config = withGradleProperties(config, (config) => {
    // Add or update kotlinVersion
    const kotlinVersionProp = config.modResults.find(
      (item) => item.type === 'property' && item.key === 'kotlinVersion'
    );
    if (kotlinVersionProp) {
      kotlinVersionProp.value = '2.0.0';
    } else {
      config.modResults.push({
        type: 'property',
        key: 'kotlinVersion',
        value: '2.0.0',
      });
    }

    return config;
  });

  // Then, modify build.gradle to force Kotlin version
  config = withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents) {
      // Replace any kotlinVersion in ext block with 2.0.0
      config.modResults.contents = config.modResults.contents.replace(
        /kotlinVersion\s*=\s*["'][\d.]+["']/g,
        'kotlinVersion = "2.0.0"'
      );

      // If there's no kotlinVersion in ext, add it after buildscript { ext {
      if (!config.modResults.contents.includes('kotlinVersion')) {
        config.modResults.contents = config.modResults.contents.replace(
          /(buildscript\s*\{\s*ext\s*\{)/,
          '$1\n        kotlinVersion = "2.0.0"'
        );
      }
    }
    return config;
  });

  return config;
};

module.exports = withKotlinVersion;
