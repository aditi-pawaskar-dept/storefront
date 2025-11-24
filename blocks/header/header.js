import { loadFragment } from '../fragment/fragment.js';
import { getMetadata } from '../../scripts/aem.js';
import createModal from '../modal/modal.js';
import { checkPincode } from '../location-modal/postload.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  console.log(fragment, "console.log(fragment.firstElementChild);");

  let navContent = fragment;
  let modal;

  const showModal = async (content) => {
    modal = await createModal([content]);
    modal.showModal();
  };

  if (fragment.firstElementChild?.classList.contains('section')) {
    navContent = fragment.firstElementChild.querySelector('.default-content-wrapper');
  }

  const headerNewSection = fragment.querySelector('.header-new-container');

  block.append(navContent);
  block.append(headerNewSection);

  // 🔹 Now that header is appended, attach hover listeners
  // attachHoverListeners();

  const main = document.querySelector('main');
  if (main) {
    main.querySelectorAll('.section').forEach((section) => {
      const wrapper = section.querySelector('.default-content-wrapper');
      const newWrapper = fragment.querySelector('.header-new-container');
      console.log(wrapper, '🧹 Removing duplicate nav section from <main>:', newWrapper);
      if (wrapper) wrapper.remove();
      if (newWrapper) newWrapper.remove();
    });
  }

  // function attachHoverListeners() {
  //   const menuItems = document.querySelectorAll('.header-new.block li');
  //   console.log('Found items:', menuItems.length);

  //   if (!menuItems.length) {
  //     console.warn('⚠️ Header not found yet, retrying...');
  //     setTimeout(attachHoverListeners, 300); // try again after 0.3s
  //     return;
  //   }

  //   menuItems.forEach((item) => {
  //     item.addEventListener('mouseenter', () => {
  //       console.log('Hovered:', item.textContent.trim());
  //     });
  //   });

  //   console.log('✅ Hover listeners attached');
  // }

  function appendMicrosoftButton() {
    const buttonContainer = document.querySelector('.auth-sign-in-form__form__buttons');
    if (!buttonContainer) {
      console.warn("⚠️ Button container not found");
      return;
    }

    // Create Microsoft Button
    const msBtn = document.createElement('button');
    msBtn.role = "button";
    msBtn.type = "button";
    msBtn.setAttribute('data-testid', 'signInWithMicrosoft');
    msBtn.className =
      "dropin-button dropin-button--medium dropin-button--primary auth-button auth-sign-in-form__button auth-sign-in-form__button--submit auth-sign-in-form__button--microsoft";

    // Text inside button
    const span = document.createElement('span');
    span.className = "auth-button__text";
    span.textContent = "Sign in with Microsoft";

    msBtn.appendChild(span);

    msBtn.addEventListener('click', () => {
      console.log("Microsoft login clicked!");
      // TODO: add your Microsoft OAuth logic here
    });

    // Append below Sign In button
    buttonContainer.appendChild(msBtn);


    // Append below Sign In button
    buttonContainer.appendChild(msBtn);
    attachMicrosoftSignIn(msBtn);

    console.log("✅ Microsoft Sign-In button added");
  }
  const msalConfig = {
    auth: {
      // clientId: "68e8bc47-96c7-4ab0-bbe0-28ad5771dc32",
      clientId: "39b13792-0415-43d5-81c7-80962a7a3285",
      authority: "https://login.microsoftonline.com/44a6c9d1-014f-4db6-8e72-af6ebeaac182",
      redirectUri: window.location.origin
    },
    cache: { cacheLocation: "localStorage" }
  };
  let msalInstance;

  async function initMSAL() {
    if (msalInstance) return msalInstance; // Already initialized

    // Wait for MSAL library to load
    let attempts = 0;
    while (typeof window.msal === 'undefined' && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (typeof window.msal === 'undefined') {
      console.error("❌ MSAL library failed to load after 5 seconds");
      throw new Error("MSAL library not available");
    }

    try {
      msalInstance = new window.msal.PublicClientApplication(msalConfig);
      await msalInstance.initialize();
      console.log("✅ MSAL initialized successfully");
      return msalInstance;
    } catch (error) {
      console.error("❌ MSAL initialization failed:", error);
      throw error;
    }
  }

  const navSections = document.querySelector('.default-content-wrapper');
  
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection, index) => {
      // if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', async () => {
        if (index === 0) {

          const hoverContainerPath = '/modal/location';
          const fragment = await loadFragment(hoverContainerPath);
          await showModal(fragment);

          // ---- PINCODE VALIDATION LOGIC ----
          setTimeout(() => {
            const input = document.querySelector('#floatingInput');

            // Find the Apply button by searching all paragraphs in the modal
            const allParagraphs = document.querySelectorAll('.modal-parent p');
            let applyButton = null;

            allParagraphs.forEach((p) => {
              if (p.textContent.trim().toLowerCase() === 'apply') {
                applyButton = p;
              }
            });

            if (applyButton && input) {
              // Initially disable the button
              applyButton.style.opacity = "0.2";
              applyButton.style.pointerEvents = "none";
              applyButton.style.cursor = "not-allowed";

              // Add input event listener
              input.addEventListener('input', () => {
                const value = input.value.trim();

                // Only enable when exactly 6 digits are entered
                if (value.length === 6 && /^\d{6}$/.test(value)) {
                  applyButton.style.opacity = "1";
                  applyButton.style.pointerEvents = "auto";
                  applyButton.style.cursor = "pointer";
                } else {
                  applyButton.style.opacity = "0.5";
                  applyButton.style.pointerEvents = "none";
                  applyButton.style.cursor = "not-allowed";
                }
              });

              // Add click event listener for Apply button
              applyButton.addEventListener('click', async (e) => {
                const pincode = input.value.trim();
                if (!/^\d{6}$/.test(pincode)) {
                  e.preventDefault();
                  console.warn('⚠️ Invalid pincode entered');
                  return;
                }

                const result = await checkPincode(pincode);
                if (result.body.Master[0]?.pincode == undefined) {
                  document.querySelector('dialog')?.close();
                  console.warn('⚠️ Invalid pincode entered');
                  alert('❌ Invalid Pincode. Please try again.');
                  return;
                }

                const pincodeToSet = result.body.Master[0]?.cityname + " " + result.body.Master[0]?.pincode;
                console.log("📍 Pincode to set:", pincodeToSet);

                const locationIcon = document.querySelector('.icon-location');
                const locationContainer = locationIcon?.closest('li');

                if (locationContainer) {
                  const locationTextLi = locationContainer.querySelector('ul li:first-child');
                  if (locationTextLi) {
                    locationTextLi.textContent = pincodeToSet;
                    console.log('📍 Updated header location:', pincodeToSet);
                  }
                }

                document.querySelector('dialog')?.close();
              });
            }
          }, 100);
        }
        if (index === 1) {
          const hoverContainerPath = '/modal/search-modal';
          const fragment = await loadFragment(hoverContainerPath);
          await showModal(fragment);
        }

        if (index === 5) {
          let host = navSection.nextElementSibling;
          if (!host || !host.classList.contains('dropdown-host')) {
            host = document.createElement('div');
            host.className = 'dropdown-host';
            host.style.position = 'relative';
            navSection.after(host); // 🔥 IMPORTANT FIX
          }

          // Toggle only if already initialized
          if (host.dataset.initialized === 'true') {
            const btn = host.querySelector('.nav-dropdown-button');
            btn?.click();
            return;
          }

          // First time rendering
          const module = await import('../header/renderAuthDropdown.js');
          const { renderAuthDropdown } = module;

          renderAuthDropdown(host);
          host.dataset.initialized = 'true';

          const btn = host.querySelector('.nav-dropdown-button');
          const panel = host.querySelector('.nav-auth-menu-panel');

          // Open dropdown
          btn?.click();

          // Close on outside click — only once
          if (!host.dataset.listenerAdded) {
            document.addEventListener('click', (e) => {
              if (!host.contains(e.target) && !navSection.contains(e.target)) {
                panel?.classList.remove('nav-tools-panel--show');
              }
            });
            host.dataset.listenerAdded = 'true';
          }

          setTimeout(() => appendMicrosoftButton(), 300);

          return;
        }

        // toggleAllNavSections(navSections);
        navSection.setAttribute('aria-expanded', 'true');
        // }
      });
      navSection.addEventListener('mouseleave', () => {
        // if (isDesktop.matches) {
        // const expanded = navSection.getAttribute('aria-expanded') === 'true';
        navSection.setAttribute('aria-expanded', 'false');
        // }
      });
    });
  }

  function attachMicrosoftSignIn(button) {
    button.onclick = async () => {
      try {
        console.log("🔐 Initializing MSAL...");

        // Initialize MSAL first
        const msal = await initMSAL();

        console.log("🔐 Attempting Microsoft Sign-In...");

        const loginResponse = await msal.loginPopup({
          scopes: ["openid", "profile", "email"]
        });

        const account = loginResponse.account;
        const tokenResponse = await msal.acquireTokenSilent({
          scopes: ["openid", "profile", "email"],
          account
        });

        const claims = tokenResponse.idTokenClaims;
        const userInfo = {
          given_name: claims.given_name,
          family_name: claims.family_name,
          email: claims.email,
          oid: claims.oid,
          idToken: tokenResponse.idToken.substring(0, 60) + "..."
        };

        console.log("✅ Microsoft Login success:", userInfo);

        // Store user info in localStorage for persistence
        localStorage.setItem('ms_user_info', JSON.stringify({
          firstName: claims.given_name,
          lastName: claims.family_name,
          email: claims.email
        }));

        // Update UI to show user name
        const loginButton = document.querySelector('.nav-dropdown-button');
        if (loginButton) {
          loginButton.textContent = `Hi, ${claims.given_name}`;
        }

        // Show authenticated menu
        const authDropDownMenuList = document.querySelector('.authenticated-user-menu');
        const authDropinContainer = document.querySelector('#auth-dropin-container');

        if (authDropDownMenuList) authDropDownMenuList.style.display = 'block';
        if (authDropinContainer) authDropinContainer.style.display = 'none';

        // Close the modal/dropdown
        const modal = document.querySelector('dialog');
        if (modal) modal.close();

        const authPanel = document.querySelector('.nav-auth-menu-panel');
        if (authPanel) {
          authPanel.classList.remove('nav-tools-panel--show');
        }

      } catch (err) {
        console.error("❌ Microsoft Login error:", err);
        alert(`Login failed: ${err.message || 'Unknown error occurred'}`);
      }
    };
  }
}

// 🔹 Helper function that adds hover event listeners once header exists
