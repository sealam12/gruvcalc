# GruvCalc Documentation

## Overview
GruvCalc is a powerful calculator application that allows users to perform various calculations and extend its functionality through plugins. This documentation provides an overview of its features, how to use them, and how to develop custom plugins.

## Functionality Documentation

### Calculator Features
- **Input Field**: Users can type expressions directly into the input field.
- **Preview Area**: Displays the output of the expression being typed.
- **History**: Keeps track of previous calculations.

### Command System
GruvCalc supports a command system that allows users to execute predefined commands. Commands can be added dynamically, and users can access them through the input field.

#### Available Commands
- **Help Command**: Opens the help modal, providing assistance to users.

### Modal Functionalities
Modals are used to display additional information or options to users. The help modal is an example of how modals can enhance user interaction.

## Plugin Development

### Creating Custom Plugins
To create a custom plugin, follow these steps:
1. Create a new JavaScript file in the `static/js/plugins/` directory.
2. Define the plugin object with the following structure:
   ```javascript
   export const YourPluginName = {
       Name: "YourPluginName",
       Description: "Description of your plugin",
       Modals: [
           {
               Name: "modalName",
               Title: "Modal Title",
               Content: "<div>Your content here</div>",
               LoadScript: function() {}
           }
       ],
       Commands: [
           {
               Name: "commandName",
               Preview: Args => "Preview message",
               Evaluate: function(Args) { /* Command logic */ }
           }
       ],
       Assignments: {},
       LoadScript: function() {}
   }
   ```
3. Register your plugin in `PluginCore.js` by adding it to the `Plugins` array.

### Standard Library Documentation
The Standard Library provides a set of predefined modals and commands that can be used within GruvCalc. It serves as a reference for developing custom plugins.

- **Help Modal**: Displays help information to users.
- **Help Command**: Opens the help modal when executed.

## Conclusion
This documentation serves as a guide for users and developers to understand and extend the functionalities of GruvCalc. For further assistance, please refer to the source code or reach out to the development team.
