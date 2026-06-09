# Kubernetes-Regeln

## Anwenden auf
Alle Kubernetes-Manifeste (`*.yaml` in `k8s/`, `manifests/`, `helm/`), Helm-Charts und Kustomize-Overlays.

## Regeln

1. **Setzen Sie `requests` und `limits` auf jedem Container** — fehlende Requests führen zu unvorhersehbarer Planung. Fehlende Limits ermöglichen es einem einzelnen Pod, einen Node zu überlasten. CPU-Limit-Drosselung ist real; messen und optimieren Sie.

2. **Verwenden Sie niemals den `default`-Namespace für Anwendungs-Workloads** — erstellen Sie Namespaces für spezifische Zwecke (`payments`, `workers`, `monitoring`). Der `default`-Namespace ist nur für Exploration, nicht für Produktion.

3. **Setzen Sie `replicas: 2` Minimum für jeden verfügbarkeitskritischen Deployment** — eine einzelne Replik bedeutet, dass ein Rolling Update oder eine Eviction zu Ausfallzeiten führt. Verwenden Sie `PodDisruptionBudget`, um gleichzeitige Evictions zu verhindern.

4. **Definieren Sie `readinessProbe` und `livenessProbe`** — Readiness blockiert Traffic. Liveness startet verblockerte Prozesse neu. Sie sind unterschiedliche Werkzeuge für unterschiedliche Fehler. Verwenden Sie niemals eine Liveness-Probe für Initialisierungsverzögerungen — verwenden Sie `startupProbe`.

5. **Heften Sie Image-Tags an unveränderliche SHA-Digests in Produktion fest** — `myapp@sha256:abc123` ist unveränderlich. `myapp:v1.2.3` ist ein änderbares Tag. Verwenden Sie Digest-Pinning über Ihre CI-Pipeline oder Tools wie `kustomize edit set image`.

6. **Verwenden Sie `RollingUpdate` mit `maxUnavailable: 0` für ausfallzeitfreie Deployments** — das Standard `maxUnavailable: 1` reduziert Traffic während Updates. Setzen Sie `maxSurge: 1`, um einen neuen Pod zu erlauben, bevor der alte beendet wird.

7. **Speichern Sie Secrets in einem Secrets Manager, nicht als Base64 in Manifesten** — Kubernetes `Secret`-Objekte sind standardmäßig Base64, nicht verschlüsselt, in etcd. Verwenden Sie External Secrets Operator, Vault oder AWS Secrets Manager.

8. **Wenden Sie `NetworkPolicy` an, um Pod-zu-Pod-Traffic einzuschränken** — standardmäßig können alle Pods alle Pods erreichen. Namespace-weites Deny-All + explizite Allow-Regeln begrenzen die Explosion bei einer Kompromittierung.

9. **Verwenden Sie `topologySpreadConstraints` oder `podAntiAffinity` für Multi-AZ-Resilienz** — das Planen von Replicas auf demselben Node oder in derselben AZ negiert den Sinn mehrerer Replicas.

10. **Kennzeichnen Sie Ressourcen konsistent** — Minimum: `app.kubernetes.io/name`, `app.kubernetes.io/version`, `app.kubernetes.io/component`. Labels werden von Selektoren, Überwachung und Kostenverteilung verwendet.

11. **Setzen Sie `terminationGracePeriodSeconds` auf Ihre Shutdown-Zeit der App** — die Standard-30-Sekunden sind für einige Workloads zu kurz und für andere zu lang. Setzen Sie diese auf Shutdown-Zeit + Buffer.

12. **Verwenden Sie `HorizontalPodAutoscaler` (HPA) für zustandslose Workloads, nicht manuelle Skalierung** — HPA auf CPU und benutzerdefinierten Metriken ermöglicht automatische Skalierung. Manuelle Replica-Verwaltung übersteht keine Last-Spitzen.

13. **Führen Sie Container niemals als root aus** — setzen Sie `securityContext.runAsNonRoot: true` und `runAsUser` auf Pod- oder Container-Ebene. Setzen Sie auch `allowPrivilegeEscalation: false` und `readOnlyRootFilesystem: true`, wo möglich.

14. **Validieren Sie Manifeste in CI vor der Anwendung** — verwenden Sie `kubeval`, `kube-score` oder `kubectl --dry-run=server`. Fangen Sie Schema-Fehler und Policy-Verstöße ab, bevor sie den Cluster erreichen.

15. **Verwenden Sie Namespaced RBAC Rollen, nicht ClusterRole, es sei denn, Cluster-weiter Zugriff ist erforderlich** — Prinzip der geringsten Berechtigung. Ein Service Account für einen einzelnen Namespace sollte niemals Cluster-weiten Lese-/Schreibzugriff haben.


---

> **Arbeiten Sie mit uns zusammen:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln AI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
