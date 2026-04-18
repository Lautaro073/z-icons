# Plan de Refactor — Clean Code & Clean Architecture (100%)

Fecha: 2026-04-17

Resumen: ejecutar un refactor integral del repositorio para alcanzar una base 100% alineada con principios de Clean Code y Clean Architecture en 3 sprints (2–3 sprints). Reglas estrictas desde el inicio; excepciones temporales controladas y con fecha límite.

**Índice**
- Visión general
- Orden de ejecución
- Backlog por sprint (Sprint 1 / Sprint 2 / Sprint 3)
- Excepciones temporales permitidas
- Secuencia de commits (Conv. Commits)
- Matriz de riesgos y mitigación
- KPIs / Métricas de éxito
- Archivos y zonas a tocar (lista concreta)

---

## Visión general

Objetivo: separar responsabilidades (UI / dominio / infraestructura), fijar contratos públicos por módulo, eliminar acoplamientos cross-layer y dejar el proyecto en un estado verificable por CI donde cero violaciones críticas de lint/arquitectura detengan la integración.

Reglas iniciales (estricto):
- Activar reglas ESLint/TS que impidan imports desde UI → dominio → infra contrarios a la dirección de dependencia.
- Todos los módulos públicos deben exponer API mediante `index.ts` (barrel) cuando correspondan.
- Componentes React: presentación pura si es posible; lógica de negocio en hooks/servicios.
- Side-effects concentrados en adaptadores/puertos dentro de `src/lib` o `src/app/api`.

---

## Orden de ejecución recomendado (prioridad para minimizar riesgo)

1. Baseline y reglas (lint/ts/ci) — [eslint.config.mjs](eslint.config.mjs), [tsconfig.json](tsconfig.json), [package.json](package.json), [README.md](README.md)
2. Contratos públicos y barrels — `src/features/*`, `src/lib/*`, `src/components/*`
3. Aislar infra y APIs — [src/lib/api/backend.ts](src/lib/api/backend.ts), [src/lib/server](src/lib/server), [src/app/api](src/app/api)
4. Refactor dominio (features) — `src/features/admin`, `src/features/icons-explorer`, `src/features/user`
5. Normalizar `hooks` y extraer responsabilidades — `src/hooks` y `src/features/*/hooks`
6. Normalizar estado global — `src/store`, `src/contexts/AuthContext.tsx`
7. UI y componentes presentacionales — `src/components/common`, `src/components/controllers`, `src/components/guards`
8. i18n, rutas y tests e2e — `src/i18n`, `src/app/[locale]`, `tests/e2e`

---

## Backlog por sprint

### Sprint 1 — Baseline y contratos (2 semanas aprox.)
- Objetivo: imponer reglas, definir boundaries y estabilizar API pública de módulos.
- Alcance (archivos/carpetas):
	- [eslint.config.mjs](eslint.config.mjs), [tsconfig.json](tsconfig.json), [package.json](package.json), [README.md](README.md)
	- [src/features/admin/index.ts](src/features/admin/index.ts), [src/features/icons-explorer/index.ts](src/features/icons-explorer/index.ts), [src/features/user/components/index.ts](src/features/user/components/index.ts)
	- [src/lib/preferences/contract.ts](src/lib/preferences/contract.ts), [src/types](src/types)
- Deliverables / DoD:
	- CI actualizado y fallos en PRs por violaciones críticas.
	- Cada feature con `index.ts` público donde aplique.
	- Documentación de reglas y límites en `README.md`.

### Sprint 2 — Separación de infra y dominio (2 semanas aprox.)
- Objetivo: extraer infra y lógica del UI; introducir adaptadores/puertos.
- Alcance:
	- [src/lib/api/backend.ts](src/lib/api/backend.ts), [src/lib/server](src/lib/server), [src/app/api/preferences/route.ts](src/app/api/preferences/route.ts)
	- `src/features/admin/components`, `src/features/admin/hooks`
	- `src/hooks/*` principales (usePremiumAccess, useSessionDraft, useIconExport)
- DoD:
	- HTTP y side-effects dentro de `src/lib/api` o adaptadores en `src/lib/server`.
	- Componentes sin lógica de negocio; hooks y servicios orquestando flujos.

### Sprint 3 — Estado, UI y cierre (2 semanas aprox.)
- Objetivo: homogenizar estado y UI, cerrar excepciones, asegurar tests.
- Alcance:
	- `src/store/*`, `src/contexts/AuthContext.tsx`, `src/components/common`, `src/components/controllers`, `src/components/guards`
	- `src/i18n/*`, `src/app/[locale]/*`, `tests/e2e/*`
- DoD:
	- Estado con single sources-of-truth por dominio.
	- E2E críticos verdes.
	- Excepciones temporales cerradas (0 abiertas).

---

## Excepciones temporales permitidas (controladas)

- Adaptadores puente para `backend.ts` (ej.: wrapper que expone la API actual y mapea a la nueva interfaz).
- Imports legacy no resueltos: marcar con comentario `DEBT:bridge-YYYYMMDD` y crear ticket.
- Tests flaky o snapshots que necesiten rebaselining: marcar y re-evaluar dentro de 7 días.

Límites:
- Cada excepción debe tener un ticket y una fecha de retiro (no más de 14 días desde creación). Al final del Sprint 3 no debe quedar ninguna excepción.

---

## Secuencia de commits (12–20 commits atómicos)

Para cada commit se indica mensaje (Conventional Commits) y archivos objetivo (ejemplos representativos). Ajustar rutas exactas según cambios menores.

1. `chore(arch): enforce strict lint and ts boundaries`
	 - Archivos: [eslint.config.mjs](eslint.config.mjs), [tsconfig.json](tsconfig.json), [package.json](package.json), CI config

2. `docs(arch): add architecture decision record and module boundaries`
	 - Archivos: [README.md](README.md), Plan-refactor.md

3. `refactor(features): add public barrels for features`
	 - Archivos: src/features/admin/index.ts, src/features/icons-explorer/index.ts, src/features/user/components/index.ts

4. `refactor(types): unify shared types and contracts`
	 - Archivos: [src/lib/preferences/contract.ts](src/lib/preferences/contract.ts), [src/types](src/types)

5. `refactor(admin): extract domain logic from components`
	 - Archivos: src/features/admin/components/* -> mover lógica a src/features/admin/hooks/*

6. `refactor(admin): implement admin hooks and services`
	 - Archivos: src/features/admin/hooks/* , update components imports

7. `refactor(api): introduce backend gateway boundary`
	 - Archivos: [src/lib/api/backend.ts](src/lib/api/backend.ts), adaptadores en src/lib/api/*

8. `refactor(server): isolate preferences service`
	 - Archivos: src/lib/server/preferences.ts, [src/app/api/preferences/route.ts](src/app/api/preferences/route.ts)

9. `refactor(route): slim preferences endpoint to use service layer`
	 - Archivos: [src/app/api/preferences/route.ts](src/app/api/preferences/route.ts), tests asociados

10. `refactor(hooks): split multi-responsibility hooks into focused units`
		- Archivos: src/hooks/usePremiumAccess.tsx, src/hooks/useSessionDraft.ts

11. `refactor(store): normalize slices and ownership`
		- Archivos: src/store/index.ts, src/store/app/app.store.ts, src/store/ui/ui.store.ts

12. `refactor(store-ui): isolate view state and side-effects`
		- Archivos: src/store/ui/*, src/components/ui/*

13. `refactor(components): make presentational components pure`
		- Archivos: src/components/common/*, src/components/controllers/*

14. `refactor(i18n): centralize locale resolution and access`
		- Archivos: src/i18n/navigation.ts, src/i18n/server.ts, src/app/[locale]/layout.tsx

15. `test(e2e): update specs to match new contracts`
		- Archivos: tests/e2e/* (ajustes de selectors y flujos)

16. `chore(cleanup): remove temporary bridges and dead code`
		- Archivos: adaptadores puente en src/lib, comentarios DEBT

17. `chore(docs): update contribution and architecture guides`
		- Archivos: [README.md](README.md), docs/STRIPE-SETUP.md (si aplica), Plan-refactor.md

> Notas: mantener commits pequeños; cada cambio importante debe ir acompañado de prueba (unit/e2e) o revertible.

---

## Matriz de riesgos y mitigación

- Alto riesgo
	- `src/store`, `src/contexts/AuthContext.tsx`, `src/app/api` — Mitigación: realizar cambios en PRs pequeños, cobertura de e2e para flujos críticos, mantener adaptadores puente por máximo 14 días.

- Riesgo medio
	- `src/hooks`, `src/lib/server`, `src/lib/api` — Mitigación: extraer contratos primero, crear tests unitarios para adaptadores.

- Riesgo bajo
	- `src/components/ui`, `src/messages`, `src/types/icons` — Mitigación: cambios mecánicos y validación por snapshot/e2e.

---

## KPIs / Métricas para certificar 100% clean baseline

1. CI: 0 violaciones críticas de ESLint/TS.
2. Cero imports cross-layer que violen la dirección de dependencia definida.
3. ≥90% de módulos con `index.ts` públicos donde aplica.
4. Reducción del promedio de complejidad ciclomática por función en un 30% en áreas críticas.
5. E2E críticos pasan en CI (tests/e2e).
6. Excepciones temporales abiertas = 0 al final Sprint 3.

---

## Archivos y zonas concretas a tocar (lista priorizada)

- Config / Baseline
	- [eslint.config.mjs](eslint.config.mjs)
	- [tsconfig.json](tsconfig.json)
	- [package.json](package.json)
	- CI config (workflow) — (archivo de CI en repo)

- Barrels / Contracts
	- src/features/admin/index.ts
	- src/features/icons-explorer/index.ts
	- src/features/user/components/index.ts
	- src/lib/preferences/contract.ts
	- src/types/**

- Infra / API
	- src/lib/api/backend.ts
	- src/lib/server/**
	- src/app/api/preferences/route.ts

- Features / Dominio
	- src/features/admin/**
	- src/features/icons-explorer/**
	- src/features/user/**

- Hooks / Utilities
	- src/hooks/usePremiumAccess.tsx
	- src/hooks/useSessionDraft.ts
	- src/hooks/useIconExport.tsx

- Store / Contexts
	- src/store/index.ts
	- src/store/app/app.store.ts
	- src/store/ui/ui.store.ts
	- src/contexts/AuthContext.tsx

- Components / UI
	- src/components/common/**
	- src/components/controllers/**
	- src/components/guards/**

- i18n / routing / messages
	- src/i18n/**
	- src/app/[locale]/**
	- src/messages/**

- Tests
	- tests/e2e/**

---

## Proceso y seguimiento

- Inicial: crear branch `refactor/clean-architecture` y trabajar por commits atómicos.
- Registrar todas las excepciones temporales en un ticket (issue) con tag `debt:bridge` y fecha de expiración.
- Revisiones: PRs pequeños, cada PR con lista de archivos afectados y pruebas asociadas.
- Entrega: al terminar Sprint 3, ejecutar auditoría automática (lint + import rules + e2e) y generar informe.

---

## Próximos pasos inmediatos

1. Crear el branch `refactor/clean-architecture` y confirmar estado limpio de Git antes de empezar.
2. Implementar el primer commit:
   - `chore(arch): enforce strict lint and ts boundaries`
   - Archivos: `eslint.config.mjs`, `tsconfig.json`, `package.json`, `README.md` si aplica.
   - Objetivo: habilitar reglas de importación y límites de capa, dejando el repositorio con un baseline de compilación estable.
3. Agregar barrels iniciales para `src/lib/api`, `src/lib/preferences`, `src/lib/query`, `src/lib/server`, y las carpetas de feature que ya tienen importaciones cruzadas visibles.
4. Validación de línea base:
   - Ejecutar `pnpm run lint` y `pnpm run build`.
   - Confirmar que los errores se limiten a warnings de `import/no-internal-modules` y `import/order` pendientes de reordenar.
5. Crear un plan de trabajo por PRs:
   - PR 1: reglas de arquitectura + baseline.
   - PR 2: barrels y contratos públicos.
   - PR 3: refactor de admin (hooks y componentes).
   - PR 4: refactor de `src/lib/api` y `src/lib/server`.

---

## Criterios de avance para la siguiente iteración

- El primer PR debe dejar una base estable con build verde.
- El segundo PR debe exponer las APIs públicas necesarias a través de `index.ts` sin cambiar lógica de negocio.
- El tercer PR debe extraer un dominio completo, idealmente `src/features/admin`, a hooks y servicios separados.
- Cada PR debe contener un resumen claro de la dirección de dependencia aplicada y los límites de módulo respetados.

---

Si quieres, genero los PRs y aplico los primeros commits de ejemplo para arrancar (p. ej. baseline ESLint/TS y barrels). ¿Comienzo con el commit `chore(arch): enforce strict lint and ts boundaries` y CR en `refactor/clean-architecture`? 

