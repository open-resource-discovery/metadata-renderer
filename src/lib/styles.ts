// Aggregate CSS entry for the lib package. Consumers import this once
// (`import '@open-resource-discovery/metadata-renderer/styles'`) to get every renderer's styles
// in one shot. The a2a-editor / mcp-server-card-ui / overlay-editor libraries
// build on @open-resource-discovery/ui-components, which ships a self-contained,
// `.ord-ui`-scoped reset (unlayered but confined by the `.ord-ui` scope). So the
// reset applies inside each renderer's `.ord-ui` wrapper and beats host resets
// there, while staying scoped so it can't leak into the host page — no
// build-time preflight stripping needed. Side-effect-only file: no exports.
import '@open-resource-discovery/a2a-editor/styles';
import '@open-resource-discovery/mcp-server-card-ui/styles';
import '@open-resource-discovery/overlay-editor/styles';
import '@asyncapi/react-component/styles/default.css';
import '@scalar/api-reference-react/style.css';

export {};
