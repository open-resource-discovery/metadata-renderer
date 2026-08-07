/**
 * Webpack loader: neutralize Rolldown's CJS require-shim in ESM dists.
 *
 * Vite 8 / Rolldown emits a `var b = ..., x = ((e) => typeof require < "u" ? require : ...)(...)`
 * declaration at the top of any chunk that pulled CommonJS deps inline.
 * In a webpack runtime, `typeof require !== "undefined"` (webpack defines
 * its own `__webpack_require__`-backed `require`), so the shim grabs that
 * and dies on the first `x("react")` call with "Check dependency list!".
 *
 * Strategy — three surgical text replacements anchored on Rolldown's
 * unique error string, without trying to span the multi-line `var` chain
 * with a regex:
 *
 *   1. `typeof require < "u"` → `false`. Forces the shim's outer Proxy
 *      branch and disables the inner function's "use real require" path.
 *
 *   2. `throw Error("Calling \`require\` for \"" + <arg> + ...);` →
 *      `return __SHIM_RESOLVE__(<arg>);`. Makes the function look the
 *      requested name up in our static ESM map instead of throwing.
 *
 *   3. Prepend a small prologue that imports React/jsx-runtime/etc. as
 *      proper ES modules and exposes `__SHIM_RESOLVE__` to step 2.
 */

const PROLOGUE = `
import * as __SHIM_react__ from "react";
import * as __SHIM_reactDom__ from "react-dom";
import * as __SHIM_reactJsxRuntime__ from "react/jsx-runtime";
const __SHIM_MODULES__ = {
    react: __SHIM_react__.default && Object.keys(__SHIM_react__).length === 1 ? __SHIM_react__.default : __SHIM_react__,
    "react-dom": __SHIM_reactDom__.default && Object.keys(__SHIM_reactDom__).length === 1 ? __SHIM_reactDom__.default : __SHIM_reactDom__,
    "react/jsx-runtime": __SHIM_reactJsxRuntime__,
};
const __SHIM_RESOLVE__ = (name) => {
    if (Object.prototype.hasOwnProperty.call(__SHIM_MODULES__, name)) {
        return __SHIM_MODULES__[name];
    }
    throw new Error('Rolldown shim (unmapped): ' + JSON.stringify(name));
};
`;

// Unique error string Rolldown emits in every shim — we use it both to
// detect the shim and to anchor the throw-line replacement.
const ERROR_ANCHOR = `throw Error("Calling \`require\` for `;

module.exports = function rolldownShimLoader(source) {
    if (!source.includes(ERROR_ANCHOR)) {
        return source; // No Rolldown shim → leave the file alone.
    }

    let out = source;

    // Step 1: neutralize every `typeof require < "u"` probe. Three of
    // these exist in the standard shim (outer ternary head, Proxy.get
    // ternary, inner function guard).
    out = out.split(`typeof require < "u"`).join('false');

    // Step 2: replace the `throw Error("Calling \`require\` for ...")`
    // line with a call into our resolver. The throw is a single
    // statement ending with `;`. We capture the function-arg name by
    // looking at the `"\" + <arg> + "\""` interpolation inside the
    // error string.
    //
    // Pattern Rolldown emits:
    //   throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
    const throwRe = /throw Error\("Calling `require` for \\"" \+ (\w+) \+ "\\"[^;]*;/;
    const m = out.match(throwRe);
    if (m) {
        const argName = m[1];
        out = out.replace(throwRe, `return __SHIM_RESOLVE__(${argName});`);
    }

    return PROLOGUE + out;
};
