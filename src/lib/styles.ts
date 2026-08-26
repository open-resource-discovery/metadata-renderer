// Aggregate CSS entry for the lib package. Consumers import this once
// (`import '@open-resource-discovery/metadata-renderer/styles'`) to get every renderer's styles
// in one shot. The a2a-editor / mcp-server-card-ui libraries are Tailwind v4,
// whose preflight reset ships inside `@layer base`; layered styles lose to the
// host page's unlayered resets, so it can't leak into the host page (no
// build-time stripping needed). Side-effect-only file: no exports.
import '@open-resource-discovery/a2a-editor/styles';
import '@open-resource-discovery/mcp-server-card-ui/styles';
import '@open-resource-discovery/overlay-editor/styles';
import '@asyncapi/react-component/styles/default.css';
import '@scalar/api-reference-react/style.css';

export {};
