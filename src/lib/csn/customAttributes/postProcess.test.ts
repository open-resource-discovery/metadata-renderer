import { describe, it, expect } from 'vitest';
import { stripAllAnnotations } from './postProcess';

// Mirrors the HTML shape emitted by @sap/csn-interop-renderer's getDescriptionData:
// restProps.join('<br />') + '<br />' + annotationParts.join('<br />'), where each
// annotation part is `@Key: <code>value</code>` (or `@Key: <a href><code>value</code></a>`).
// Cells are wrapped in a table so the HTML parser preserves the <td> (a bare <td> outside a
// table is discarded and its contents hoisted to <body>).
const cell = (inner: string) => `<table><tbody><tr><td>${inner}</td></tr></tbody></table>`;

describe('stripAllAnnotations', () => {
    it('removes @Key: <code> annotation runs and their <br /> separators', () => {
        const out = stripAllAnnotations(
            cell(
                'type: <code>"String"</code><br />@EndUserText.label: <code>"Name"</code><br />@Semantics.text: <code>true</code>',
            ),
        );
        expect(out).not.toContain('@EndUserText.label');
        expect(out).not.toContain('@Semantics.text');
        // Non-annotation content preserved, with no dangling separators around it.
        expect(out).toContain('type: <code>"String"</code>');
        expect(out).not.toContain('<br>');
    });

    it('removes the @Key: <a href><code> link form', () => {
        const out = stripAllAnnotations(
            cell(
                '@ObjectModel.foreignKey.association: <a href="https://example.com" target="_blank"><code>"ref"</code></a>',
            ),
        );
        expect(out).not.toContain('@ObjectModel.foreignKey.association');
        expect(out).not.toContain('example.com');
    });

    it('preserves <p>-wrapped doc markdown and only strips annotations', () => {
        const out = stripAllAnnotations(cell('<p>Some description</p><br />@EndUserText.label: <code>"Label"</code>'));
        expect(out).toContain('<p>Some description</p>');
        expect(out).not.toContain('@EndUserText.label');
        expect(out).not.toContain('<br>');
    });

    it('handles a cell containing only annotations (becomes empty) without throwing', () => {
        const out = stripAllAnnotations(cell('@A.b: <code>1</code><br />@C.d: <code>2</code>'));
        expect(out).not.toContain('@A.b');
        expect(out).not.toContain('@C.d');
        expect(out).toContain('<td></td>');
    });

    it('strips annotations emitted inside <p> as well as <td>', () => {
        const out = stripAllAnnotations('<p>@API.entity.releaseState: <code>"RELEASED"</code></p>');
        expect(out).not.toContain('@API.entity.releaseState');
    });

    it('leaves html without annotations unchanged in substance', () => {
        const out = stripAllAnnotations(cell('type: <code>"Integer"</code>'));
        expect(out).toContain('type: <code>"Integer"</code>');
    });
});
