import { AddCommand } from "/static/js/CommandCore.js"
import { AddModal } from "/static/js/ModalCore.js"

import { ExamplePlugin } from "/static/js/plugins/ExamplePlugin.js"

let plugins = [
    ExamplePlugin
]
let loaded_plugins = []

export function FetchLoadedPlugins() { return loaded_plugins; }
export function FetchPlugins() { return plugins; }

export function RemovePlugin(Plugin) {
    // TODO: Set plugins to be installed or removed in database
}

export function LoadPlugin(Plugin) {
    if (Plugin in loaded_plugins) throw new Error(`Attempted to load already loaded plugin ${Plugin.Name}`);
    loaded_plugins.push(Plugin)

    for (const Command of Plugin.Commands) AddCommand(Command);
    for (const Modal of Plugin.Modals) AddModal(Modal);

    for (const AssignmentName in Plugin.Assignments) {
        const AssignmentValue = Plugin.Assignments[AssignmentName];
        window[AssignmentName] = AssignmentValue;
    }

}

function GetCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
  
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trimStart();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

export function PluginSetup() {
    plugins.forEach(Plugin => {
        LoadPlugin(Plugin);
    })

    fetch("/plugins/", {
        method: "GET",
        headers: {
            'cookie': `csrftoken=${GetCookie("csrftoken")}`
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        for (const PluginData of data) {
            const Plugin = (0, eval)(PluginData)
            plugins.push(Plugin)
        }
    })

    // TODO: Fetch plugins from database
}