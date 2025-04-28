export const StandardLibrary = {
    Name: "StandardLibrary",
    Description: "GruvCalc Standard Library",

    Modals: [
        {
            Name: "help",
            Title: "Help",
            Content: `<h1>GruvCalc Documentation</h1>
<h3>Overview</h3>
<p>GruvCalc is a powerful, multimodal calculator application that allows users to perform various calculations and extend its functionality through plugins. This documentation provides an overview of its features and how to use them.</p>

<h3>Calculator Information</h3>
<ul>
    <li><strong>Input Field</strong>: Type expressions directly into the input field.</li>
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

<h3>Plugins</h3>
<p>The functionality of GruvCalc can be extended by using Plugins. Plugins are packages created by GruvCalc and other users, designed to expand GruvCalc helpful ways by extending the standard functionality.</p>
<p>Plugins can be installed through the "Plugins" modal. Because of the way the plugin framework is stuctured, you must reload the page after you remove a plugin for changes to take place.</p>`,
            LoadScript: function() {},
        },
        
        {
            Name: "plugins",
            Title: "Plugins",
            Content: `<h1>GruvCalc Plugins Library</h1>
<p>When uninstalling a plugin, changes will be applied after the page reloads.</p>
<button class="button" style="width: 100%; margin-bottom:10px;" id="STANDARD_LIB:PLUGINS:REFRESH_LISTING">Refresh</button>
<div class="box" style="height: 300px;" id="STANDARD_LIB:PLUGINS:LISTING">
</div>`,
            LoadScript: function() {

            },
        },
    ],
    Commands: [
        {
            Name: "help",
            Preview: Args => "Opens the help modal.",
            Evaluate: function(Args) { window.OpenModal("help"); return "Help modal opened."; }
        },
        {
            Name: "plugins",
            Preview: Args => "Opens teh plugins modal.",
            Evaluate: function(Args) { window.OpenModal("plugins"); return "Plugins modal opened"; }
        },
        {
            Name: "modal",
            Preview: function(Args) {
                try { return `Opening modal ${window.GetModal(Args[0]).Title}`; }
                catch { return "Opens the designated modal."; }
            },
            Evaluate: function(Args) { try { window.OpenModal(Args[0]); return "Modal opened."; } catch { throw new Error("Could not find designated modal."); } }
        },
        {
            Name: "mdl",
            Preview: function(Args) {
                try { return `Opening modal ${window.GetModal(Args[0]).Title}`; }
                catch { return "Opens the designated modal."; }
            },
            Evaluate: function(Args) { try { window.OpenModal(Args[0]); return "Modal opened."; } catch { throw new Error("Could not find designated modal."); } }
        },
        {
            Name: "clear",
            Preview: Args => "Clears the history",
            Evaluate: function(Args) {
                setTimeout(function() {
                    $("#history").html("");
                }, 1)
                return "History cleared.";
            }
        },
        {
            Name: "admin",
            Preview: Args => "Redirects to the admin page.",
            Evaluate: Args => window.location.href = "/admin/",
            ExcludeAutocomplete: true
        }
    ],
    Assignments: {},
    LoadScript: function() {}
}