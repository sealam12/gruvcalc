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

<h2>Functionality Documentation</h2>

<h3>Calculator Features</h3>
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

<h3>Command System</h3>
<p>GruvCalc supports a command system that allows users to execute commands. Commands can be added dynamically, and users can access them through the input field.</p>

<h3>How to Use GruvCalc</h3>
<p>To use GruvCalc, follow these steps:</p>
<ol>
    <li>Type your mathematical expression in the input field.</li>
    <li>Press Enter to evaluate the expression.</li>
    <li>View the output in the preview area.</li>
    <li>To access commands, type ">", then command name followed by any necessary arguments.</li>
</ol>`,
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