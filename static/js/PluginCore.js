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
}

export function LoadPlugin(PluginName) {
    const Plugin = GetPlugin(PluginName);

    LoadedPlugins.push(Plugin);
    Plugin.LoadScript();


}

export function PluginSetup() {
    window.GetPlugin = GetPlugin;
    window.IsLoaded = IsLoaded;
    window.IsPersistentLoaded = IsPersistentLoaded;
    window.UnloadPlugin = UnloadPlugin;
    window.LoadPlugin = LoadPlugin;

    for (const Plugin of Plugins) {
        LoadPlugin(Plugin.Name);
    }
}