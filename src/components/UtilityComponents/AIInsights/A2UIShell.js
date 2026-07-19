// components/A2UIShell.js (or wherever you place it in your Next.js project)
// This is a React conversion of the provided LitElement code.
// Assumptions:
// - We're using React hooks (useState, useEffect, useRef) for state and lifecycle.
// - Styles are converted to a CSS module (create styles.module.css) or inline for simplicity.
// - A2UIClient, v0_8, UI, and other A2UI imports are assumed to be available (e.g., via @a2ui-sdk/react or similar).
// - Custom elements like <a2ui-surface> are rendered as-is (React supports web components).
// - Snackbar is assumed to be a React component you import or define.
// - Configs are imported as JS objects.
// - For theme toggling, we use CSS custom properties and class toggling on body.
// - No SignalWatcher needed; React state handles reactivity.
// - Form submission and events are handled with React event handlers.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { A2UIClient } from './client.js'; // Adjust path as needed
import { v0_8 } from '@a2ui/lit'; // Or @a2ui-sdk/react equivalent
import * as UI from '@a2ui/lit/ui'; // Adjust if using React SDK
import { useSearchParams } from 'next/navigation'; // For URL params in Next.js
import styles from './A2UIShell.module.css'; // Create this CSS module file
import { Snackbar } from './ui/snackbar.js'; // Assume you have this as a React component
import { repeat } from 'lit/directives/repeat.js'; // If needed for loops, or use React's map

// Configurations (import as JS)
import { AppConfig } from './configs/types.js';
import { config as restaurantConfig } from './configs/restaurant.js';
import { config as contactsConfig } from './configs/contacts.js';

const configs = {
  restaurant: restaurantConfig,
  contacts: contactsConfig,
};

const A2UIShell = () => {
  const searchParams = useSearchParams();
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessages, setLastMessages] = useState([]);
  const [config, setConfig] = useState(configs.restaurant);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [theme, setTheme] = useState(v0_8.Types.Theme.uiTheme); // Assume uiTheme is exported
  const loadingIntervalRef = useRef(null);
  const processorRef = useRef(v0_8.Data.createSignalA2uiMessageProcessor());
  const a2uiClientRef = useRef(null);
  const snackbarRef = useRef(null);
  const pendingSnackbarMessagesRef = useRef([]);

  const appKey = searchParams.get('app') || 'restaurant';
  const selectedConfig = configs[appKey] || configs.restaurant;

  // Theme context provider (if using React Context for theme)
  // For simplicity, apply via CSS vars on mount

  useEffect(() => {
    setConfig(selectedConfig);
    if (selectedConfig.theme) {
      setTheme(selectedConfig.theme);
    }
    document.title = selectedConfig.title;
    document.documentElement.style.setProperty('--background', selectedConfig.background);

    // Initialize client
    const client = new A2UIClient(selectedConfig.serverUrl);
    a2uiClientRef.current = client;

    // Theme toggle initial state (check localStorage or default)
    const isDark = document.body.classList.contains('dark');
    if (isDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, [selectedConfig]);

  const maybeRenderError = useCallback(() => {
    if (!error) return null;
    return <div className={styles.error}>{error}</div>;
  }, [error]);

  const renderThemeToggle = useCallback(() => {
    const handleToggle = (e) => {
      const { colorScheme } = window.getComputedStyle(e.target);
      if (colorScheme === 'dark') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      }
    };

    return (
      <div>
        <button onClick={handleToggle} className={styles.themeToggle}>
          <span className={`${styles.gIcon} ${styles.filledHeavy}`}></span>
        </button>
      </div>
    );
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = formData.get('body') ?? null;
    if (!body) return;

    const message = body; // As v0_8.Types.A2UIClientEventMessage
    await sendAndProcessMessage(message);
  }, []);

  const maybeRenderForm = useCallback(() => {
    if (requesting || lastMessages.length > 0) return null;

    const heroStyle = {
      '--background-image-light': `url(${config.heroImage})`,
      '--background-image-dark': `url(${config.heroImageDark ?? config.heroImage})`,
    };

    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        {config.heroImage && (
          <div style={heroStyle} id="hero-img" className={styles.heroImg}></div>
        )}
        <h1 className={styles.appTitle}>{config.title}</h1>
        <div className={styles.inputGroup}>
          <input
            required
            defaultValue={config.placeholder}
            autoComplete="off"
            id="body"
            name="body"
            type="text"
            disabled={requesting}
            className={styles.input}
          />
          <button type="submit" disabled={requesting} className={styles.submitButton}>
            <span className={`${styles.gIcon} ${styles.filledHeavy}`}>send</span>
          </button>
        </div>
      </form>
    );
  }, [requesting, lastMessages.length, config]);

  const startLoadingAnimation = useCallback(() => {
    if (Array.isArray(config.loadingText) && config.loadingText.length > 1) {
      setLoadingTextIndex(0);
      loadingIntervalRef.current = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % config.loadingText.length);
      }, 2000);
    }
  }, [config.loadingText]);

  const stopLoadingAnimation = useCallback(() => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(async (message) => {
    try {
      setRequesting(true);
      startLoadingAnimation();
      const response = await a2uiClientRef.current.send(message);
      setRequesting(false);
      stopLoadingAnimation();
      return response;
    } catch (err) {
      setError(err.message || 'An error occurred');
      snackbar(err.message || 'Error', 'ERROR'); // Assume snackbar function
      setRequesting(false);
      stopLoadingAnimation();
      return [];
    }
  }, [startLoadingAnimation, stopLoadingAnimation]);

  const maybeRenderData = useCallback(() => {
    if (requesting) {
      let text = 'Awaiting an answer...';
      if (config.loadingText) {
        if (Array.isArray(config.loadingText)) {
          text = config.loadingText[loadingTextIndex];
        } else {
          text = config.loadingText;
        }
      }
      return (
        <div className={styles.pending}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingText}>{text}</div>
        </div>
      );
    }

    const surfaces = processorRef.current.getSurfaces();
    if (surfaces.size === 0) return null;

    const surfaceList = Array.from(surfaces.entries());

    const handleSurfaceAction = useCallback(async (evt) => {
      // Extract evt.detail from custom event (assume dispatched as CustomEvent)
      const detail = evt.detail;
      const target = evt.currentTarget; // Or evt.target
      if (!target) return;

      const context = {};
      if (detail.action.context) {
        const srcContext = detail.action.context;
        for (const item of srcContext) {
          if (item.value.literalBoolean) {
            context[item.key] = item.value.literalBoolean;
          } else if (item.value.literalNumber) {
            context[item.key] = item.value.literalNumber;
          } else if (item.value.literalString) {
            context[item.key] = item.value.literalString;
          } else if (item.value.path) {
            const path = processorRef.current.resolvePath(
              item.value.path,
              detail.dataContextPath
            );
            const value = processorRef.current.getData(
              detail.sourceComponent,
              path,
              detail.surfaceId // Assume from evt
            );
            context[item.key] = value;
          }
        }
      }

      const message = {
        userAction: {
          name: detail.action.name,
          surfaceId: detail.surfaceId,
          sourceComponentId: target.id,
          timestamp: new Date().toISOString(),
          context,
        },
      };

      await sendAndProcessMessage(message);
    }, [sendAndProcessMessage]);

    return (
      <section id="surfaces" className={styles.surfaces}>
        {surfaceList.map(([surfaceId, surface]) => (
          <a2ui-surface
            key={surfaceId}
            className={styles.surface}
            surfaceId={surfaceId}
            surface={surface}
            processor={processorRef.current}
            onA2uiAction={handleSurfaceAction} // Listen for custom event
          />
        ))}
      </section>
    );
  }, [requesting, config, loadingTextIndex, sendAndProcessMessage]);

  const sendAndProcessMessage = useCallback(async (request) => {
    const messages = await sendMessage(request);
    console.log(messages);
    setLastMessages(messages);
    processorRef.current.clearSurfaces();
    processorRef.current.processMessages(messages);
  }, [sendMessage]);

  const snackbar = useCallback((message, type, actions = [], persistent = false, id = crypto.randomUUID(), replaceAll = false) => {
    if (!snackbarRef.current) {
      pendingSnackbarMessagesRef.current.push({ message: { id, message, type, persistent, actions }, replaceAll });
      return;
    }
    snackbarRef.current.show({ id, message, type, persistent, actions }, replaceAll);
  }, []);

  const unsnackbar = useCallback((id) => {
    if (snackbarRef.current) {
      snackbarRef.current.hide(id);
    }
  }, []);

  return (
    <div className={styles.host}>
      {renderThemeToggle()}
      {maybeRenderForm()}
      {maybeRenderData()}
      {maybeRenderError()}
      {/* Snackbar component - assume positioned fixed */}
      <Snackbar ref={snackbarRef} />
    </div>
  );
};

export default A2UIShell;