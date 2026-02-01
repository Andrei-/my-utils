// ==UserScript==
// @name         Word puzzle munger
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Word puzzle munger
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    // ----------------------------------------
    // COMPLETE CUSTOM MAPPING TABLE (A → Z)
    // Each letter maps to: lowercase + different UPPERCASE + special char
    // Uses different letters for lower and upper case
    // ----------------------------------------
    const MAP = {
        'a': 'xY@',  // a → x+T
        'b': 'pK!',  // b → p+K
        'c': 'kR(',  // c → k+R
        'd': 'bF$',  // d → b+F
        'e': 'wN3',  // e → w+N
        'f': 'vM#',  // f → v+M
        'g': 'jS&',  // g → j+S
        'h': 'nP*',  // h → n+P
        'i': 'lZ!',  // i → l+Z
        'j': 'gQ%',  // j → g+Q
        'k': 'cV^',  // k → c+V
        'l': 'iD|',  // l → i+D
        'm': 'wH$',  // m → w+H
        'n': 'hR+',  // n → h+R
        'o': 'qX0',  // o → q+X
        'p': 'bW?',  // p → b+W
        'q': 'oL=',  // q → o+L
        'r': 'tM-',  // r → t+M
        's': 'zK$',  // s → z+K
        't': 'rG+',  // t → r+G
        'u': 'vJ_',  // u → v+J
        'v': 'fY<',  // v → f+Y
        'w': 'mC>',  // w → m+C
        'x': 'kU*',  // x → k+U
        'y': 'iB/',  // y → i+B
        'z': 'sE$' // z → s+E
    };

    // Fallback for unexpected chars
    const FALLBACK = (c) => "[" + c + "]";

    // ----------------------------------------
    // Transform function
    // ----------------------------------------
    function transform(input) {
        return input
            .toLowerCase()
            .split('')
            .map(c => MAP[c] ?? FALLBACK(c))
            .join('');
    }

    // ----------------------------------------
    // Extract first 3 letters of domain
    // ----------------------------------------
    function getSitePrefix() {
        try {
            const host = window.location.hostname.replace(/^www\./, '');
            const letters = host.replace(/[^a-zA-Z]/g, '');
            if (letters.length >= 3) return letters.substring(0, 3).toLowerCase();
            if (letters.length > 0) return letters.toLowerCase();
        } catch { }
        return null;
    }

    // ----------------------------------------
    // Hotkey listener
    // ----------------------------------------
    document.addEventListener('keydown', function (e) {
        if (!e.ctrlKey || !e.shiftKey || e.key.toLowerCase() !== 'm') return;

        let base = getSitePrefix();
        if (!base) {
            base = prompt("Could not auto-detect domain letters. Enter base manually:");
            if (!base) return;
        }

        const result = transform(base);
        GM_setClipboard(result);

        alert(
            "Just mix it: " + result + "\n\n" +
            "(Copied to clipboard)"
        );
    });
})();
