---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: Proteins
titleTemplate: A primer for JavaScript libraries and frameworks development

hero:
    name: 'Proteins'
    text: ''
    tagline: 'A primer for JavaScript libraries and frameworks development.'
    actions:
        - theme: brand
          text: npm i @chialab/proteins
          link: /guide/

features:
    - title: Events and pool managers
      details: Handle events and event pools with a set of utilities to manage event listeners and event pools.
      icon: |
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M32 26v-2h-2.101a4.968 4.968 0 0 0-.732-1.753l1.49-1.49l-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 26 20.101V18h-2v2.101a4.968 4.968 0 0 0-1.753.732l-1.49-1.49l-1.414 1.414l1.49 1.49A4.968 4.968 0 0 0 20.101 24H18v2h2.101a4.968 4.968 0 0 0 .732 1.753l-1.49 1.49l1.414 1.414l1.49-1.49a4.968 4.968 0 0 0 1.753.732V32h2v-2.101a4.968 4.968 0 0 0 1.753-.732l1.49 1.49l1.414-1.414l-1.49-1.49A4.968 4.968 0 0 0 29.899 26Zm-7 2a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3Z"/><circle cx="7" cy="20" r="2" fill="currentColor"/><path fill="currentColor" d="M14 20a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4Zm0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2Z"/><circle cx="21" cy="12" r="2" fill="currentColor"/><path fill="currentColor" d="M13.02 28.271L3 22.427V9.574l11-6.416l11.496 6.706l1.008-1.728l-12-7a1 1 0 0 0-1.008 0l-12 7A1 1 0 0 0 1 9v14a1 1 0 0 0 .496.864L12.013 30Z"/></svg>

    - title: Utilities first
      details: Handle JS objects and arrays with a set of utilities to manipulate, clone and merge them.
      icon: |
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="m8.914 24.5l4.257-4.257l-1.414-1.414L7.5 23.086l-.793-.793a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0 0 1.414l3 3a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 0-1.414ZM5 28.586L3.414 27L6 24.414L7.586 26Z"/><path fill="currentColor" d="M24 30a6.007 6.007 0 0 1-6-6a5.84 5.84 0 0 1 .21-1.547L9.548 13.79A5.848 5.848 0 0 1 8 14a5.976 5.976 0 0 1-5.577-8.184l.558-1.421l3.312 3.312a1.023 1.023 0 0 0 1.413 0a.999.999 0 0 0 0-1.414L4.395 2.979l1.423-.557A5.977 5.977 0 0 1 14 8a5.84 5.84 0 0 1-.21 1.547l8.663 8.663A5.855 5.855 0 0 1 24 18a5.976 5.976 0 0 1 5.577 8.184l-.557 1.421l-3.313-3.312a1.023 1.023 0 0 0-1.413 0a.999.999 0 0 0-.001 1.414l3.313 3.313l-1.422.558A5.96 5.96 0 0 1 24 30ZM10.062 11.476l10.461 10.461l-.239.61a3.975 3.975 0 0 0 3.466 5.445l-.871-.87a3 3 0 0 1 0-4.243a3.072 3.072 0 0 1 4.243 0l.87.871a3.976 3.976 0 0 0-5.446-3.466l-.609.239l-10.46-10.46l.24-.61A3.975 3.975 0 0 0 8.25 4.008l.87.87a3 3 0 0 1 0 4.243a3.072 3.072 0 0 1-4.243 0l-.87-.871a3.975 3.975 0 0 0 5.445 3.466Z"/><path fill="currentColor" d="M29.123 2.85a3.072 3.072 0 0 0-4.243 0l-7.48 7.48l1.414 1.414l7.48-7.48a1.024 1.024 0 0 1 1.414 0a1.002 1.002 0 0 1 0 1.414l-7.48 7.48l1.414 1.415l7.48-7.48a3.003 3.003 0 0 0 0-4.243Z"/></svg>

    - title: Class helpers
      details: Handle JS classes with a set of utilities to extend, mixin and decorate them.
      icon: |
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M22 2V1h-2v1a7.04 7.04 0 0 1-.08 1h-7.84A7.04 7.04 0 0 1 12 2V1h-2v1c0 3.755 1.97 5.604 4.1 7c-2.13 1.396-4.1 3.245-4.1 7s1.97 5.604 4.1 7c-2.13 1.396-4.1 3.245-4.1 7v1h2v-1a7.04 7.04 0 0 1 .08-1h7.84a7.04 7.04 0 0 1 .08 1v1h2v-1c0-3.755-1.97-5.604-4.1-7c2.13-1.396 4.1-3.245 4.1-7s-1.97-5.604-4.1-7C20.03 7.604 22 5.755 22 2zm-2 14a7.04 7.04 0 0 1-.08 1h-7.84a6.321 6.321 0 0 1 0-2h7.84a7.04 7.04 0 0 1 .08 1zm-.756 11h-6.488A8.908 8.908 0 0 1 16 24.17A8.908 8.908 0 0 1 19.244 27zM16 21.83A8.908 8.908 0 0 1 12.756 19h6.488A8.908 8.908 0 0 1 16 21.83zM19.244 13h-6.488A8.908 8.908 0 0 1 16 10.17A8.908 8.908 0 0 1 19.244 13zM16 7.83A8.908 8.908 0 0 1 12.756 5h6.488A8.908 8.908 0 0 1 16 7.83z" fill="currentColor"/></svg>
---
