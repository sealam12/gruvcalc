import { StandardLibrary } from "/static/js/plugins/StandardLibrary.js"

let Plugins = [
    StandardLibrary
] // List of plugins in the library (Objects)
let LoadedPlugins = [] // List of currently loaded plugins (Objects)
let PersistentPluginLoad = [] // List of plugins to be loaded on page load (Objects)

export function GetPlugin(PluginName) {
    return Plugins.filter( Plug => Plug.Name == PluginName )[0];
}

export function IsLoaded(PluginName) { return LoadedPlugins.filter( Plug => Plug.Name == PluginName ).length > 0; }
export function IsPersistentLoaded(PluginName) { return PersistentPluginLoad.filter( Plug => Plug.Name == PluginName ).length > 0; }

export function UnloadPlugin(PluginName) {
    PersistentPluginLoad = PersistentPluginLoad.filter( Plug => Plug.Name != PluginName );
    localStorage.setItem("PersistentPluginLoad", JSON.stringify(PersistentPluginLoad));
}

export function LoadPlugin(PluginName) {
    const Plugin = GetPlugin(PluginName);

    if (!IsPersistentLoaded(PluginName)) {
        PersistentPluginLoad.push(Plugin);
        localStorage.setItem("PersistentPluginLoad", JSON.stringify(PersistentPluginLoad));
    }
    if (IsLoaded(PluginName)) {
        return;
    }

    LoadedPlugins.push(Plugin);
    Plugin.LoadScript();

    for (const Command of Plugin.Commands) window.AddCommand(Command);
    for (const Modal of Plugin.Modals) window.AddModal(Modal);
}

export function PluginSetup() {
    window.GetPlugin = GetPlugin;
    window.IsLoaded = IsLoaded;
    window.IsPersistentLoaded = IsPersistentLoaded;
    window.UnloadPlugin = UnloadPlugin;
    window.LoadPlugin = LoadPlugin;

    const PersLoaded = JSON.parse(localStorage.getItem("PersistentPluginLoad"));

    for (const Plugin of PersLoaded) {
        LoadPlugin(Plugin.Name);
    }
}