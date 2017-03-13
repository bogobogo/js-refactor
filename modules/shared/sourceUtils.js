'use strict';

var esprima = require('esprima');

function sourceUtils(
    functionScopeUtils,
    selectionFactory,
    utilities) {

    function getSourceTokens(vsEditor) {
        var src = utilities.getEditorDocument(vsEditor)._lines.join('\n');
        return esprima.tokenize(src, { loc: true });
    }

    function scopeDataFactory(vsEditor, selectionData) {
        var tokens = getSourceTokens(vsEditor);
        var scopeIndices = functionScopeUtils.findScopeIndices(tokens, selectionData.selectionCoords);
        var scopeBounds = functionScopeUtils.buildBoundsObject(tokens, scopeIndices.top, scopeIndices.bottom);

        return {
            tokens: tokens,
            scopeIndices: scopeIndices,
            scopeBounds: scopeBounds
        };
    }

    function selectionDataFactory(vsEditor) {
        return {
            selection: selectionFactory(vsEditor).getSelection(0),
            selectionCoords: utilities.buildCoords(vsEditor, 0)
        };
    }

    function matchInLine(regex, line) {
        return typeof line === 'string' && line.match(regex) !== null;
    }

    function matchInSource(regex, lines) {
        return matchInLine(regex, lines.join(''))
    }

    return {
        matchInLine: matchInLine,
        matchInSource: matchInSource,
        scopeDataFactory: scopeDataFactory,
        selectionDataFactory: selectionDataFactory,
    }
}

module.exports = sourceUtils;