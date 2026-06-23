# Mixture of Experts (MoE) Architecturen in Claudient

Dit document beschrijrat de architecturen voor het routeren van verzoeken over meerdere modellen om codegeneratie, redenering en kosten te optimaliseren.

---

## 1. Architectuur 1: Routering op basis van complexiteit (Tiered Dispatch)

### Hoe het werkt
Het systeem schaalt de redeneercapaciteit dynamisch op basis van invoerstatistieken (bijv. regeltoevoegingen, beïnvloede bestanden, beveiligingsvlaggen).

---

## 2. Architectuur 2: Routering via domeinexperts (Op rollen gebaseerde dispatch)

### Hoe het werkt
Vragen worden geanalyseerd op trefwoorden, talen en technische mappen om ze naar zeer gespecialiseerde sjablonen/systeeminstructies te routeren.

---

## 3. Architectuur 3: Consensuszwerm met meerdere agenten (Debatroutering)

### Hoe het werkt
Voor beslissingen met grote belangen coördineert een supervisor-agent een debat tussen twee vijandige expert-agenten, en synthetiseert de resultaten vóór de uitvoering.
