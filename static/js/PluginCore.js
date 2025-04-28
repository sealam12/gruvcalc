import { FatalError } from "/static/js/ErrorCore.js";
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
export function IsPersistentLoaded(PluginName) { return PersistentPluginLoad.filter( Plug => Plug == PluginName ).length > 0; }

export function UnloadPlugin(PluginName) {
    PersistentPluginLoad = PersistentPluginLoad.filter( Plug => Plug.Name != PluginName );
    localStorage.setItem("PersistentPluginLoad", JSON.stringify(PersistentPluginLoad));
}

export function LoadPlugin(PluginName) {
    let Plugin = GetPlugin(PluginName);

    if (!Plugin) { return; }
    if (Plugin.FETCH_FROM_URL) {
        return;
    }

    if (!IsPersistentLoaded(PluginName)) {
        PersistentPluginLoad.push(Plugin.Name);
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

export function CleanPersistentLoad(List) {
    for (const Item of List) {
        if (!GetPlugin(Item)) {
            List = List.filter(Val => Val != Item);
        }
    }

    return List;
}

export function PluginSetup() {
    window.GetPlugin = GetPlugin;
    window.IsLoaded = IsLoaded;
    window.IsPersistentLoaded = IsPersistentLoaded;
    window.UnloadPlugin = UnloadPlugin;
    window.LoadPlugin = LoadPlugin;

    PersistentPluginLoad = JSON.parse(localStorage.getItem("PersistentPluginLoad"));
    if (!Array.isArray(PersistentPluginLoad)) {
        PersistentPluginLoad = [];
    }

    PersistentPluginLoad = CleanPersistentLoad(PersistentPluginLoad);

    if (PersistentPluginLoad.length < 1) {
        PersistentPluginLoad = ["StandardLibrary"];
    }

    localStorage.setItem("PersistentPluginLoad", JSON.stringify(PersistentPluginLoad));

    for (const Plugin of PersistentPluginLoad) {
        LoadPlugin(Plugin);
    }
}