// ==UserScript==
// @name         Twitch Horizontal Flip
// @namespace    https://github.com/Phleesty/tampermonkey-scripts
// @version      1.0.1
// @description  Flip Twitch video horizontally with Alt+PageUp
// @author       Phleesty
// @homepageURL  https://github.com/Phleesty/tampermonkey-scripts
// @supportURL   https://github.com/Phleesty/tampermonkey-scripts/issues
// @updateURL    https://raw.githubusercontent.com/Phleesty/tampermonkey-scripts/main/Twitch-Horizontal-Flip.user.js
// @downloadURL  https://raw.githubusercontent.com/Phleesty/tampermonkey-scripts/main/Twitch-Horizontal-Flip.user.js
// @match        https://www.twitch.tv/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let flipped = false;

    function getVideo() {
        return document.querySelector(
            'video[data-a-target="video-player"]'
        ) || document.querySelector('.video-player video');
    }

    function toggleFlip() {
        const video = getVideo();

        if (!video) return;

        flipped = !flipped;
        video.style.transform = flipped ? 'scaleX(-1)' : '';
    }

    document.addEventListener('keydown', (event) => {
        if (
            event.altKey &&
            event.code === 'PageUp' &&
            !event.repeat
        ) {
            event.preventDefault();
            event.stopPropagation();
            toggleFlip();
        }
    }, true);
})();
