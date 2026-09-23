// ==UserScript==
// @name         Twitch & Kick Anti-Background Quality Downgrader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents Twitch and Kick from lowering video quality or pausing when the tab is in the background.
// @author       You
// @match        https://*.twitch.tv/*
// @match        https://*.kick.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Подменяем свойства Visibility API, чтобы вкладка всегда считалась "видимой"
    Object.defineProperties(document, {
        'hidden': {
            get: function() { return false; },
            configurable: true
        },
        'visibilityState': {
            get: function() { return 'visible'; },
            configurable: true
        }
    });

    // 2. Блокируем отправку события visibilitychange
    window.addEventListener('visibilitychange', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('visibilitychange', function(e) {
        e.stopImmediatePropagation();
    }, true);

    // 3. Перехватываем стандартный addEventListener, чтобы заглушить события blur и focusout
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'blur' || type === 'focusout' || type === 'visibilitychange') {
            // Переворачиваем логику или просто игнорируем триггер ухода в фон
            const wrappedListener = function(event) {
                // Если плеер пытается проверить фокус через window.blur, мы это изолируем
                if (event.type === 'blur' || event.type === 'focusout') {
                    return;
                }
                if (typeof listener === 'function') {
                    listener.apply(this, arguments);
                } else if (listener && typeof listener.handleEvent === 'function') {
                    listener.handleEvent(event);
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // 4. Дополнительный хак для window.onblur
    Object.defineProperty(window, 'onblur', {
        set: function(value) {
            // Игнорируем попытки сайтов повесить колбэк напрямую
        },
        get: function() {
            return null;
        },
        configurable: true
    });
})();