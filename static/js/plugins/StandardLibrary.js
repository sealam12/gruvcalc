export const StandardLibrary = {
    Name: "StandardLibrary",
    Description: "GruvCalc Standard Library",

    Modals: [
        {
            Name: "help",
            Title: "Help",
            Content: `<h1>GruvCalc Documentation</h1>
<h2>Overview</h2>
<p>GruvCalc is a powerful, multimodal calculator application that allows users to perform various calculations and extend its functionality through plugins. This documentation provides an overview of its features and how to use them.</p>

<h3>Calculator Information</h3>
<ul>
    <li><strong>Input Field</strong>: Users can type expressions directly into the input field.</li>
    <li><strong>Preview Area</strong>: Displays the output of the expression being typed.</li>
    <li><strong>History</strong>: Keeps track of previous calculations.</li>
</ul>

<h3>Multi-Modal</h3>
<p>Multi-Modal means that the input field can be manipulated through different modes, triggered by different keybinds or input sequences.</p>
<ul>
    <li><strong>Eval Mode</strong>: Standard input mode, type your expressions and view / save the output.</li>
    <li><strong>Command Mode</strong>: Allows you to use commands (Detailed more later). Triggered by pressing the \ key or entering the > character into the input field while it is empty.</li>
    <li><strong>Hotkey Mode</strong>: Allows you to use hotkeys (Detailed more later). Enabled by typing the @ character into the input field while empty.</li>
</ul>

<h3>Modal System</h3>
<p>GruvCalc is a single page application, so any other content to be displayed is shown via Modals. Modals are a popup window exactly the same as this, shown by plugins or GruvCalc to display additional information or simply expand the functionality of the existing calculator.</p>
<p>Most modals can be found in the "navbar" above the input field. This row of buttons will open the corresponding modals, and any plugins that you install will usually put their "core" modal in the navbar.</p>

<h3>Command System</h3>
<p>GruvCalc supports a command system that allows users to execute commands. You activate command mode by either using the \ keybind or entering > into the input field. Follow the > symbol with a command, and press [Enter] to execute it.</p>
<p>The standard library comes with the following commands:</p>
<ul>
    <li><strong>help</strong>: Opens the Help modal (This modal)</li>
</ul>

<h3>Plugins</h3>
<p>The functionality of GruvCalc can be extended by using Plugins. Plugins are packages created by GruvCalc and other users, designed to help expand GruvCalc where niche cases are present without bloating other users who don't need a certain functionality.</p>
<p>Plugins can be installed through the "Plugins" modal</p>`,
            LoadScript: function() {},
        }
    ],
    Commands: [
        {
            Name: "help",
            Preview: Args => "Shows the help modal.",
            Evaluate: function(Args) {window.OpenModal("help"); return "Help modal opened.";}
        }
    ],
    Assignments: {},
    LoadScript: function() {}
}