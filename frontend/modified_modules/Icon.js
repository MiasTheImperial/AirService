function _extends() { 
  return _extends = Object.assign ? Object.assign.bind() : function (n) { 
    for (var e = 1; e < arguments.length; e++) { 
      var t = arguments[e]; 
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); 
    } 
    return n; 
  }, _extends.apply(null, arguments); 
}

import * as React from 'react';
import { I18nManager, Image, Platform } from 'react-native';
import { accessibilityProps } from './MaterialCommunityIcon';
import { Consumer as SettingsConsumer } from '../core/settings';
import { useInternalTheme } from '../core/theming';

const isImageSource = source =>
  // source is an object with uri
  typeof source === 'object' && source !== null && Object.prototype.hasOwnProperty.call(source, 'uri') && typeof source.uri === 'string' ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' ||
  // image url on web
  Platform.OS === 'web' && typeof source === 'string' && (source.startsWith('data:image') || /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source));

const getIconId = source => {
  if (typeof source === 'object' && source !== null && Object.prototype.hasOwnProperty.call(source, 'uri') && typeof source.uri === 'string') {
    return source.uri;
  }
  return source;
};

export const isValidIcon = source => typeof source === 'string' || typeof source === 'function' || isImageSource(source);
export const isEqualIcon = (a, b) => a === b || getIconId(a) === getIconId(b);

/**
 * An icon component which renders icon from vector library.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Icon, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Icon
 *     source="camera"
 *     color={MD3Colors.error50}
 *     size={20}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */

const Icon = ({
  source,
  color,
  size,
  theme: themeOverrides,
  testID,
  ...rest
}) => {
  const theme = useInternalTheme(themeOverrides);
  const direction = typeof source === 'object' && source.direction && source.source ? source.direction === 'auto' ? I18nManager.getConstants().isRTL ? 'rtl' : 'ltr' : source.direction : null;
  const s = typeof source === 'object' && source.direction && source.source ? source.source : source;
  const iconColor = color || (theme.isV3 ? theme.colors.onSurface : theme.colors.text);
  
  if (isImageSource(s)) {
    return /*#__PURE__*/React.createElement(Image, _extends({}, rest, {
      testID: testID,
      source: s,
      style: [{
        transform: [{
          scaleX: direction === 'rtl' ? -1 : 1
        }],
        width: size,
        height: size
      }, rest.style]
    }));
  }
  
  // Handle custom icon components
  if (typeof s === 'function') {
    // FIX: Make sure to use 'new' with class constructors
    if (s.prototype && s.prototype.isReactComponent) {
      const CustomIcon = s;
      return /*#__PURE__*/React.createElement(CustomIcon, _extends({}, rest, {
        testID: testID,
        color: iconColor,
        size: size,
        direction: direction
      }));
    }
    return s({
      color: iconColor,
      size,
      direction,
      testID,
      ...rest
    });
  }
  
  return /*#__PURE__*/React.createElement(SettingsConsumer, null, settings => {
    const IconComponent = settings?.icon;
    if (IconComponent == null) {
      return null;
    }
    return /*#__PURE__*/React.createElement(IconComponent, _extends({}, rest, accessibilityProps, {
      testID: testID,
      name: s,
      color: iconColor,
      size: size,
      direction: direction
    }));
  });
};

Icon.displayName = 'Icon';
export default Icon; 