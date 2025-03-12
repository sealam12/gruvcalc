import { PluginSetup } from "/static/js/PluginCore.js"
import { CommandSetup } from "/static/js/CommandCore.js"
import { ModalSetup } from "/static/js/ModalCore.js"

export function Setup() {
    PluginSetup();
    CommandSetup();
    ModalSetup();
}

Setup()