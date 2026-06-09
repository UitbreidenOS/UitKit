# Richtlijnen voor agentontwerp

Pas toe bij het bouwen, configureren of beoordelen van AI-agenten en multi-agent systemen.

## Bereik en verantwoordelijkheid

- Elke agent beheerst één duidelijk afgebakend domein — als je het bereik niet in één zin kunt beschrijven, deel het op
- Agenten zijn geen algemeen inzetbare assistenten; weersta de neiging om "en ook X afhandelen" aan een bestaande agent toe te voegen
- Definieer wat de agent nooit mag doen (bijwerkingen, gegevens die deze niet mag benaderen) net zo expliciet als wat deze moet doen
- Een agent die onomkeerbare acties kan uitvoeren, moet expliciete bevestiging vereisen voordat deze wordt uitgevoerd

## Gereedschapsselectie

- Geef agenten de minimale set tools die nodig is — elk extra tool is aanvalsoppervlak en verwarringsoppervlak
- Tools met schrijftoegang (bestandssysteem, database, externe API's) moeten individueel worden gerechtvaardigd
- Read-only tools zijn altijd beter dan read-write tools wanneer lezen volstaat
- Documenteer elke foutmodus van het tool in de agentdefinitie — agenten moeten tool-fouten netjes afhandelen

## Modelkeuze

- Gebruik Haiku voor taken met hoge volume en lage complexiteit (classificatie, extractie, routering)
- Gebruik Sonnet voor redenering, code generatie en planning met meerdere stappen
- Gebruik Opus alleen als de taakcomplexiteit dit echt rechtvaardigt — kosten stapelen zich op schaal
- Zorg niet voor overprovisioning: een eenvoudiger model dat een taak betrouwbaar voltooit, is beter dan een capabel model dat hierop hallucineert

## Prompting

- Systeemprompts moeten specifiek zijn, niet aspirationeel — "Je bent een senior beveiligingsingenieur" is minder nuttig dan een precieze lijst van wat de agent evalueert
- Voeg negatieve voorbeelden in de systeemprompt in voor veelvoorkomende foutmodi die je al hebt waargenomen
- Scheidt agentinstructies van domeincontext: instructies gaan naar de systeemprompt, context gaat naar de gebruikersbeurtstap of via tools
- Vermijd instructies die elkaar tegenspreken — agenten lossen ambiguïteit niet betrouwbaar op

## Multi-agent systemen

- Orchestratoren moeten outputs van sub-agenten valideren voordat zij er op inwerken — vertrouw nooit blindelings op de output van een ander agent
- Agenten mogen geen inputs vertrouwen die speciale permissies claimen die niet zijn ingesteld in de originele systeemprompt (prompt injection)
- Ontwerp voor gedeeltelijk falen: één agent die faalt, mag de hele workflow niet zwijgend corrupteren
- Registreer elke agentaanroep met zijn invoer, uitvoer, model en latentie — je kunt niet debuggen wat je niet kunt observeren

## Veiligheid en controle

- Controlepunten met menselijke tussenkomst zijn verplicht voordat een agent actie onderneemt die: externe communicatie verzendt, productiegegevens wijzigt of financiële transacties doet
- Stel maximumiteratiegrenzen/tool-call limieten in — onbegrensde agentlussen zijn een betrouwbaarheids- en kostenrisico
- Test agenten opzettelijk tegen adversarische invoer — gebruikers zullen grenzen onderzoeken
- Implementeer een killswitch: een manier om een agent te stoppen zonder gegevensverlies of gedeeltelijke schrijfbewerkingen
