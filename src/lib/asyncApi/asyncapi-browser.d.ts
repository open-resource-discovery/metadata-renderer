declare module '@asyncapi/react-component/browser/index.js' {
    export { default } from '@asyncapi/react-component';
}

// The `PluginSlot` enum is defined in this dependency-free leaf module. We import
// the runtime value from here (not from the package root) because the root entry
// pulls in @asyncapi/parser -> @asyncapi/avro-schema-parser -> avsc, which needs
// Node builtins and breaks browser consumers. The browser component's plugin
// system keys on the same string values (INFO = "info"). Types are re-exported
// from the package root and are erased at build time.
declare module '@asyncapi/react-component/lib/esm/types.js' {
    export { PluginSlot } from '@asyncapi/react-component';
}
