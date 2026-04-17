(() => {
  'use strict';

  function getBrandContext() {
    const body = document.body;
    return {
      brand: body.dataset.brand || 'omniguard',
      emailUser: body.dataset.emailUser || '',
      emailHost: body.dataset.emailHost || ''
    };
  }

  function getEmailAddress() {
    const { emailUser, emailHost } = getBrandContext();
    return emailUser && emailHost ? `${emailUser}@${emailHost}` : '';
  }

  function initEmail() {
    const email = getEmailAddress();
    if (!email) return;

    document.querySelectorAll('[data-email]').forEach((element) => {
      element.textContent = email;
    });

    document.querySelectorAll('[data-mailto]').forEach((element) => {
      element.href = `mailto:${email}`;
    });
  }

  function initMobileMenu() {
    const button = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    if (!button || !nav) return;

    button.addEventListener('click', () => {
      nav.classList.toggle('active');
      button.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        button.classList.remove('active');
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = form.querySelectorAll('input, textarea');
      const [nameField, emailField, companyField, messageField] = fields;
      const emailAddress = getEmailAddress();
      const { brand } = getBrandContext();
      if (!emailAddress) return;

      const name = nameField?.value || '';
      const email = emailField?.value || '';
      const company = companyField?.value || '';
      const message = messageField?.value || '';

      const subject = `[${brand}] ${name} (${company}) 的咨询`;
      const body = `姓名: ${name}\n邮箱: ${email}\n公司: ${company}\n\n${message}`;

      window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.reset();
    });
  }

  function initAnimations() {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    targets.forEach((element) => observer.observe(element));
  }

  function initTabs() {
    const groups = document.querySelectorAll('[data-tab-group]');
    if (!groups.length) return;

    groups.forEach((group) => {
      const buttons = Array.from(group.querySelectorAll('[data-tab-button]')).filter(
        (element) => element.closest('[data-tab-group]') === group
      );
      const panels = Array.from(group.querySelectorAll('[data-tab-panel]')).filter(
        (element) => element.closest('[data-tab-group]') === group
      );

      if (!buttons.length || !panels.length) return;

      const activate = (tabId) => {
        buttons.forEach((button) => {
          const isActive = button.dataset.tabButton === tabId;
          button.classList.toggle('active', isActive);
          button.setAttribute('aria-selected', isActive ? 'true' : 'false');
          button.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel) => {
          const isActive = panel.dataset.tabPanel === tabId;
          panel.hidden = !isActive;
          panel.classList.toggle('active', isActive);
        });
      };

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const tabId = button.dataset.tabButton;
          if (!tabId) return;
          activate(tabId);
        });
      });

      const initialTab = buttons.find((button) => button.classList.contains('active'))?.dataset.tabButton || buttons[0]?.dataset.tabButton;
      if (initialTab) activate(initialTab);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initEmail();
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initContactForm();
    initTabs();
    initAnimations();
  });
})();
