# Kubernetes-regels

## Van toepassing op
Alle Kubernetes-manifesten (`*.yaml` in `k8s/`, `manifests/`, `helm/`), Helm-grafieken en Kustomize-overlays.

## Regels

1. **Stel `requests` en `limits` in voor elke container** — niet-ingestelde requests veroorzaken onvoorspelbare planning. Niet-ingestelde limits stellen één pod in staat een knooppunt te uithongeren. CPU-limitthrottling is reëel; meet en tune.

2. **Gebruik nooit de `default` namespace voor applicatiewerkbelastingen** — maak doelspecifieke namespaces (`payments`, `workers`, `monitoring`). De `default` namespace is voor verkenning, niet voor productie.

3. **Stel minimaal `replicas: 2` in voor elke implementatie die kritiek is voor beschikbaarheid** — één replica betekent dat een rolling update of evictie downtime veroorzaakt. Gebruik `PodDisruptionBudget` om gelijktijdige evicties te voorkomen.

4. **Definieer `readinessProbe` en `livenessProbe`** — gereedheid beheerst verkeer. Vitaliteit herstart vastgelopen processen. Dit zijn verschillende hulpmiddelen voor verschillende fouten. Gebruik nooit een liveness probe voor initialisatievertragingen — gebruik `startupProbe`.

5. **Pin afbeeldingslabels op onveranderbare SHA-digestz in productie** — `myapp@sha256:abc123` is onveranderbaar. `myapp:v1.2.3` is een veranderbaar label. Gebruik digestpinning via uw CI-pijplijn of hulpmiddelen zoals `kustomize edit set image`.

6. **Gebruik `RollingUpdate` met `maxUnavailable: 0` voor updates zonder downtime** — standaard `maxUnavailable: 1` verliest verkeer tijdens updates. Stel `maxSurge: 1` in om een nieuwe pod toe te staan voordat de oude eindigt.

7. **Sla geheimen op in een geheimenmanager, niet als base64 in manifesten** — Kubernetes `Secret` objecten zijn standaard base64, niet versleuteld in etcd. Gebruik External Secrets Operator, Vault of AWS Secrets Manager.

8. **Pas `NetworkPolicy` toe om pod-naar-pod verkeer te beperken** — standaard kunnen alle pods alle pods bereiken. Namespacebrede deny-all + expliciete toestaan-regels beperken de blastradius bij inbreuk.

9. **Gebruik `topologySpreadConstraints` of `podAntiAffinity` voor multi-AZ-veerkracht** — het plannen van replica's op dezelfde knooppunt of AZ vervalscht het doel van meerdere replica's.

10. **Label resources consistent** — minimum: `app.kubernetes.io/name`, `app.kubernetes.io/version`, `app.kubernetes.io/component`. Labels worden gebruikt door selectors, monitoring en kostentoewijzing.

11. **Stel `terminationGracePeriodSeconds` in op uw afsluittijd van de app** — de standaard 30 seconden is te kort voor sommige werkbelastingen en te lang voor andere. Stel deze in op afsluittijd + buffer.

12. **Gebruik `HorizontalPodAutoscaler` (HPA) voor staatloze werkbelastingen, niet handmatig schalen** — HPA op CPU en aangepaste metriek maakt automatisch uitschalen mogelijk. Handmatig replicabeheer overleeft belastingpieken niet.

13. **Draai containers nooit als root** — stel `securityContext.runAsNonRoot: true` en `runAsUser` in op pod- of containerniveau. Stel ook `allowPrivilegeEscalation: false` en `readOnlyRootFilesystem: true` in waar mogelijk.

14. **Valideer manifesten in CI voordat u ze toepast** — gebruik `kubeval`, `kube-score` of `kubectl --dry-run=server`. Vang schemafouten en beleidsschendingen op voordat ze de cluster bereiken.

15. **Gebruik namespaced RBAC-rollen, niet ClusterRole, tenzij clusterwijde toegang vereist is** — principe van minimale privileges. Een serviceaccount voor één namespace mag nooit clusterwijde lees-/schrijftoegang hebben.


---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
