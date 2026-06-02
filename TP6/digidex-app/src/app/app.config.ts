import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';

const uri = 'http://localhost:4000/'; // ← l'URL de notre serveur GraphQL

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding : injecte le paramètre d'URL (:id) dans input.required()
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(), // Apollo s'appuie sur HttpClient
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({ uri }),
        cache: new InMemoryCache(), // ← cache automatique des résultats
      };
    }),
  ],
};
