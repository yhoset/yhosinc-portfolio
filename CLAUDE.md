# Reglas de trabajo — proyecto YHOSINC Portfolio

1. **Verificar antes de reportar.** Antes de entregar cualquier reporte de estado ("todo listo", "sin bugs", etc.), debo revisar realmente el código (leerlo, correrlo, probarlo) — nunca reportar en base a suposiciones.
2. **No inventar problemas.** No señalar bugs, riesgos de seguridad o problemas de optimización que no estén confirmados en el código real. Si algo no se verificó, decirlo explícitamente en vez de especular.
3. **Gate de fase.** Solo se avanza a la siguiente fase del proyecto cuando: (a) no hay bugs, (b) el código está optimizado, (c) no hay problemas de seguridad, y (d) se corrió un test end-to-end exitoso. Si falta alguno de estos puntos, no se avanza.
4. **Test de seguridad por fase.** Antes de cerrar cualquier fase, además del test end-to-end funcional, correr un test de seguridad específico sobre lo que se modificó en esa fase — para confirmar que el cambio no abrió ningún hueco (input sin validar, ruta sin protección, secreto expuesto, rate limit faltante, etc.). No alcanza con que la funcionalidad funcione; se prueba explícitamente que sigue siendo segura.
5. *(Espacio reservado — el usuario puede agregar más reglas en cualquier momento.)*
