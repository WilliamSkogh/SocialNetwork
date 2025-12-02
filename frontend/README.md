# Social Network - Frontend
Detta är frontend-applikationen för Social Network, byggd med React 19, TypeScript och Vite.

Applikationen använder en ren arkitektur med separerad logik för autentisering (JWT), API-anrop och state-hantering.

## Tech Stack
- Core: React 19, TypeScript

- Build Tool: Vite

- Routing: React Router DOM

- HTTP Client: Axios (med interceptors för token-hantering)

- Testing: Vitest

- Linting: ESLint

## Kom igång

Följ dessa steg för att köra projektet lokalt.

1. Förberedelser
Se till att du har Node.js installerat. Du bör även ha Backend-API:et igång lokalt för att inloggning och registrering ska fungera (vanligtvis på port 7166 eller 5131).

2. Installera beroenden
Installera alla nödvändiga paket från package.json:

`npm install`

3. Starta utvecklingsservern
Starta applikationen i dev-läge med Hot Module Replacement (HMR):

```npm run dev```

Applikationen startar normalt på http://localhost:5173.

## Tester
Vi använder Vitest för enhetstester. Testerna täcker bland annat AuthService och logik kring inloggning/registrering.

```npm run test ```

## Tillgängliga scripts
```npm run dev ``` Startar lokal utvecklingsmiljö

```npm run test``` Kör alla enhetstester med Vitest.

```npm run build``` Kompilerar Typescript och bygger applikationen för 
produktion.

```npm run preview``` Förhandsgranskar produktionsbygget lokalt.

```npm run lint``` Kör ESLint för att hitta kodfel och stilproblem




