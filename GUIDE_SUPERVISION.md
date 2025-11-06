# 📊 Guide Supervision eLibrary - Prometheus + Grafana

## 🚀 Démarrage rapide

### 1. Lancer la supervision
```bash
.\supervision-complete.bat
```

### 2. Vérifier les services
```bash
kubectl get pods -n elibrary
```

## 📈 Prometheus - Métriques système

### Accès : http://localhost:9090

### Métriques essentielles à surveiller :

**Status des services :**
```
up
```
- Valeur 1 = Service UP
- Valeur 0 = Service DOWN

**Pods Kubernetes :**
```
kube_pod_status_phase{namespace="elibrary"}
```

**Utilisation mémoire :**
```
container_memory_usage_bytes{namespace="elibrary"}
```

**Requêtes HTTP :**
```
prometheus_http_requests_total
```

### Requêtes utiles :
- `up{job="kubernetes-pods"}` - Status tous les pods
- `rate(prometheus_http_requests_total[5m])` - Taux de requêtes
- `prometheus_notifications_total` - Notifications système

## 📊 Grafana - Dashboards visuels

### Accès : http://localhost:3000
**Login :** admin / admin123

### Création dashboard eLibrary :

1. **Nouveau dashboard :**
   - Clic "+" → "Dashboard"
   - "Add visualization"

2. **Panel Services Status :**
   - Datasource : Prometheus
   - Query : `up`
   - Type : Stat
   - Titre : "Services eLibrary"

3. **Panel Pods Status :**
   - Query : `kube_pod_status_phase{namespace="elibrary"}`
   - Type : Table
   - Titre : "Pods Status"

4. **Panel Memory Usage :**
   - Query : `container_memory_usage_bytes{namespace="elibrary"}`
   - Type : Time series
   - Titre : "Memory Usage"

## 🔍 Surveillance en temps réel

### Alertes importantes :
- ❌ Service DOWN (up = 0)
- ⚠️ Pod en erreur (phase != "Running")
- 🔥 Mémoire élevée (> 80%)
- 📡 Perte connectivité Prometheus

### Commandes de diagnostic :
```bash
# Status complet
kubectl get all -n elibrary

# Logs Prometheus
kubectl logs -l app=prometheus -n elibrary

# Logs Grafana
kubectl logs -l app=grafana -n elibrary

# Métriques directes
curl http://localhost:9090/api/v1/query?query=up
```

## 📋 Checklist supervision

### ✅ Vérifications quotidiennes :
- [ ] Tous services UP dans Prometheus
- [ ] Dashboard Grafana accessible
- [ ] Pods en état "Running"
- [ ] Métriques à jour (< 5 min)

### ✅ Surveillance continue :
- [ ] Alertes configurées
- [ ] Dashboards sauvegardés
- [ ] Historique métriques conservé
- [ ] Accès sécurisé (changement mot de passe)

## 🛠️ Dépannage

### Prometheus inaccessible :
```bash
kubectl port-forward svc/prometheus-service 9090:9090 -n elibrary
```

### Grafana sans données :
1. Vérifier datasource Prometheus
2. URL : http://prometheus-service:9090
3. Test connexion

### Métriques manquantes :
```bash
kubectl get servicemonitor -n elibrary
kubectl describe prometheus -n elibrary
```

## 🎯 Objectifs supervision

**Disponibilité :** 99%+ services UP
**Performance :** Temps réponse < 2s
**Ressources :** CPU < 80%, RAM < 80%
**Alerting :** Notification < 1 min

---

**Supervision eLibrary opérationnelle ! 🚀**