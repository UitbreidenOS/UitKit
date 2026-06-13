# Modal

## Wanneer activeren
- Gebruiker deployen ML/AI workloads naar Modal (modal.com)
- Code imports `modal` of reference `@app.function`, `@app.cls`, `Stub`, `App`
- Gebruiker nodig serverless GPU compute inferentie, fine-tuning, of batch ML jobs
- Gebruiker vraag over cold starts, GPU selectie, model weight caching, of streaming inferentie Modal
- Gebruiker bouwing web endpoint of scheduled job backed GPU compute

## Wanneer NIET gebruiken
- Gebruiker deploy ander serverless GPU platform (RunPod, Lambda Labs, Replicate, Banana)
- Taak CPU-only geen ML workload — gebruik standaard serverless (Lambda, Cloud Run)
- Gebruiker al heb managed inferentie endpoint (OpenAI, Anthropic, Together) en enkel nodig API aanroep
- Vraag over ML model architectuur, niet infrastructuur

Zie Modal documentatie voor complete guides op GPU, inference, en training patterns.

---
