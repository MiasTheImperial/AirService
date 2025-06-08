const fs = require('fs');
const path = require('path');

// Path to our fixed versions
const fixedMaterialCommunityIconPath = path.join(__dirname, '../modified_modules/MaterialCommunityIcon.js');
const fixedIconPath = path.join(__dirname, '../modified_modules/Icon.js');

// Paths to the node_modules versions
const targetMaterialCommunityIconPath = path.join(__dirname, '../node_modules/react-native-paper/lib/module/components/MaterialCommunityIcon.js');
const targetIconPath = path.join(__dirname, '../node_modules/react-native-paper/lib/module/components/Icon.js');

// Fix MaterialCommunityIcon.js
if (fs.existsSync(targetMaterialCommunityIconPath) && fs.existsSync(fixedMaterialCommunityIconPath)) {
  console.log('Replacing problematic MaterialCommunityIcon module...');
  try {
    // Read our fixed version
    const fixedContent = fs.readFileSync(fixedMaterialCommunityIconPath, 'utf8');
    // Write it to the node_modules file
    fs.writeFileSync(targetMaterialCommunityIconPath, fixedContent, 'utf8');
    console.log('MaterialCommunityIcon module fixed successfully!');
  } catch (err) {
    console.error('Error replacing MaterialCommunityIcon file:', err);
  }
} else {
  console.log('MaterialCommunityIcon target file or fixed file not found. Skipping replacement.');
}

// Fix Icon.js
if (fs.existsSync(targetIconPath) && fs.existsSync(fixedIconPath)) {
  console.log('Replacing problematic Icon module...');
  try {
    // Read our fixed version
    const fixedContent = fs.readFileSync(fixedIconPath, 'utf8');
    // Write it to the node_modules file
    fs.writeFileSync(targetIconPath, fixedContent, 'utf8');
    console.log('Icon module fixed successfully!');
  } catch (err) {
    console.error('Error replacing Icon file:', err);
  }
} else {
  console.log('Icon target file or fixed file not found. Skipping replacement.');
} 