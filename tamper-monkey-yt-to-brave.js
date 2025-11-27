// ==UserScript==
// @name         YouTube → Brave (Existing Window Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Every YouTube URL in Chrome opens in existing Brave window/tab
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const ytRegex = /^(https?:\/\/)(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)/i;

    function openInBrave(originalUrl) {
        // Pass just the raw URL to the protocol (Brave gets https://... directly)
        const protocolUrl = 'brave-redirect:' + originalUrl
        location.replace(protocolUrl);
        
        // Close the Chrome tab after redirecting
        window.close();
    }

    // Only redirect if the current page URL is YouTube
    if (ytRegex.test(location.href)) {
        openInBrave(location.href);
    }

})();