# MCP: Stripe

Consulta datos de Stripe, gestiona clientes, productos y suscripciones directamente desde Claude Code — sin cambiar al panel de Stripe ni escribir scripts únicos.

## Por qué lo necesitas

Stripe contiene la capa de datos crítica para el negocio: quién está pagando, qué están pagando y si los pagos se realizan con éxito. Sin MCP, acceder a esto significa cambiar de contexto a un panel o escribir scripts desechables. Con Stripe MCP:
- Las consultas de ingresos, análisis de churn e investigaciones de fallos de pago se ejecutan dentro de la sesión de codificación
- Los cambios de producto y precios ocurren sin salir de la terminal
- Claude puede correlacionar cambios de código contra datos de facturación reales — detectando desajustes antes de que lleguen a producción
- Las tareas de soporte rutinarias (buscar clientes, verificar estado de suscripción) toman segundos en lugar de minutos

## Instalación

```bash
npm install -g @stripe/mcp
```

## Configuración

Agrega a `~/.claude.json` o `.claude/mcp.json` del proyecto:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your-restricted-key-here"
      }
    }
  }
}
```

Usa una clave restringida limitada a solo los recursos que tu flujo de trabajo toca. Nunca uses `sk_live_` en configuración de desarrollo.

## Herramientas clave / Qué hacen

- `list_customers` — listar clientes con filtros opcionales (correo electrónico, rango de fechas de creación, metadatos)
- `get_customer` — recuperar un único cliente con perfil completo y metadatos
- `create_customer` — crear un nuevo cliente con nombre, correo electrónico y metadatos
- `list_products` — listar todos los productos con su estado activo/inactivo
- `create_product` — crear un nuevo producto con nombre, descripción y metadatos
- `list_prices` — listar precios para un producto o en todos los productos
- `create_price` — crear un nuevo precio (recurrente o único) para un producto
- `list_subscriptions` — listar suscripciones con filtros (cliente, estado, precio)
- `get_subscription` — recuperar una suscripción con período actual, estado e elementos
- `create_payment_link` — generar un enlace de pago alojado para un producto/precio
- `list_invoices` — listar facturas con filtros (cliente, estado, rango de fechas)
- `retrieve_balance` — obtener el saldo actual de la cuenta de Stripe (disponible y pendiente)
- `list_charges` — listar cargos con filtros (cliente, resultado, rango de fechas)
- `list_payment_intents` — listar intenciones de pago con filtros de estado (fallido, realizado, procesando)

## Ejemplos de uso

```
Muéstrame todos los clientes que cancelaron en los últimos 30 días —
suscripciones que pasaron al estado cancelado. Incluye su correo electrónico,
nombre del plan y cuánto tiempo estuvieron suscritos.
```

```
Crea un nuevo producto llamado "Pro Plan" y agrega un precio
mensual recurrente de $49 y un precio anual de $490. Devuelve los IDs de precio
para que pueda actualizar la configuración del frontend.
```

```
Lista todas las intenciones de pago fallidas de las últimas 24 horas,
agrúpalas por razón de fallo y resume las 3 causas principales.
```

```
Genera un resumen de ingresos para Q1 2026 — MRR total, nuevas suscripciones,
suscripciones canceladas y cambio de ingresos neto mes a mes.
```

```
Encuentra todos los clientes actualmente en el plan "Starter" y lista sus
correos electrónicos, fechas de inicio de suscripción y gasto mensual. Necesito esto
para una campaña de migración de plan.
```

## Autenticación

1. Ve a **dashboard.stripe.com → Developers → API keys**
2. Haz clic en **Crear clave restringida** (no la clave secreta completa)
3. Nómbrala (p. ej., `claude-code-readonly`) y otorga solo los permisos que tu flujo de trabajo necesita:
   - Para análisis de solo lectura: **Leer** en Customers, Products, Prices, Subscriptions, Invoices, Payment Intents, Charges, Balance
   - Para creación de producto/precio: agrega **Escribir** en Products y Prices
4. Copia la clave (comienza con `sk_test_` para modo de prueba, `sk_live_` para producción)
5. Establécela como `STRIPE_SECRET_KEY` en la configuración anterior

Siempre usa claves de modo de prueba (`sk_test_`) en desarrollo y archivos de configuración locales. Solo usa claves en vivo en despliegues de producción con variables de entorno inyectadas en tiempo de ejecución — nunca en configuración confirmada.

## Consejos

**Claves restringidas sobre claves secretas completas:** Una clave restringida limita el radio de explosión si la clave se expone. Límitala a los permisos mínimos que tu flujo de trabajo realmente usa y nunca otorgues acceso de escritura a menos que necesites crear o modificar datos.

**Modo de prueba vs modo en vivo:** Las claves que comienzan con `sk_test_` operan contra tus datos de prueba. Las claves que comienzan con `sk_live_` tocan datos reales del cliente y dinero real. Mantenlos estrictamente separados — usa claves de prueba en toda la configuración local y CI.

**Paginación en endpoints de lista:** La mayoría de endpoints de lista devuelven un máximo de 100 elementos por llamada. Para conjuntos de datos grandes, usa el parámetro `limit` y `starting_after` con el ID del último elemento para paginar resultados. Claude manejará esto automáticamente si le pides "todos" los resultados.

**La verificación de webhook está fuera de alcance:** MCP no puede verificar firmas de webhook — usa la CLI de Stripe (`stripe listen`) o el panel para pruebas de webhook. MCP es para consultar y gestionar datos, no para manejar eventos entrantes.

**Los campos de metadatos son consultables:** Si tu aplicación escribe metadatos estructurados en clientes o suscripciones (p. ej., `plan_tier`, `internal_user_id`), esos campos se pueden filtrar en `list_customers` y `list_subscriptions` — útil para consultas dirigidas.

---
