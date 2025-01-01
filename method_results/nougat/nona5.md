Hochschule fur Angewandte Wissenschaften Hamburg

## _Hamburg University of Applied Sciences_

## **Bachlerarbeit**

## **Sven Boris Bornemann**

## **Android-basierte Smart Home Interaktion am**

## **Belspiel einer Gegensprechtange**

## _Fakultat Technik und Informatik_

## _Department Informatik_

## _Faculty of Engineering and Computer Science_

_Department of Computer Science_ Sven Boris Bornemann

Android-basierte Smart Home Interaktion am Beispiel einer Gegensprechanlage

Bachelorarbeit eingereicht im Rahmen der Bachelorprufung

im Studiengang Technische Informatik

am Department Informatik

der Fakultat Technik und Informatik

der Hochschule fur Angewandte Wissenschaften Hamburg

Betreuender Prufer : Prof. Dr. rer. nat. Kai von Luck

Zweitgutachter : Prof. Dr. rer. nat. Gunter Klemke

Abgegeben am 29. Juli 2011

## Sven Boris Bornemann

### Thema der Bachelorarbeit

Android-basierte Smart Home Interaktion am Beispiel einer Gegensprechanlage

### Stichworte

Android(tm), Smartphone, Turklingel, Smart Home, Ubiquitous Computing, Seamless Interaction

### Kurzzusammenfassung

Die steigende Allgegenwartigkeit von Computern spielt eine tragende Rolle bei der Entwicklung neuer Systeme. Im Rahmen dieser Bachelorarbeit werden Interaktionsmoglichkeiten hinsichtlich eines intelligenten Turklingelsystems in einer Smart Home Umgebung untersucht. Nach der Identifikation verschiedenster Interaktionen durch die Schilderung von Beispielszenarien, werden diverse Architekturnuster auf ihre mogliche Verwendung hin geprut. AnschlieBend wird die Realisierbarkeit des Systems anhand von Grundfunktionalitaten einer Gegensprechanlage nachgewiesen.

### Sven Boris Bornemann

#### Title of the paper

Android-based smart home interaction on the example of an intercom system

#### Keywords

Android(tm), Smartphone, Doorbell, Smart Home, Ubiquitous Computing, Seamless Interaction

### Abstract

The increasing ubiquity of computers plays a crucial role in the development of new systems. As part of this bachelor thesis, interactions are examined for an intelligent doorbell system in a smart home environment. After the identification of various interactions as described by example scenarios, various architectural patterns and their possible use are evaluated. Then, the feasibility of the system using basic functionality of an intercom system is proven.

## Index

Inhaltsverzeichnis

1 Einleitung

1.1 Zielsetzung

1.2 Gliederung der Arbeit

2 Grundlagen

2.1 Ubiquitous Computing

2.1.1 Pervasive Computing

2.1.2 Ambient Intelligence

2.2 Verteilte Systeme

2.3 Smart Home

2.4 Kontext

2.5 AndroidTM

3 Analyse

3.1 Szenarien

3.1.1 Besucher klingelt

3.1.2 Benutzerauthentifizierung

3.1.3 Mobile Turklingel

3.2 Anforderungsanalyse

3.2.1 Funktionale Anforderungen

3.2.2 Nicht-Funktionale Anforderungen

3.3 Kontextabhangigkeit

3.3.1 Identifizierte Kontexte

3.3.2 Informationsgewinnung

3.3.3 Entscheidungsfinding

3.4 Interaktionen

3.5 Machbarkeitsstudie

3.5.1 Anforderungen

3.5.2 Beispielprojekte

3.6 Fazit

4 Design

4.1 Architektur

#### 4.1.1 Systemuberblick

4.1.2 Abgrenzungen

4.1.3 Komponentenarchitektur

4.1.4 Model-View-Controller

4.2 Kommunikation

4.2.1 Synchrone Kommunikation

4.2.2 Asynchrone Kommunikation

4.3 Dienste

4.4 Fazit

5 Realisierung

5.1 Technische Umsetzung

5.1.1 Turkingel

5.1.2 Gegenstellen

5.1.3 Kommunikation

5.2 Evaluation

5.2.1 Erfullung der Anforderungen

5.2.2 Funktionsweise des Prototypen

5.2.3 Erkenntnisse aus der Evaluation

6 Schluss

6.1 Zusammenfassung

6.2 Ausblick

Literaturverzeichnis

## 1 Einleitung

Die Prasenz von Computern ist in der heutigen Zeit ubiquitar. Sie befinden sich in Chipkarten, Autos, Smartphones, Haushaltsgeraten und noch in vielen weiteren Gegenstanden. Ziel fur die Zukunft ist, die verschwindende Allgegenwartigkeit der Computer. Mit diesem Aspekt beschaftigt sich das Smart Environment, welches dafur zwei Hauptziele verfolgt. Ein Aspekt ist hier die Verdrangung der Gerate in den Hintergrund, sodass der Anwender diese gar nicht mehr als solche wahrnehmen kann. Der zweite Gesichtspunkt beschaftig sich mit der Unterstutzung des Menschen im alltaglichen Leben. Hierdurch sollen Sicherheit sowie der Komfort erhoht werden.

Im Laufe der Zeit haben sich viele verschiedene Auspragungen dieser Idee entwickelt. Ein Beispiel hierfur, ist das Ambient Assisted Living (BMBF). Der Fokus in dieser Auspragung liegt bei der Unterstutzung alterer Menschen. Durch den Einsatz technischer Hilfsmittel soll die Lebensqualitat und die Unabhangigkeit alterer Menschen gesteigert werden.

Diese Systeme sind aber nicht nur in den Wohnungsumgebungen des Menschen zu finden, sondern auch in anderen Bereichen. So zum Beispiel auch in der Automobilindustrie. Hier werden immer mehr Assistenzsysteme konzipiert, die den Komfort und die Sicherheit des Autofahrers erhohen sollen. Beispiele hierfur sind die Fufgangererkennung von Volvo1 oder das farbige Head-Up Display von BMW2.

All diese Auspragungen haben ihren Ursprung in dem Begriff Ubiquitous Computing, der von Mark Weiser (Weiser (1991)) gepragt wurde. In dieser Vision wird die Allgegenwartigkeit kleinster unsichtbarer Computer beschrieben. Im europaischen Raum wird dieses Forschungsgebiet auch unter dem Namen Ambient Intelligence zusammengefasst. Dabei sollen die Systeme aktiv auf die Bedurfnisse des Anwenders eingehen und ihm Aufgaben abnehmen. Hierzu werden alltagliche Gegenstande in sogenannte "schlause" Gegenstande verwandelt. Aus einer Turklingel wird also eine Smart Doorbell, in dem diese mittels moderner Technologie erweitert wird. Dazu zahlt unter anderem die Vernetzung mit anderen Gegenstanden, um die Funktionalitaten zu erhohen.

Footnote 1: Quelle: http://www.volvocars.com/at/explore/pages/pedestrian-detection.aspx (abgerufen am 20.07.2011)

Footnote 2: Quelle: http://www.bmw.de/de/de/newvehicles/6series/coupe/2011/showroom/connectivity/coloured_hud.html (abgerufen am 20.07.2011)

Durch die standig fortschreitende Miniaturisierung sind wir im Alltag schon jetzt von unzahligen Computern umgeben. Von denen wir manche noch als solche wahrnehmen und anderewiederum nicht. Um die Visionen wahr werden zu lassen fehlt aber noch ein entscheidender Faktor: die Kommunikationsfahigkeit. Das bedeutet, die Gerate mussen untereinander kommunizieren, um die gewollten Funktionalitaten abbilden zu konnen.

Aber nicht nur die Eigenschaften der Gerate sind entscheidend, sondern auch wie in Zukunft mit diesen interagiert wird. Damit diese in den Hintergrund treten konnen, mussen neue intuitive Bedienkonzepte und Interaktionsmoglichkeiten entstehen. Außerdem mussen die Systeme Informationen uber ihre Umgebung sammeln. Anhand derer sie entscheiden, welche Funktionen dem Anwender angeboten oder welche Arbeitschritte dem Anwender abgenommen werden konnen.

### 1.1 Zielsetzung

Ziel dieser Arbeit ist es, eine,,smarte" Turklingel zu entwickeln, die sich auch durch eine einfache Integration in eine Smart Home Umgebung auszeichnet. Dazu werden mogliche Interaktionen der Anwender, also Bewohner und Besucher, identifiziert. Hierbei spielt die Kommunikation zwischen den Anwendern eine Ubergeordnete Rolle. Diese soll im Vergleich zu konventionellen Systemen nicht nur einfacher gestaltet sein, sondern auch einen hoheren Synthesegrad erreichen. Ziel ist es also, den Anwendern das Gefuhl zu vermitteln, dass sie sich bei ihrem Gesprach direkt gegenuber stehen. Dies soll erreicht werden, indem alle moglichen Gerate, innerhalb einer Wohnung als Kommunikationseinheit Verwendung finden. Anhand zusatzlicher Kontextinformationen wird es dem System ermoglicht, sich auf die Bedurfnisse und Situation des Bewohners anzupassen. Diese Informationen werden allerdings nicht von der Turklingel erfasst, sondern von der Umgebung in der sich diese befindet bereitgestellt.

Um die Umsetzbarkeit zu demonstreiren, soll eine prototypische Anwendung entwickelt werden. Dazu werden grundlegende Funktionen, wie die Ubertragung eines Live-Videos realisiert. In Folge dessen werden audiovisuelle Daten von einer Gegenstelle, innerhalb der Wohnung, zur Turklingel und umgekehrt ubermittel. Des Weiteren soll das Hinterlassen von Videobotschaften realisiert werden.

In der anfanglichen Entstehungsphase der Arbeit wurden einige Aspekte und Themengebiete dieser Arbeit zusammen mit Sebastian Rosch (Rosch (2011)) erarbeitet. Beide Arbeiten werden im Kontext des Living Place Hamburg erstellt und beschaftigen sich mit der Ubergragung audiovisueller Daten. Rosch untersucht in seiner Arbeit eine mogliche audiovisuelle Kommuniktation in einer Smart Home Umgebung.

## Chapter 1 1.2 Gliederung der Arbeit

Die Arbeit gliedert sich in sechs Bestandteile, wobei der erste Teil die Einleitung darstellt. Hier wird ein kurzer Uberblick in das Themengebiet gegeben und die Zielsetzung der Arbeit definiert.

Den zweiten Abschnitt der Arbeit bilden die Grundlagen. Hier werden Bergriffe und Konzepte erlautert, die fur das weitere Verstandnis der Arbeit von Bedeutung sind.

Die Analyse des zuvor definierten Ziels ist Bestandteil des dritten Kapitels. Dazu werden Szenarien erlautert, die verschiedenste Interaktionsmoglichkeiten in Smart Home Umgebungen beinhalten. Aus diesen werden funktionale und nicht-funktionale Anforderungen identifiziert und beschrieben. Anschließend wird die Kontextabhangigkeit des Systems untersucht. Zum Schluss dieses Kapitels, wird anhand von Beispielprojekten die Durchfuhrbarkeit dieser Arbeit verifiziert.

Aufgrund der Ergebnisse aus Teil drei, werden im vierten Kapitel verschiede Designmoglichkeiten vorgestellt und miteinander verglichen. Anhand der identifizierten Anforderungen wird eine Designentscheidung getroffen und anhand von UML-Diagrammen erlautert.

Im funften Abschnitt der Arbeit wird die Realisierung der Designentscheidung anhand von grundlegenden Funktionalitaten durchgefuhrt. Dazu werden Funktionen identifiziert, die das mobile Betriebssystem Android(tm) zur Verfugung stellt und solche, die noch implementiert werden mussen. Anschließend wird die Realisierung evaluiert. Hierfur wird untersucht, welche Anforderungen in der Realisierung umgesetzt werden konnten. Des Weiteren wird die Funktionsweise des entwickelten Prototypes vorgestellt.

Der sechste und letzte Teil der Arbeit beinhalten die Reflexion, im Hinblick auf die zum Anfang der Arbeit definierten Zielsetzung. Des Weiteren wird ein Ausblick gegeben, bezuglich der in der Zukunft moglichen Erweiterungen.

## Chapter 2 Grundlagen

### 2.1 Ubiquitous Computing

Der Begriff Ubiquitous Computing beschreibt die Allgegenwertigkeit von rechnergestutzten Informationssystemen. Gepragt wurde dieser Begriff von Mark Weiser in seinem Artikel,,The Computer for the 21st Century" (Weiser (1991)). In dieser Vision werden die heute ublichen Personal Computer durch,,intelligente Gegenstande" ersetzt, die den Menschen unterstutzen ohne ihn abzulenken. Es geht darum, die Interaktion zwischen Mensch und Maschine so zu gestallten, dass sich die Maschine auf den Menschen einstellt und nicht, wie heute ublichen, der Mensch auf die Maschine.

John Krumm beschrieb drei elementare Zeitabschnitte der Rechenleistung in seinem Buch Ubiquitous Computing Fundamentals (Krumm (2009)). Das Zeitalter des Mainframe Computings, der Ara des Personal Computings und die des Ubiquitous Computing. Durch die standige Weiterentwicklung der Mikroelektronik, wird Rechenleistung immer erschwinglicher und ist auf einem geringeren Platz realisierbar. Mittlerweile sind wir von Computern umgeben, die wir nicht mehr als solche wahrnehmen. Sie stecken in Kredikarten, Autos, Kuchengearten und einer Vielzahl anderer Gerate. Daraus wird ersichtlich, dass wir uns schon in den Anfangen des Ubiquitous Computing Zeitalters befinden.

Aber wie wunschenswert ist eine Welt, in der nicht nur jeder mit jedem, sonder alles mit allem vernetzt ist? Mark Weiser sagte einmal:

## _As technology becomes more embedded and invisible, calms our lives by removing the annoyances while keeping us connected with what is truly important._

## _Mark Weiser (Weiser, 1991)_

Es besteht kein Zweifell das sich die Welt auf das Ubiquitous Computing zubewegt. Wie schnell das Ziel allerdings erreicht wird, hangt von der Zuverlassigkeit der Technik und dem daraus resultierenden Vertrauen ab. So schon und komfortabel diese Vision auch klingen mag, wirft sie doch einige gesellschaftliche, ethische und rechtliche Fragen auf.

Angesichts der grossen Menge an Mikrosensoren, die ihre Daten beliebig uber das Internet verteilen, stellt die Realisierung des Datenschutzes und das Sichern der Privatsphare eine eminente Herausforderung dar. Auch sollte man sich vergegenwartigen, zu welchen Folgen und Abhangigkeiten es fuhren kann, wenn der Technik immer mehr Kontrollfunktionen des taglichen Lebens Ubertragen werden.

Ubiquitous Computing wird durch eine Reihe von (technischen) Merkmalen identifiziert. Die folgenden Merkmale wurden von dem Buro fur Technologiefolgen-Abschatzungen beim Deutschen Bundestag (TAB (2009)) in einem Zukunftsreport zusammengefasst:

* Dezentralitat bzw. Modularitat
* Einbettung
* Mobilitat
* (Spontane) Vernetzung
* Kontextsensitivitat
* Autonomie
* Energieautarkie

Im Laufe der Zeit wurden auf der Basis von Mark Weisers Theoremen weitere Auspragungen entwickelt. Dazu zahlen das Pervasive Computing und Ambient Intelligence. Diese beiden Auspragungen werden im Folgenden kurz erlautert.

#### Pervasive Computing

Der Begriff Pervasive Computing wurde in der zweiten Halfte der 1990er Jahre von der Industrie gepragt. Ziel soll es sein, die Allgegenwartigkeit von Informationen mit schon vorhandenen Techniken kurzfristig nutzbar zu machen. Bregman beschrieb die pragmatische Variante des Ubiquitous Computing folgendermassen:

_Pervasive computing is about enabling people to gain immediate access to information and services anywhere, anytime, without having to scrounge for a phone jack. However, while mobility and wireless technology are a big part of it, it's really about making e-business personal. Thanks to the explosive growth of the Internet, people will soon expect to be able to engage in electronic busi- ness effortlessly. Mark Bregman_ (Bregman)

Im Vordergrund steht hier nicht die Verdrangung des Personal Computer, wie in dem Konzept von Mark Weiser. Im Gegenteil: dem Nutzer soll es ermoglicht werden, mit einem beliebigen Endgerat von uberall auf Daten zuzugreiten. Fur die Kommunikation soll ein verteiltes Netzerwerk verwendet werden, in diesem Fall das Internet.

#### Ambient Intelligence

Im Vordergrund von Ambient Intelligence steht nicht unbedingt der technische Aspekt wie beim Ubiquitous Computing oder Pervasive Computing, sondern die Mensch-Maschinen-Kommunikation und die kunstliche Intelligenz. Alltagsgegenstande sollen zu aktiven und kommunikationsfahigen Geraten heranreifen und somit den Menschen in seinem alltaglichen Leben unterstutzen. Dafur mussen diese eine gewisse Reaktionsfahigkeit besitzen, um sich den veranderten Bedurfnissen eines Menschen anzupassen.

Zu den Auspragungen, die aus dem Begriff Ambient Intelligence hervorgehen, gehoren Smart Homes (siehe Abschnitt 2.3) sowie Ambient Assistent Living.

### 2.2 Verteilte Systeme

Verteilte Systeme bilden die Basis fur Ubiquitous Computing und all seine Forschunggebiete. Tanenbaum und van Steen charakterisieren Verteilte Systeme wie folgt:Ein verteiltes System ist eine Ansammlung unabhangiger Computer, die den Benutzern wie ein einzelnes koharentes System erscheinen

Andrew S. Tannenbaum (Tanenbaum und van Steen, 2007), S.19

Hieraus geht hervor, dass Verteilte Systeme aus einer Ansammlung von Komponenten bestehen, die untereinander verbunden sind. Wobei dem Benutzer das Gefuhl vermittelt werden soll, dass er nur mit einem einzigen System interagiert. Ziel ist es, einen leichteren Zugriff auf Ressourcen zu realisieren und die Tatsache zu verbergen, dass diese uber ein Netzwerk verteilt sind.

Um dies zu erreichen, muss ein Verteiltes System in der Lage sein, sich einer Anwendung oder einem Benutzer gegenuber als ein einziges System zu prasentieren. Diese Eigenschaft wird als Transparenz bezeichnet. Tanenbaum u. a. identifizierten hier mehrere Arten der Transparenz, die in Verteilten Systemen Anwendung finden. Die Wichtigsten sind in Tabelle 2.1 aufgelistet.

Verteilte Systeme lassen sich in verschieden Arten klassifizieren. Dazu zahlen die Ausrichtung auf Kommunikationsverhalten, Informationsverarbeitung und Pervasivitat. Anwendung finden Verteilte Rechensysteme oft in Hochleistungsanwendungen, im Bereich des parallelen Rechnens oder in Buroumgebungen, bei denen der Zugriff auf Datenbanksysteme eine entscheidende Rolle spielt.

### 2.3 Smart Home

Unter einem Smart Home versteht man eine intelligente Umgebung, die dem Anwender durch Sensorik, Analyse und Aktorik gewisse Dienste zur Verfugung stellt. Damit sollen dem Anwender Aufgaben abgenommen werden und er soll in seinem taglichen Leben unterstutzt werden. Das Smart Home wird durch die Sensorik uber die aktuellen Situationen informiert, kann diese dann analysieren und aktiv auf die Geschehnisse mittels der Aktorik eingehen.

Die Smart Homes bilden eine Untergruppe der Ambient Intelligence (2.1.2) und sind durch den Begriff "Home" einer festen Umgebung zugeteilt, namlich einer Wohnung oder einem Haus. In dem Artikel Ambient Intelligence: the Confluence of Ubiquitous/Pervasive Computing and Artificial Intelligence (Augusto (2007)) identifizierte Augusto drei Vorteile fur den Anwender:

* Erhohte Sicherheit Durch Uberwachung der Lebensgewohnheiten und Ermittlung eventuell schadlicher Situation
* Komfort Beispielsweise durch die automatische Regularitung der Temperatur
* Wirtschaft Kostenminimierung durch Kontrolle und Regulation

### 2.3 Smart Home

Unter einem Smart Home versteht man eine intelligente Umgebung, die dem Anwender durch Sensorik, Analyse und Aktorik gewisse Dienste zur Verfugung stellt. Damit sollen dem Anwender Aufgaben abgenommen werden und er soll in seinem taglichen Leben unterstutzt werden. Das Smart Home wird durch die Sensorik uber die aktuellen Situationen informiert, kann diese dann analysieren und aktiv auf die Geschehnisse mittels der Aktorik eingehen.

Die Smart Homes bilden eine Untergruppe der Ambient Intelligence (2.1.2) und sind durch den Begriff "Home" einer festen Umgebung zugeteilt, namlich einer Wohnung oder einem Haus. In dem Artikel Ambient Intelligence: the Confluence of Ubiquitous/Pervasive Computing and Artificial Intelligence (Augusto (2007)) identifizierte Augusto drei Vorteile fur den Anwender:

* Erhohte Sicherheit Durch Uberwachung der Lebensgewohnheiten und Ermittlung eventuell schadlicher Situation
* Komfort Beispielsweise durch die automatische Regularitung der Temperatur
* Wirtschaft Kostenminimierung durch Kontrolle und Regulation

konnen aktuelle Entwicklungen im Living Place uber dessen Internetprasenz2 verfolgt werden.

Footnote 2: http://livingplace.informatik.haw-hamburg.de/blog/

### 2.4 Kontext

Gerade in Smart Home Umgebungen werden dem Anwender eine grosse Vielfalt an Interaktionsmoglichkeiten geboten. Anhand von Kontextinformationen werden dem Anwender nur die momentan benotigten Eingaben oder Ausgaben angezeigt. Dadurch wird eine mogliche Oberflutung von Informationen und Interaktionsmoglichkeiten verringert. Dey definiert den Begriff Kontext wie folgt:

## _Context is any information that can be used to characterise the of an entity. An entity is a person, place, or object that is considered relevant to the interaction between a user and an application, including the user and applications themselves._

## _Anind K. Dey (Dey, 2001)_

Ein Kontext besteht also aus Informationen, die die Situation einer Person, eines Ortes oder Objektes beschreiben. Wobei hier die Situation als eine relevante Interaktion zwischen Benutzer und Anwendung zu verstehen ist.

Anwendungen, die ihr Verhalten an Kontextinformationen ausrichten, werden kontextbewusste (context-aware) Anwendungen genannt. Die Moglichkeiten fur kontextbewusste Anwendungen schlusselte Dey ([4]) in drei Kategorien auf:

* Prasentation Anpassung der Darstellungsweise von Informationen und Services anhand von Kontextinformationen
* Automatische Ausfuhrung Die automatische Ausfuhrung einer Aktion, gestutzt durch Kontextinformationen
* Historie Speicherung der Kontextinformationen, um diese zu einem spateren Zeitpunkt wieder abrufen zu konnen

### 2.5 AndroidTM

Am 05. November 2007 erklarte Google, dass sie mit einem Zusammenschluss verschiedener Hersteller das mobile Betriebssystem AndroidTM entwickeln. Dieser Zusammenschluss ist bekannt unter dem Namen Open Handset Alliance (OHA) und beinhaltet Hardware Hersteller wie HTC und Samsung, Provider wie T-Mobile und diverse Software Hersteller3. Seitdem das erste Handy mit dem AndroidTM Betriebssystem auf den Markt kam, hat sich viel verandert. Das Betriebsystem hat sich uber viele verschiedene Versionen hin weiterentwickelt und ist nun auch fur Tablet-PCs verfugbar. Momentan sind die Versionen des Betriebssystems fur Handy und Tablet-PC noch voneinander getrennt, zukunftig werden diese beiden Strange aber zusammengefuhrt.

Footnote 3: Eine vollstandige Liste aller Firmen kann unter folgender URL abgerufen werden: http://www.openhandsetalliance.com/oha_members.html (aufgerufen am 07.07.2011)

Die Abbildungen 2.3 stellen die Anzahl aktiver AndroidTM-Gerate zu unterschiedlichen Zeitpunkten dar. Hier ist innerhalb eines Jahres eine signifikante Steigerung zu erkennen, wo-durch das enorme Potential von AndroidTM ersichtlich wird.

Fur die Entwicklung von Applikationen wird die Programmiersprache Java verwendet. Dabei wird ein Entwickler durch ein umfangreiches Applikation Programming Interface (API) unterstutzt, welches weitestgehend der Java Standart Edition (J2SE) entspricht (Meier (2010)). Lediglich geschwindigkeitskritische Bereiche werden in der Programmiersprache C oder C++ implementiert. Diese nativen Bibliotheken werden beispielsweise fur Bildbearbeitung und Medienwiedergabe verwendet.

[MISSING_PAGE_EMPTY:16]

### 0.2 Grandagent

## Chapter 3 Analyse

Ziel dieser Analyse ist es, die Anforderungen und Interaktionen am Beispiel einer intelligenten Turklingel zu identifizieren und zu untersuchen. Hierfur werden zunachst einige Beispielszenarien vorgestellt und anschließend dessen Anforderungen formuliert.

### 3.1 Szenarien

In diesem Kapitel sollen mogliche Szenarien erlautert werden, anhand derer unterschiedlichste Interaktionen erkennbar werden. Dabei handelt es sich um Interaktionen zwischen Menschen uber das zu entwickelnde System, zwischen Mensch und Maschine und auch uber Interaktionen innerhalb des Systems.

#### Besucher klingelt

In einer konventionellen Wohnung befinden sich die Klingelsysteme meist an fest definierten Positionen. Die Komponente auf die der Bewohner in seiner Wohnung Zugriff hat, befindet sich an der Wohnungstur und die fur den Besucher befindet sich an der Haustur. Ziel soll es nun sein, das autarke System in die Umgebung eines Smart Homes zu integrieren.

Wenn sich ein Besucher vor der Haustur befindet, stehen ihm je nach der aktuellen Situation unterschiedliche Interaktionen zur Verfugung. Ist der Bewohner zu Hause, wird dem Besucher der Knopf zum Klingeln bereitgestellt. Dabei kann hier zwischen einem Einpersonenund Mehrpersonenhaushalt unterschieden werden. Dem Besucher wird bei einem Mehrpersonenhaushalt angeboten, fur jede Personen, die in der Wohnung lebt, zu klingeln. Hat sich der Besucher entschieden, fur eine Person zu klingeln, wahlt er diese uber die Oberflache der Turklingel aus. Reagiert der Bewohner auf das Signal, wird eine Kommunikation zwischen den Personen aufgebaut. Reagiert dieser nicht oder lehnt die Kommunikation ab, wird dem Besucher eine neue Oberflache geoffnet. Durch diese wird der Person mittgeteilt, dass der Bewohner momentan nicht verfugbar ist. Zusatzlich wird das Hinterlassen einerGanzlich andere Ablaufe und Interaktionen stehen dem Bewohner zur Verfugung. Ist dieser zu Hause und verfugbar, wird ihm das Klingeln uber eine visuelle Benachrichtigung signalisiert. Die Visualisierung kann hierbei auf einem Fernseher, Computer, Smartphone, Kuchengerat oder einem anderen elektronischen Gerat stattfinden. Innerhalb eines Fensters wird das Live-Video vom Smartphone angezeigt, welches sich vor der Haustur befindet. Ist die Position des Bewohners bekannt, weil diese durch ein vorhandenes Indoor-Positioning-System (Otto und Voskuhl (2010/2011)) erkannt wurde, wird die Visualisierung auf ein in der Nahe befindliches Gerat beschrankt. Ist die Position zur Zeit nicht bekannt, wird die Benachrichtigung auf jedem Gerat in der Wohnung angezeigt, welches die Moglichkeit zur Signalisierung bietet.

Wurde vom System ein geeignetes Gerat zur Anzeige ermittelt, wird hier dem Bewohner eine Nachricht angezeigt. Hier kann er sich nun entscheiden, ob er mit dem Besucher sprechen mochte oder nicht. Reagiert der Bewohner nicht, wird das Fenster nach einer gewissen Zeitspanne geschlossen und der Besucher wird uber die Abwesenheit informiert. Das passiert auch, wenn der Bewohner die Kommunikation mit dem Besucher ablehnt. Sollte der

#### 3.1.2 Benutzerauthentifizierung

In diesem Szenario wird beschrieben, wie sich Personen beim System authentifizieren konnen. Wie im vorherigen Szenario beschrieben, dient eine smarte Turklingel nicht nur dazu, eine konventionelle Turklingel zu ersetzen und somit einen weiteren Schritt zum Smart Home und der Vision des Ubiquitous Computing zu erreichen. Es ware zum Beispiel denkbar, durch geeignete Authentifizierungsmechanismen den Wohnungsschlussel durch ein Smartphone zu ersetzen, Nachrichten fur bestimmte Personen zu hinterlassen oder dem Brieftrager das Offten einer speziellen Paketklappe zu erlauben. Geeignete Authentifizierungsmechanismen konnen beispielsweise der Abgleich biometrischer Daten oder die Eingabe eines Passwortes sein.

Uber die Kontakte, die im Smart Home uber einen Dienst verwaltet werden, hat der Bewohner die Moglichkeit, bestimmte Personen mit gesonderten Rechten auszustatten. Dies kann beispielsweise eine Zutrittsberechtigung zur Wohnung oder eine Nachrichten fur bestimmte Besucher sein. Wird ein Kontakt mit solchen Eigenschaften ausgestattet, wird ein eindeutiger Schlussel generiert und auf das Smartphone der Person transferiert. Wie eine intuitive Bedienung eines Kontaktdienstes aussehen kann, zeigt Google momentan mit Google+1. Hier konnen Personen auf simple Art gruppiert werden, mittels sogenannter Circles (Abbildung 3.3). Fur den Einsatz in einem Smart Home konnte dann ein Circle fur eine bestimmte Berechtigung stehen.

Halt eine Person ihr Smartphone an die Turklingel, wird dieser Schlussel ubertragen und das System pruft, ob ein entsprechender Datensatz zur Verfugung steht. Existiert ein Datenstatz, wird die Person aufgefordert, ein Passwort einzugeben, um die l'edntitat zu bestatigen. Je nach gewunschter Sicherheitsstufe sind hier verschiedene Verfahren denkbar. Die einfachste Moglichkeit stellt die Eingabe eines simplen Passwortes dar. Moglich ist aber auch das Aufzeichnen eines komplexen Symbols auf das Display oder die Authentifizierung uber die Stimme. Konte der Besucher kein Passwort anlegen, weil die Berechtigung vom Bewohner spontan angelegt wurde, generiert das System automatisch eine PIN-Nummer und versendet diese an des Smartphone des Berechtigten.

Wurde verifiziert, dass es sich um die richtige Person handelt, werden die fur die Person spezifischen Eigenschaften angezeigt. Dies konnen hinterlassene Nachrichten sein oder die Moglichkeit, die Tur zu offen. Bettrit eine Person die Wohnung, wird der Bewohner automatisch daruber informiert. So kann zusatzlich sichergestellt werden, dass sich keine unbefugte Person in der Wohnung aufhait.

#### Mobile Turklingel

Die vorherigen Szenarien gingen immer von einem fest installierten Smartphone an der Haustur aus, welches alle notwendigen Funktionen zur Verfugung stellt und fest in die Umgebung des Smart Homes integriert ist. Denkbar ist aber auch die Verlagerung der festen Systemkomponente vor der Haustur in eine mobile Applikation, die auf jedem Smartphone installiert werden kann. Somit konnte jeder Anwender immer eine personalisierte Turklingel mit sich fuhren.

Sobald eine Person an einer Tur steht und klingeln mochte, halt diese das Smartphone an ein Feld. Durch dieses Feld werden der mobilen Applikation automatisch alle notwendigen Daten ubermittelt, um sich in die Wohnungsumgebung zu integrieren. Ein Beispiel fur eine mogliche Ubertragungsart stellt NF\({}^{2}\) dar. Zusatzlich ubersendet die Anwendung dem System in der Wohnung Daten, um den Besucher zu identifizieren. Handelt es sich hierbei umeine dem System gegenuber unbekannte Person, stehen wie in dem Szenario "Besucher klingelt" 3.1.1 dem Besucher nur eingeschrankte Moglichkeiten, wie das Klingeln fur eine in der Wohnung lebenden Person oder das Hinterlassen einer Nachricht zur Verfugung. Ist die Person dem System gegenuber aber bekannt, konnen nach einer Authentifizierung, wie in Szenario 3.1.2 beschrieben, weitere Informationen ubermittelt werden. Dazu kann das Anzeigen von Nachrichten, die fur diese Person hinterlassen wurden oder das Offnen der Tur gehoren.

Durch die automatische Integration unterschiedlichster Fremdgerate in das bestehende System wird hier aber auch ein schwer zu kontrollierende Sicherheitslucke generiert. Smartphones stellen im Wesentlichen kleine mobile Computer dar, die wie normale Personal Computer auch anfallig fur den Bfall von Viren, Trojanern, etc. sind. Werden diese in die Wohnungs-umgebung integriert, konnen sie auch dieses System infizieren. Die Entwicklung eines geeigneten Sicherheitskonzeptes wird hier nicht weiter verfolgt, da der Fokus der Arbeit auf den Interaktionen des Systems liegt und nicht deren Sicherheitsaspekte beinhaltet.

### 3.2 Anforderunganalyse

Aufgrund der erstellten Szenarien ergeben sich funktionale- und nicht-funktionale Anforderungen, die hier aufgefuhrt und beschrieben werden.

#### Funktionale Anforderungen

Anhand der funktionalen Anforderungen werden die gewunschten Funktionalitaten und das Verhalten des Systems beschrieben.

### 3.2 Klingeln senden

Das System soll einem Besucher ermoglichen, Personen innerhalb der Wohnung uber ein Klingeln zu erreichen.

Der Besucher soll:

\(\bullet\) Eine Auswahl der in der Wohnung lebenden Personen erhalten, fur die er klingeln darf

\(\bullet\) Durch Beruhrung des Klingelknopfes das Signal absetzen

Das System soll:

\(\bullet\) Klingelknopf zur Verfugung stellen

[MISSING_PAGE_EMPTY:24]

* Dem Besucher die Ablehnung visualisieren

### Aufbau und Abbau einer Audio- und Videoubertragung

Nach Annahme des Klingelsignals auf einem bestimmten Gerat soll nun die spezifisch konfigurierte Ubertrag zwischen diesem Gerat und der Turklingel aufgebaut werden. Nach einer Kommunikation findet der Verbindungsabbau statt. Dieser kann von jeder der beteiligten Seite durchgefuhrt werden und wird entweder mit dem Beenden des Gespraches oder dem Offnen der Tur in die Wege geleitet.

Der Bewohner soll:

* Die Ubertragungsarten wahlen konnen
* Die Kommunikation beenden durfen
* Die Tur offnen konnen

Der Besucher soll:

* Die Kommunikation beenden durfen

Das System soll:

* Eine audiovisuelle Ubertragung zwischen beiden Geraten ermoglichen
* Eine Audioubertragung von beiden Geraten, Videoubertragung nur ausgehend von der Turklingel ermoglichen
* Dem Bewohner bei der Kommunikation durch die Wohnung folgen
* Die Verbindung zwischen den Geraten beenden
* Die Gerate wieder in den Ursprungszustand versetzen

### Tur offnen

Den Anwendern des Systems soll das Ansteuern der Tur ermoglicht werden. Nachdem ein Besucher geklingelt hat, soll dem Bewohner diese Moglichkeit zur Verfugung stehen. Dafur muss er das Klingeln nicht annehmen, sondern er kann die Tur direkt offnen. Wenn einem Besucher die Berechtigung gegeben wurde, die Tur zu offnen, soll ihm diese Funktion nach einer Authentifizierung angezeigt werden.

Der Bewohner soll:* Die Moglichkeit erhalten, die Tur offen zu konnen Der Besucher soll:
* Nach einer Authentifizierung die Moglichkeit erhalten, die Tur zu offenen Das System soll:
* Die Moglichkeit besitzen, das Turschloss anzusteuern, um die Tur zu offen

### Videonachricht hinterlassen

Fur denn Fall, dass sich niemand in der Wohnung befindet, sollte das System auch die Moglichkeit bereitstellen, Nachrichten in Form einer kurzen Videobotschaft zu hinterlassen. Der Besucher soll:

* Eine Videobotschaft fur den Bewohner hinterlassen konnen Das System soll:
* Einen Knopf zum Starten der Aufnahme bereitstellen
* Einen Knopf zum Beenden der Aufnahme bereitstellen
* Die aufgezeichnete Nachricht an einen persistenten Speicherplatz ubertragen

### Videonachricht abrufen

Dem Bewohner soll die Moglichkeit gegeben werden, Videobotschaften abzurufen, die ein Besucher fur ihn hinterlassen hat.

Der Bewohner soll:

* Die Moglichkeit haben, Videobotschaften abzurufen Das System soll:
* Einen Knopf zum Abholen der Aufnahme bereitstellen

## Authorizierung von Personen

Dem System wird ein Dienst zur Verfugung gestellt, der Anhand von Authentifizierungsmechanismen die Identifat von Personen verifizieren kann. Dadurch konnen bestimmte Personen mit gesonderten Rechten ausgestattet werden, die nicht jeder Person zur Verfugung stehen sollen.

### Nicht-Funktionale Anforderungen

Die nicht-funktionalen Anforderungen beschreiben, in welcher Qualitat die genannten Funktionen umgesetzt werden sollen. Damit besitzen sie eine grosse Auswirkung auf den Verbrauch von Ressourcen, Entwicklung und Wartung. Zusatzlich dienen diese Anforderungen dazu, die Akzeptanz des Systems gegenuber dem Anwender zu erhohen (Buschmann u. a. (2000)).

### Zuverlassigkeit

Fur die Akzeptanz eines System ist die Zuverlassigkeit eine Grundvoraussetzung. Dabei muss das korrekte Verhalten stets sichergestellt sein. Im Fall eines Fehlers muss zusatzlich der Ubergang in einen gesicherten Zustand gewahrleistet werden. Es ware fatal, wenn das System durch einen Fehler jeder Person Zurtritt zur Wohnung gewahren wurde oder im umgekehrten Fall niemanden mehr in die Wohnung lasst.

Aufgrund der Zuverlassigkeit sollte die Installation selten in einen inkorrekten Zustand geraten. Sollte dies doch ein mal vorkommen, muss es dem Bewohner moglich sein, das System wieder in einen korrekten Zustand zu uberfuhren.

### Sicherheit

Eine Vorraussetzung fur den Einsatz dieses Systems ist die Sicherheit. In Bezug auf das System werden hier zwei Aspekte der Sicherheit betrachtet. Zum einen die Sicherheit der Daten, zum anderen die des Wohnungsumfeldes.

Die Sicherheit der abgelegten Daten, spielen eine grosse Rolle fur die Privatsphare der Bewohner. Hier muss mit modernen Sicherheitsrichtlinien darauf geachtet werden, dass jede Person nur auf die Daten zugreifen kann, die fur diese auch bestimmt sind. Mochte einBewohner zum Beispiel eine Nachricht fur eine bestimmte Person an der Turklingel hinterlassen, muss sichergestellt sein, dass auch nur diese Person die Nachricht abrufen kann. Das Gleiche gilt auch im umgekehrten Fall.

Ein anderer Aspekt ist die Sicherheit des Wohnungsumfeldes. Das bedeutet, es muss anhand von modernen Authentifizierungsmechanismen und Sicherheitsrichtlinien gewahrleist sein, dass keine Person widerrechtlich Zurtrit zur Wohnung erlangen kann.

### Erweiterbarkeit

Die Umgebung, in die sich das System integrieren soll, ist einem standigen Wandel ausgesetzt. Dem Anwender muss es moglich sein, Gerate in das System zu integrieren, ohne die seplizit einstellen zu mussen. Dazu gehoren elektronische Gerate, die in einer Wohnung offers durch modernere ersetzt werden. Des Weiteren sollen mobile Gerate der Besucher automatisch in das System integriert werden, wenn sich diese in der Wohnung befinden. Auf der anderen Seite muss dem Anwender das Entfernen dieser Gerate genau so leicht gemacht werden wie das Einfugen. Um dies zu gewahrleisten, ist eine lose Kopplung der Gerate notwendig. Dadurch stehen die Funktionalitaten wahrend des Hinzufugens, Entfernens oder Autauschens der Komponenten weiterhin zur Verfugung.

Zur Erweiterbarkeit gehort nicht nur der Ausbau von Funktionalitaten durch die Hardware, sondern auch die Erweiterung durch Software. Dem Entwickler wird hier durch definierte Schnittstellen ermoglicht, dem System weitere Fahigkeiten hinzuzufugen. Des Weiteren muss es moglich sein, die Zuverlassigkeit, die Sicherheit und den Komfort des Systems nachtraglich zu erhohen.

### Privatsphare

Um das System fur den Benutzer moglichst komfortabel zu gestallten und mit einem grossen Funktionsumfang zu versehen, mussen private Daten erhoben werden. Anhand dieser Daten kann das System Entscheidungen treffen und aus den Gewohnheiten des Bewohners lernen. Hierbei kann es sich um Positionsdaten handeln, um zu erkennen, ob sich ein Bewohner in einem privaten Bereich befindet. Dazu gehort ebenfalls die Erkennung und Speicherung von Bewegungsprofilen, damit eine stattfindende Kommunikation dem Bewohner durch die Wohnung folgen kann. Aber auch die Nachricht eines Besuchers darf nur von der Person abrufbar sein, fur die diese Nachricht bestimmt ist.

Es ist also darauf zu achten, dass das System nur Daten erhebt, die es fur die Gewahrleistung der Funktionalitaten wirklich benötigt. Des Weiteren muss darauf geachtet werden,dass keine unbefugte Person oder ein anderes System darauf Zugriff erhalt, da sonst eine eventuelle Veroffentlichung der Daten nicht mehr verhindert werden kann.

### 3.3 Kontextabhangigkeit

In der Umgebung eines Smart Homes, welches sich durch den Ansatz des Ubiquitous Computing durch eine Vielzahl von Computern auszeichnet, erzeugen die zur Verfugung stehenden Dienste unzahlige Informationen. Damit diese Informationsflut den Anwender nicht uberfordert, ist es essentiell, den aktualen Kontext zu erfassen, ihn auszuwerten und den Anwendungen im Smart Home zur Verfugung zu stellen.

Die Generierung einer Kontextabhangigkeit unterteilt sich in verschiedene Teilaspekte. Um Anwendungen einen Kontext zur Verfugung zu stellen, mussen diese erst einmal identifiziert werden. Wurden verschiedene Kontexte fur eine Anwendung ermittelt, mussen Informationen zusammengetragen werden. Anhand derer kann dann entschieden werden, ob ein Kontext zur Zeit zutrifft.

Die Erkennung und Bekanntgabe des Kontextes wird hierbei nicht durch das System gewahrleistet, sondern durch die Umgebung, in der das System integriert wird, bereitgestellt (Ellenberg (2010/2011)).

#### Identifizierte Kontexte

Fur die hier zu konzipierende Turklingelanwendung stellen Kontexte eine erhebliche Unterstutzung bei der Bereitstellung von Funktionalitaten dar. Sie bieten die Moglichkeit, dem Anwender nur die Funktionalitaten einzublenden, die er momentan benotigt. Somit wird dieser nicht mit der Auswahl unzahliger Fahigkeiten und Informationen uberfordert.

Anhand der entwickelten Szenarien konnten verschiedene Kontexte identifiziert werden, die fur eine Turklingelanwendung von nutzen sind. Diese werden im Folgenden vorgestellt:

* Bewohner ist zu Hause und verfugbar: In diesem Kontext befindet sich der Bewohner zu Hause und ist bereit, Besucher zu empfangen. Durch mogliche Privatsphareeinstellungen, die vom Benutzer getatigt wurden, werden der Anwendung zusatzliche Informationen ubermittelt. Dadurch kann diese beispielsweise erkennen, welche Art der Kommunikation aufgebaut werden soll.
* Bewohner ist zu Hause und nicht verfugbar: In diesem Kontext befindet sich der Bewohner zwar zu Hause, mochte aber nicht gestort werden. Wann dies der Fall ist wird vom Bewohner gesteuert. Dieser kann zumBeispiel einstellen, dass der Kontext aktiv wird, wenn er auf dem Sofa einschlaft oder einen Film guckt. Moglich ist aber auch, den Kontext explizit bei dem Klingeln eines Besuchers zu aktivieren.
* Bewohner ist nicht zu Hause: Dieser Kontext wird aktiviert, sobald der Bewohner die Wohnung verlasst. Hierdurch erkennt die Anwendung zum Beispiel das die Funktionalitat des Klingelns im Moment nicht angeboten werden muss.

#### Informationsgewinnung

Nachdem die erforderlichen Kontexte fur die Anwendung identifiziert wurden, mussen diese jetzt wahrend der Laufzeit des Systems erkannt werden. Hier bildet die Informationsgewinnung die Basis zur Erkennung eines Kontextes.

Um der Anwendung einen Kontext bereitzustellen, werden eine Vielzahl von Informationen benotigt. Dabei spielt nicht nur die Positionsbestimmung eine Rolle. Schmidt (Schmidt u. a. (1999)) beschreibt in seinem Artikel, das zur Kontextkennung moglichst viele Sensortechniken zum Einsatz kommen mussen. Dazu zahlen optische, Bewegungs-, Lokations-, Audio-, Bio- und spezialisierte Sensoren. Die Verknupfung der einzelnen Daten, welche von den Sensoren bereitgestellten werden, wird als Sensorfusion bezeichnet.

#### Entscheidungsfindung

Das System sammelt die Informationen, die durch die Sensoren zur Verfugung gestellt werden. Danach wertet dieses die Informationen aus und legt ihre Prioritat fest. Anschließend wird anhand spezieller Muster verglichen, ob die gesammelten Informationen einem Kontext zuzuordnen sind. Um allen im Netzwerk vorhandenen Komponenten die gleichen Informationen zur Verfugung stellen zu konnen, sollte die Kontextstellung durch eine zentrale Stelle ausgefuhrt werden. Somit konnen Konsistenzprobleme vermieden werden (Voskuhl (2010/2011)).

Am Beispiel des Kontextes "Bewohner ist zu Hause und nicht verfugbar" ist ersichtlich, dass eine grosse Menge an Informationen benotigt wird, um eine Entscheidung zu treffen. Hier spielt nicht nur die Position eine Rolle, sondern auch wie spat es ist, ob es hell oder dunkel ist und in welchem Zustand sich der Bewohner befindet. Dabei ist es nicht nur wichtig, welche Sensoren miteinander kombiniert werden, sondern auch, welche Informationen diese liefern. Wird beispielsweise durch den Lokationssensensor ermittelt, dass der Bewohner auf dem Sofa liegt und die Biosensoren mitteilen, dass dieser schlaft, wurde der Kontext zutreffen. Liegt er aber auf dem Sofa, ist wach und durch einen Audiosenssor wird signalisiert, dass er Musik

[MISSING_PAGE_EMPTY:32]

## Interaktionen der Anwender

Anhand der Szenarien wurden verschiedene Interaktionen mit dem System identifiziert. Auf welche Art und Weise eine Mensch-Maschinen-Interaktion durchgefuhrt werden kann, hangt dabei von dem Anwender ab. Der Bewohner des Smart Homes erhalt hier mehr Interaktionsmoglichkeiten als der Besucher.

Der Besucher interagiert mit dem System ausschließlich uber die Turklingel. Da diese durch ein Smartphone oder gegebenenfalls durch einen Tablet-PC reprasentiert wird, bieten sich fur den Besucher Touch-basierte Interaktionen an. Das bedeutet, Interaktionen wie das Klingeln oder hinterlassen einer Nachricht werden uber Beruhrungen gesteuert.

Der Bewohner kann hingegen auf wesentlich mehr Interaktionsmoglichkeiten zuruckgreifen. Denkbar sind hier Touch-basierte Steuerelemente genauso wie eine Kamera-basierte Gestenerkennung oder eine Sprachsteuerung. Ein Beispiel hierfur ist das Ablehnen eines Besuchers. Nach der Visualisierung des Besuchers sagt der Bewohner einfach,,Ich bin beschaftigt". Die Sprachsteuerung der intelligenten Wohnung erkennt den Befehl und leitet diesen an die Turklingel weiter.

Um den Umgang mit dem System zu erleichtern und den Komfort zu erhohen, sollten diverse Interaktionen nicht mehr durch den Bewohner ausgefuhrt werden. Durch die Kontexterennung im Smart Horne konnen automatisch Anpassungen im System der Turklingel erfolgen. Dazu gehoren beispielsweise die Privatsphareeinstellung. Zusatzlich muss aber noch gewahrleistet sein, das der Bewohner diese Einstellungen auch selber vornehmen kann.

## Chapter 3.5 Machbarkeitsstudie

Anhand der gesammelten Information kann nun ermittelt werden, ob das System realisierbar ist. Hierfur werden bestimmte Anforderungen an Hardware und Software gestellt. Dabei steht hier nicht die mogliche Realisierung aller Funktionalitaten im Vordergrund, die in den Szenarien ermittelt wurden, sondern eine generelle Realisierbarkeit. Dazu werden die Moglichkeiten des mobilen Betriebssystems Android(tm) im folgenden Abschnitt kurz aufgefuhrt.

### 3.5 Machbarkeitsstudie

Anhand der gesammelten Information kann nun ermittelt werden, ob das System realisierbar ist. Hierfur werden bestimmte Anforderungen an Hardware und Software gestellt. Dabei steht hier nicht die mogliche Realisierung aller Funktionalitaten im Vordergrund, die in den Szenarien ermittelt wurden, sondern eine generelle Realisierbarkeit. Dazu werden die Moglichkeiten des mobilen Betriebssystems Android(tm) im folgenden Abschnitt kurz aufgefuhrt.

#### Anforderungen

Prinzipiell stellt ein modernes Smartphone, das mit dem Betriebssystem Android(tm) ausgestattet ist, alle Eigenschaften zur Verfugung, die benotigt werden, um dieses Projekt zu ermoglichen. Hardwareseitig stehen ein Mikrofon, zwei Kameras, ein Touchdisplay und diverse Schnittstellen fur die Kommunikation mit anderen Geraten zur Verfugung.

Softwareseitig konnen die benotigten Funktionen durch eine Vielzahl von APIs realisiert werden. Dazu zahlen die Ubertragung und Speicherung von audiovisuellen Daten und die Verbindung zu anderen Komponenten.

Andere mobile Betriebssystem stellen zum aktuellen Zeitpunkt keine Alternative zu Android(tm) dar. Hier sind insbesondere Windows Phone 7 und Appels IOS zu nennen. Ersteres bot zum Zeitpunkt der Implementierung keinen Zugriff auf Socket-Schnittstellen, welches essentiell fur das Versenden von audiovisuellen Daten ist. Gegen Apple spricht hingegen der kostenpflichtige Developer Account und die geringe Gerateauswahl.

#### Beispielprojekte

Aufgrund der Open Source Orientierung bildet das mobile Betriebsystem Android(tm) eine gute Basis. Den Entwicklern wird hier eine Vielzahl von Moglichkeiten geboten. Diese baut Google mit dem neuen Projekt Android(tm) home weiter aus. Hierdurch soll Android(tm) nun auch Einzug in den Markt der Hausautomatisierung halten. Zu den ersten Projekten zahlen die Ansteuerung von Leuchtmitteln und die Steuerung des Heimkinos durch das Projekt,,Tungsten". Dies ist in dem Onlineartikel von Stephen Shankland und Jan Kaden (Shankland und Kaden (2011)) 3 nachzulesen.

Footnote 3: Bei der Erstellung der Arbeit standen zu diesem Themengebiet noch keine wissenschaftlichen Studien zur Verfügung.

Daraus ist ersichtlich, dass es sich bei Android(tm) nicht nur um ein mobiles Betriebssystem fur Handys handelt. Es ist vielmehr so Vielseitig, dass es in den verschiedensten Gebieten

[MISSING_PAGE_EMPTY:35]

## Chapter Design

Im vorherigen Kapitel wurden anhand von Szenarien Anforderungen fur das System entwickelt und spezifiziert. Auf Basis dieser Anforderungen soll in diesem Kapitel mittels Methoden des Software-Engineerings ein Design fur das System entwickelt werden.

### 1.1 Architektur

Das Einsatzgebiet einer Turklingel ist typischerweise an eine bestimmte Umgebung gebunden, ein Haus oder eine Wohnung. Um dem Anwender den Funktionsumfang der beschriebenen Szenarien anbieten zu konnen, muss das System in unterschiedlichen Raumen und auf verschiedenen Geraten zur Verfugung stehen. Dadurch entsteht eine heterogene Geratenandschaft, mit der das System umgehen muss.

Hieraus konnen mehrere Aspekte abgeleitet werden. Der Erste besagt, dass die Umgebung aus mehreren Komponenten besteht. Der Zweite sagt etwas uber die Kommunikation dieser Komponenten aus. Diese mussen auf die eine oder andere Weise autonom zusammenarbeiten und bilden somit die Kernaufgabe eines Verteilten Systems ab. Der letzte Aspekt besagt etwas uber die Wirkung des Systems gegenuber dem Anwender aus. Obwohl die gesamte Umgebung aus unterschiedlichen Komponenten und Systemen besteht, soll hier dem Benutzer suggeriert werden, dass er es mit einem einzigen System zu tun hat.

### 1.1 Systemuberblick

Das hier zu entwickelnde Design besteht aus unterschiedlichen Komponenten, die in das bestehende System des Living Place integriert werden sollen. Das System besteht aus der Turklingel die durch ein Smartphone an der Tur reprasentiert wird. Den einzelnen Gegenstellen, die sich innerhalb der Wohnung befinden und einem Nachrichtensystem. Die Abbildung 4.1 zeigt die einzelnen Komponenten des Gesamtsystems und die Kommunikationswege untereinander.

Hierbei gibt es zwei unterschiedliche Arten, wie die einzelnen Komponenten untereinander kommunizieren. Man unterscheidet hier die synchrone von der asynchronen Kommunikation. Die synchronize Kommunikation wird durch die audiovisuelle Verbindung zwischen der Gegenstelle und der Turklingel reprasentiert. Sie bildet ein reales Gesprach zwischen Gesprachsparternn ab. Der Austausch von Informationen und Einstellungen zwischen den Komponenten wird uber ein Nachrichtensystem mittels asynchroner Nachrichten ermoglicht. Eine detaillierte Beschreibung der Kommunikationsarten folgt in Kapitel 4.2.

### Dienstorientierte Architektur

Im Mittelpunkt dieses Architekturmusters stehen Dienste, die von unterschiedlichen Komponenten innerhalb eines Systems angeboten werden. Sie kapseln Funktionalitaten und Daten und machen diese uber wohldefinierte Schnittstellen erreichbar. Im Vergleich zu Komponenten sind Dienste plattformunabhangig und bieten somit eine hohere Interoperabiltat, welche die Realisierung Verteilter Anwendungen erleichtert. Eine stark verbreitete Form der Dienstorientierten Architekturen stellt die Service-orientierte Architektur (SOA) dar. Weitere Aspekte dieses Architekturmusters werden in (Schill und Springer (2007)) beschrieben.

Fur das System ist damit nicht von Bedeutung, welches Gerate in die Umgebung integriert wird, sondern welche Dienste von diesem Gerat zur Verfugung gestellt werden. Ein Fernseher wurde zum Beispiel Dienste zur Wiedergabe von Audio- und Videoinhalten zur Verfugung stellen. Ein Mikrofen hingegen nur den Dienst Audioinhalte aufzuzeichnen. Des WeiterenKonnen die Dienste auch miteinander kombiniert werden, um dem Anwender komplexere Funktionen zur Verfugung zu stellen. Hierbei werden zwei Arten unterschieden. Zum einen die Orchestrierung, zum anderen die Choreographie.

Die Orchestrierung hat das Ziel, komplexe Dienste anhand der Zusammensetzung einzelner einfacher Dienste zu erzeugen. Dabei prasentiert sich der orchestrierte Dienst dem Anwender gegenuber als ein einziger Dienst, indem er die verwendeten Dienste nach aufsen hin kapselt. Ein Beispiel hierfur ist der audiovisuelle Dienst. Dieser wirkt nach aufsen hin wie ein einziger Dienst, im Hintergrund greift dieser aber auf die Dienste verschiedener Gerate zu.

Im Gegensatz dazu steht die Choreographie. Hier werden die verschiedenen Dienste zu einem Ablauf zusammengefasst. Es entsteht ein fester Ablauf der einzelnen Dienste. Im Gegensatz zur Orchestrierung sind hier alle verwendenden Dienste fur den Anwender sichtbar (Schill und Springer (2007)).

Die Intelligenz der einzelnen Komponenten muss in diesem Architekturnuster sehr stark ausgepragt sein, da die Verwaltungsaufgaben hier von keiner zentralen Komponente ubernommen werden. Dadurch entstehen hohere Kosten, weil normale Komponenten wie Mikrofone oder Lautsprecher zusatzlich noch mit der entsprechenden Intelligenz und der zugehorigen Kommunikationsfahigkeit versehen werden mussen.

Allerdings bietet dieses Muster auch ein hohes Mass an Flexibilitat. Durch die lose Kopplung konnen jederzeit Komponenten hinzugefugt, entfernt oder getauscht werden.

### Zentralisierte Architektur

Laut (Dunkel u. a. (2008)) stellt dieses Architekturmodell das grundlegende Modell fur Verteilte Systeme dar. Es teilt sich in zwei Partitionen auf, dem Anbieter eines Dienstes, also dem Server und dem Kunden, auch Client genannt.

Die Dienste, die der Server zur Verfugung stellt, kann man im Allgemeinen mit dem Erledigen einer festgelegten Aufgabe gleichsetzen. Dies konnte zum Beispiel eine Berechnung oder das Erfragen eines Datensatzes sein. Die Kommunikation zwischen dem Client und dem Server ist meist eine synchrone Kommunikation. Der Client wartet nach dem Senden einer Anfrage solange, bis er vom Server die Antwort erhalt. Das Modell kann aber auch auf einer asynchronen Kommunikation beruhen, bei der der Client nach dem Senden einer Anfrage erst mal weiterarbeitet. Zu einem spaterem Zeitpunkt bekommt der Client eine Benachrichtigung vom Server, dass eine Antwort vorliegt.

Fur das hier zu erstellende System wurde das bedeuten, der Server musste jede Komponenten im System kennen. Dazu zahlen beispielsweise die Adresse und die angebotenen Dienste eines Gerates, wie auf Abbildung 4.2 dargestellt. Durch die Zentralisierung besitzt dieses Architekturnuster den Vorteil, dass auch normale Komponenten wie Mikrofone verwendetet werden konnen, ohne diese mit spezieller Intelligenz ausstatten zu mussen. DadurchKonren Kosten eingespart werden. Auf der anderen Seite stellt der Server aber auch einen sogenannten,,single point of failure" dar. Produziert dieser einen Fehler, ist das ganze System nicht mehr funktionsfahig. Um die Ausfalsicherheit des Systems zu erhohen, muss hier mit Redundanzen gearbeitet werden. Weitere Eigenschaften sind unter (Schill und Springer (2007)) zu finden.

Eine modernere Auspragung stellt die 3-Tier Architektur 4.3 dar. In Folge dessen wurden die Klienten die Prasentationsebene und die Steuerungsebene beinhalten, wahrend das Modell auf unterschiedlichen Servern verteilt wird. Die Logik der Anwendung wurde auf einem Applikationsserver Platz finden. Gleichzeitig werden die Daten auf einen Datenbankserver abgelegt.

Durch das Ablegen der Daten in einem Datenbanksystem wird nicht nur die Persistenz erhoht, sondern das System hat zusatzlich noch Zugriff auf Daten, die von anderen Dienst dort abgelegt wurden, zum Beispiel Adressen, Vorlieben oder Berechtigungen einer Person.

## Peer-to-Peer Architektur

In einem Peer-to-Peer Netzwerk werden die beteiligten nicht mit einer bestimmten Rolle belegt, wie es zum Beispiel beim der Client-Server Architektur der Fall ist. Jeder Knoten in diesem Netzwerk ist ein gleichgestellter Partner, daher auch der Name Peer(engl.: Ebenburtige). Ein Peer ist in seiner Rolle nicht beschrankt, er kann der Anbierte eines Dienstes sein oder der Kunde, der einen anderen Dienst in Anspruch nehmen mochte (Dunkel u. a. (2008), Dustdar u. a. (2003)). Peers kommunizieren unmittelbar und direkt miteinander. Dies bedeutet, es finden keine Umwege uber Server statt.

Die Abbildung 4.4 soll den prinzipiellen Aufbau eines Peer-to-Peer Systems darstellen. Durch den Wegfall einer zentralen Organisation wird die Flexibilitat im Vergleich zu einem Client-Server System stark erhöht. Es konnen zur Laufzeit Komponenten getauscht, hinzugefugt oder entfernt werden. Zudem existiert in diesem Architekturmuster kein,,single point of failure". Fallt ein Peer aus, ist das System immer noch funktionsfahig. Es muss lediglich ein neuer Peer gesucht werden, der den gleichen Dienst anbietet. Um diesen Funktionsumfang realisieren zu konnen, mussen die Komponenten mit zusatzlicher Intelligenz ausgestattet werden. Des Weiteren benotigen die Gerate zusatzliche Schnittstellen, um die Kommunikationsfahigkeit zu gewahrleisten. Dadurch wird die Anzahl der infrage kommenden Gerate stark reduziert, da die auf dem Markt verfugbaren Gerat meist nicht die erforderlichen Eigenschaften besitzen.

Die gezeigte Darstellung soll die gegenseitige Kommunikation der Komponenten unterneinander symbolisieren. Dies ist mit handelsublichen Komponenten wie Kameras, Mikrofonen oder Lautsprechern nicht machbar. Da diese nicht mit der geeigneten Rechenleistung, Kommunikationsfahigkeit und Intelligenz ausgestattet sind. Daher muss fur jede Komponente, die ins Wohnungssystem integriert werden soll, ein passendes Modul erstellt werden. Durch das

[MISSING_PAGE_EMPTY:41]

symbolisiert. Der Fernseher hat diesen Aufruf empfangen und teilt dem Smartphone die Verbindungseinstellungen mit. Dies fangt darauf hin mit der Ubertragung der Daten an, welche hier durch die durchgezogene Linien reprasentiert wird.

Der Bewohner hat nun der Kommunikation zugestimmt und mochte Audioinhalte aus der Wohnung zum Smartphone ubertragen. Dazu fragt das Mikroton nun die Verbindungseinstellungen des Smartphones ab. Nach erhalt der Einstellung ubertragt dies die Audioinhalte aus der Wohnung zur Turklingel und eine Kommunikation zwischen Bewohner und Besucher kann stattfinden.

#### 4.1.2 Abgrenzungen

In Abbildung 4.1 ist der grundsatzliche Systemaufbau abgebildet. Nun ist zu klaren, welches Architekturmodell fur das System am geeigneten ist. Hierfur werden die Vor- und Nachteile der verschiedenen Modelle analysiert und gegeneinander abgewogen.

In einer dienstorientierten Architektur, werden Funktionalitaten durch Dienste reprasentiert. Diese befinden sich nicht zentralisiert auf einem Server, wie beim Client-Server Modell, sondern dezentralisiert auf den einzelnen Komponenten des Systems. Hierdurch konnen Funktionalitaten durch den Austausch, das Hinzufugen oder Entfernen von Komponenten, erweitert oder dezimiert werden. Zusatzlich kann hier eine Diensteredundanz erzeugt werden, da mehrere Gerate die selben Dienste zur Verfugung stellen konnen. Des Weiteren entsteht durch die Dezentralisierung kein,,single point of failure", wie dies in zentralisierten Architekturen der Fall ist.

[MISSING_PAGE_EMPTY:43]

einer asynchrone Nachricht angefragt. Reagiert eine Komponente auf diese Nachricht, wird eine Verbindung aufgebaut. Auf die Art entsteht eine lose Kopplung. Dies bietet den Vorteil, dass sich die im System vorhandenen Gerate nicht kennen mussen um ihre Dienste miteinander zu kombinieren. Des Weiteren kommt das Modell auch im Living Place zum Einsatz. Durch die Anwendung dieses Modells kann das hier zu realisierende System nahtlos in die Umgebung integriert werden.

Der Nachteil dieses Modells stellt die Kommunikation uber die Middleware dar. Fallt diese aus, konnen die Komponenten keine Anfragen mehr an andere schicken. Um einen Ausfall entgegenzuwirken, muss fur entsprechende Redundanzen gesorgt werden.

#### Komponentenarchitektur

Die Umgebung unterteilt sich in mehrere Komponenten, die den Anwendern den Umgang mit dem System ermoglichen. Der Austausch von Nachrichten zwischen den Geraten wird durch eine Middleware verwaltet. Die Anwendungskomponenten basieren auf dem Model-View-Controller Muster, somit kann die Logik Betriebssystemubergreifend verwendet werden.

#### Model-View-Controller

Das Model-View-Controller Konzept, kurz MVC, wurde 1979 entwickelt (Reenskaug (1979)). Ziel des Musters ist es, eine interaktive Anwendung in drei Komponenten zu unterteilen. Das Model beinhaltet die Kernfunktionalitaten, die View stellt die Anzeige fur den Anwender dar und der Controller ist fur die Verarbeitung der Benutzereingaben zustandig. Detailiertere Informationen sind in den folgenden Werken zu finden (Buschmann u. a. (2000), Dustdar u. a. (2003)).

Durch die strickte Trennung von Model und View wird es ermoglicht, das Modell der Turklingel ohne grosse Veranderungen auf die Gegenstelle zu portieren. Hier sind dann lediglich noch Anpassungen der GUI von Noten. Der grundsatzliche Aufbau wird in der folgenden Abbildung 4.6 1 dargestellt.

Footnote 1: E s besteht die Möglichkeit einer Erweiterung mittels Observer-Pattern (Buschmann u. a. (2000))

#### Model

Das Model reprasentiert die Daten und die Kernfunktionalitaten der Anwendung. Es werden Schnittstellen fur die Steuerungskomponente und der Ansicht zur Verfugung gestellt. Das Model ist unabhangig von den weiteren Komponenten des MVC* [14] M. C. Collins, "A new method for combining NLO QCD with shower Monte Carlo algorithms", _Phys. Rev. D_ **68** (2003) 094004, doi:10.1103/PhysRevD.68.094004, arXiv:hep-ph/0309146.

[MISSING_PAGE_POST]

Das Model ubernimmt die Bearbeitung der Daten und beinhaltet die Programmlogik. Das bedeutet, die Komponente ist fur das Senden und Empfangen asynchroner Nachrichten zustandig, wie sie auftreten, wenn Audio- und Videodaten versendet oder empfangen werden mussen. Die Signalisierung eines klingenden Besuchers und das Empfangen von Einstellungen. Auch das Senden und Empfangen von Daten und dessen Verarbeitung gehort zu den Aufgaben des Models. Daraus ergeben sich diverse Schnittstellen, die der Prasentation und der Steuerung zur Verfugung gestellt werden mussen. Hat ein Verbindungsaufbau zwischen einer Gegenstelle und der Klingel stattgefunden, empfangt die Klingel permanent Daten. Nach dem Empfang der Daten werden diese der Prasentationsebene bereitgestellt. Uber eine entsprechende Schnittstelle kann nun auf diese Daten zugegriffen und der Person vor der Tur prasentiert werden.

Andersherum verhalt es sich bei einer Interaktion die, von dem Besucher ausgeht. Mochte eine Person vor der Tur dem Bewohner eine Nachricht hinterlassen, weil dieser gerade nicht zur Verfugung steht, muss die Steuerung die entsprechende Interaktion interpretieren. In Folge dessen wird die Nachrichtenaufzeichnung uber eine Schnittstelle zum Model veranlasst. Das Model initialisiert dementsprechend die erforderliche Hardware wie Kamera und Mikrofon und startet die Aufnahme.

Da diese Nachrichten personliche und vertrauliche Daten enthalten konnen, spielt dessen Persistenz und Zugriffsschutz eine wichtige Rolle. Zur Gewahrleistung der Persistenz ware es sinnvoll, die Nachrichten nach ihrer Aufzeichnung auf einem im Netzwerk vorhandenen Speicher abzulegen und diesen durch Berechtigungen zu schutzen. Damit kann sichergestellt werden, dass keine unberechtigte Person Zugriff auf die Daten erhalt. Diese Aspekte werden hier nicht weiter betrachtet, da der Fokus der Arbeit auf der Interaktion mit einer Gegensprechanlage liegt.

#### View

Die View prasentiert dem Anwender die Informationen des Models. Da fur tuf die View die entsprechenden Daten uber die Schnittstellen ab und zeigt diese an. Zu jeder Ansicht gehort eine Steuerungskomponente, welche die Eingabe des Anwenders entgegennimmt und interpretiert.

Die View oder auch Prasentation, bildet nicht nur die Schnittstelle zur Programmftktionalitat ab, sondern sie bildet auch die Schnittstelle zwischen dem Anwender und dem System. Um dem Anwender den Umgang mit dem System zu erleichtern wird eine intuitive Bedingung benötigt. Hierzu gehort beispielsweise, dass nur Funktionalitaten angeboten werden, die derzeit auch durchfuhrbar sind. Ein Beispiel hierfur ist, dem Besucher nur dann das Klingeln zu ermgglichen, wenn der Bewohner zu Hause ist.

[MISSING_PAGE_EMPTY:47]

#### Synchrone Kommunikation

Das System besteht aus unterschiedlichen Kommunikationswegen. Die Synchrone Kommunikation ist hierbei eine Abbild der menschlichen Kommunikation, die auf dem Request-Response Prinzip basiert. Ein Kommunikationspartner stellt dem Anderen eine Anfrage (Request) und wartet daraufhin solange, bis eine Antwort (Response) von diesem zuruck kommt. Eine direkte Kommunikation zwischen Gesprachspartnern ist also stets synchron.

Eine synchrone Kommunikation findet zwischen dem Datenubertragungsfdienst der Turklingel und dem Client statt, sobald die Funktionalitat der audiovisuellen Kommunikation in Anspruch genommen wird. Nachdem der Bewohner durch einer Interaktion an einem Gerat in der Wohnung signalisiert hat, dass er mit der Person vor der Tur in Verbindung treten mochte, wird die Verbindung zur Turklingel hergestellt. Anschlie8end werden Audio- und Videodaten zwischen dem Client und der Turklingel ausgetauscht.

Die hier entstehende Kommunikation ist einer naturlichen Mensch zu Mensch Kommunikation on nachempfunden. Die Basis dieser Kommunikation bilden nicht nur Worter. Gestik, Mimik, Tonfall, Behruhrungen und die Beziehung der Menschen zueinander spielen ebenso eine Rolle ((Dahm, 2005), (Watzlawick, 2007)). Die Ubertragung dieser Faktoren, kann durch die audiovisuelle Ubermittlung der Daten synthetisiert werden.

#### Asynchronous Kommunikation

Eine asynchrone Form der Kommunikation zwischen Menschen entsteht, wenn diese zu unterschiedlichen Zeitpunkten stattfindet. Um diese Art der Kommunikation zu realisieren, bedienen sich Menschen seit jeher technischer Hilfsmittel, wie Briefe oder Anrufbeantworter. Im Gegensatz zum Request-Response Prinzip der synchronen Kommunikation wartet der Kommunikationstellehmer hier nicht auf eine Antwort, sondern nutzt die Zeit bis zum Eintreffen der Antwort zum erledigen anderer Aufgaben. Gerade im technischen Bereich bietet das einige Vorteile hinsichtlich der Parallelisierbarkeit und Entkopplung der Komponenten (Dunkel u. a. (2008)).

Alle Interaktionen zwischen den Geraten und der Turklingel, aufser der Direkten zwischen Bewohner und Besucher, konnen uber asynchrone Nachrichten abgehandelt werden. Dazu werden uber das Publisher-Subscriber Prinzip Nachrichten ausgetauscht. Clientseitig kann das zum einen das Abfragen und Senden von Einstellungen sein, zum anderen das Abholen hinterlassener Nachrichten. Dafur muss in der Umgebung ein Dienst zur Verfugung stehen, der diese Meldungen empfangen und weiterleiten kann.

Damit jedes Gerat dieses Systems die Nachrichten auch erkennen und verarbeiten kann, mussen konkrete Nachrichten und dessen Format definiert werden. Hierfur eignet sich das

[MISSING_PAGE_EMPTY:49]

* Not Available: {"ID":"DoorBell","Content":"not Available"} Mochte der Bewohner zur Zeit nicht gestort werden, wird durch diese Nachricht auf der Klingel eine Interaktion gestartet. Hierbei wird dem Besucher mitgeteilt, dass momentan niemand zur Verfugung steht.
* Set Settings: {"ID":"DoorBell","Content":"Preference", "key":..., "value":... } Bei dieser Nachricht werden der Klingel Einstellungen ubermittelt. Hierbei kann es sich um eine oder mehrere Einstellungen handeln. Vorrausssetzung hierfur ist, dass der "Key" dem System bekannt ist, ansonsten wird die Einstellung abgelehnt. Gesendet werden diese Einstellungen von einer Gegenstelle, wenn der Anwender Anderungen an den Einstellungen vornimmt. Andere Systeme der Umgebung, wie die Kontexterkennung beispielsweise, haben auch die Moglichkeit, Einstellungen an die Turklingel zu ubermitteln.
* Load Messages: {"ID":"DoorBell","Content":"available Messages", "IP":...", "Port":...} Sollten Nachrichten auf der Klingel hinterlassen worden sein, konnen sie mit Hilfe dieser Nachricht abgerufen werden. Der Turklingel wird anhand der IP und des Ports mitgeteilt, wohin die Nachrichten transferiert werden sollen.

Nachrichten zwischen Gegenstellen:

* Client react: { "ID":"DoorBell","Content":"Client react"} Hiermit wird den Gegenstellen signalisiert, dass der Bewohner das Klingeln an einem Gerat des Systems entgegen genommen hat. Somit konnen sie wieder in ihren Ausgangszustand zuruck kehren.

### Definierte Keys

Um Einstellungen vornehmen oder auslesen zu konnen, mussen Keys definiert werden. Anhand dieser Keys wird es dem System moglich, die ubertragenen Werte der entsprechenden Einstellung zuzuordnen. Fur die Gewahrleistung der Funktionalitaten mussen diverse Keys definiert werden, wie beispielsweise fur die Zuordnung von Ports und IPs. Eine Auflistung aller vom System verwenden Keys wurde hier allerdings zu weit fuhren, daher werden in der folgenden Tabelle 4.1 nur einige exemplarisch dargestellt.

### 4.3 Dienste

Fur die Erzeugung der Funktionalitaten des Systems werden verschiedene Dienste benotigt. Essentiell sind hier Dienste zur Audio- und Videoubertragung. Der in diesen Beispielen gern genannte Kuhlschrank mit Display kann beispielsweise einen Dienst zur Videowiedergabebereitstellen. Ein Fernseher stellt hingegen Dienste fur Audio- und Videowiedergabe zur Verfugung. Zusatzlich werden Gerate benotigt, die Dienste fur die Aufnahme von Audio- und Videowiedergabe der Person und dessen Berechtigungen. Dafur arbeitet dieser eng mit dem Authentifizierungsdienst zusammen. Da dieser Dienst ohne den Kontaktdienst nicht funktionsfahig ist, ist es sinnvoll ihn in den Kontaktdienst zu integrieren. Hierdurch wird zusatzlich die Komplexitat des Systems verringert.

Die an der Klingel aufgenommenen Daten werden also an den Kontaktdienst weitergeleitet, der diese dann durch die Authentifizierungsfunktionalitat verifiziert. Die entsprechende Berechtigungen werden anschliessend an die Tur zuruckgegeben. Hierbei kann es sich zum Beispiel um eine Berechtigung zum Offnen der Tur handeln.

Des Weiteren wird ein Ortungsdienst benotigt, der dem System die aktuelle Position des Bewohners mitteilen kann. Die Vorteile einer solchen Funktion liegen zum einen darin, dem Bewohner durch ein in der Nahe befindliches Gerat zu informieren. Zum anderen kann er sich wahrend der Kommunikation mit dem Besucher frei in der Wohnung bewegen. Bewegt sich der Bewohner von dem aktuellen Gerat weg und kommt in die Nahe eines neuen Gerates, welches die erforderlichen Dienste zur Verfugung stellt, konnen diese in Anspruch genommen werden.

Eine weitere Funktionalitat der Turklingel soll das Hinterlassen von Nachrichten darstellen. Durch die Positionierung der Klingel aufBerhalb des Wohnbereichs wird ein Angriffspunkt in das System erzeugt. Aus diesem Grund muss ein Dienst zur Verfugung stehen, der die generierten Daten auf einen Netzwerkspeicher transferiert, damit bei einem eventuellen Diebstahl keine Daten verloren gehen oder in falsche Hande gelangen.

Die in einer Wohnung zusatzlich installierten Sensoren und Aktoren bieten dem Systemweiter Dienste an, womit der Funktionsumfang erweitert wird. Hierbei werden Informationen uber die Position und den aktuellen Zustand des Bewohners gesammelt sowie Daten zur aktuellen Helligkeit des Tageslichtes, Uhrzeit oder Temperatur. Des Weiteren stehen dem System Aktoren zur Ansteuerung des Turschlosses oder der Lichtanlage zur Verfugung. Diese Ansammlung von Sensoren und Aktoren beschreibt Voskuhl als Sensonwolke (Voskuhl (2009)).

Ziel soll die nahtlose Integration in ein bestehendes System sein. Durch die Integration in das System und der bestehenden Dienstvielfalt entstehen Synergieeffekte, die dem Bewohner ein hohes Maß an Funktionsvielfalt generieren und ihn bei den alltaglichen Aufgaben unterstutzen.

Gegenstand dieser Arbeit ist es, die Realisierbarkeit der Szenarien anhand der Implementierung einer Gegensprechanlage zu evaluieren. Fur diese Funktionalitat werden einige Dienst te wie zum Beispiel der Authentifizierungsdienst, Ortungsdienst und die Inanspruchnahme von Sensordaten und Aktoren nicht benotigt und sind daher nicht Bestandteil dieser Arbeit. Dienste zur Audio- und Videoubertragung hingegen sind essentiell fur eine Gegensprech-anlage und mussen somit in die Architektur mit einbezogen werden. Im Hinblick auf die zukunftige Weiterentwicklung ist aber auch darauf zu achten, das System moglichst often zu gestalten, um die oben genannten Dienste in Anspruch nehmen zu konnen.

### Exklusive Zugriffe

Bei einer Architektur, die auf der Inanspruchnahme unterschiedlicher Dienste von unterschiedlichen Geraten beruht, ist die Zugriffscharakteristika zu betrachten. Hierbei ist zu beachten, dass einige Dienste von mehreren gleichzeitig in Anspruch genommen werden konnen, wahrend andere ihren Dienst nur fur einen einzigen zur Verfugung stellen konnen. Als Beispiel konnen hier zwei Dienste herangezogen werden. Auf der einen Seite der Dienst zur Audioaufnahme. Dieser kann seine aufgenommenen Audiodaten mehreren Interessenten im Netzwerk gleichzeitig zur Verfugung stellen. Auf der anderen Seiten haben wir den Dienst der Audiowiedergabe, der beispielsweise durch einen Fernseher zur Verfugung gestellt wird. Dieser kann nur durch einen Interessenten zur Zeit genutzt werden, da sich bei der Wiedergabe mehrerer Audioquellen diese uberlagern und sie der Anwender nicht mehr versteht. Daher muss dem System bekannt sein, welche Dienste zur Zeit aktiv sind und nur exklusiv von einem Interessenten genutzt werden konnen.

Bei dem Start einer Interaktion muss das System wissen, welches dieser Gerate zum aktuellen Zeitpunkt seine Dienste, zum Beispiel das Anzeigen des Live-Videos, zur Verfugung stellen kann. Dafur mussen die einzelnen Komponenten dem System mitteilen, dass sie zur Zeit eine Aufgabe bearbeiten und deshalb nicht zur Verfugung stehen. Denkbar ware bei dieser Umsetzung auch, dass die Komponenten nicht nur bekannt geben, dass sie eine Aufgabebearbeiten, sondern auch welche das ist. Somit wird dem System die Moglichkeit gegeben, zu entscheiden ob eine gerade ausgefuhrte Aufgabe auch unterbrochen und zu einem spaeteren Zeitpunkt fortgesetzt werden kann. Als Beispiel einer unterbrechbaren Aufgabe kann das Zeigen eines Spielfilmes auf dem Fernseher herangezogen werden. Im Fall eines Klingelns wird dies auf dem Fernseher visualisiert. Mochte der Bewohner mit der Person vor der Tur sprechen, pausiert die Wiedergabe des Films. Wahrend der Konversation wird dieser dann im Hintergrund aufgezeichnet und kann somit zu einem spateren Zeitpunkt wieder abgespielt werden. Falls in der Wohnung nicht so viele Komponenten zur Verfugung stehen, die zur Darstellung der Klingelsignalisierung geeignet sind, ermoglicht diese Erweiterung die Visualisierung des Klingelns, obwohl alle Komponenten eine Aufgabe bearbeiten.

### 4.4 Fazit

Hinsichtlich der gewahlten Architektur und der identifizierten Dienste zeichnen sich erforderliche Komponenten und ihre Kommunikation untereinander ab. Das dargestellte Komponentadiagramm 4.7 stellt diese dar.

Das Diagramm stellt die benstigen Komponenten fur eine Einfamilienhaus dar, in dem nur eine Turklingel Verwendung findet. Denbar ware aber auch eine Realisierung in einem Mehrfamilienhaus durch eine Anpassung der Komponenten. Hierbei wurde das Diagramm um mehrere Turklingeln, Ortungsdienste und Kontaktdienste erweitert. Durch das vorher definierte Nachrichtenformat und dessen Inhalt kann das System ohne Probleme erweitert werden. Eine Anpassung des gewahlten Designs ist nicht erforderlich.

Die Komponenten, Turklingel und Gegenstellen, bilden die Benutzerschnittstellen ab. Bei bestimmten Geraten wie beispielsweise einem Fernseher beinhaltet dies nicht nur die dargestellte Komponente einer Gegenstelle, sondern auch einen audiovisuellen Dienst. Audio-visuelle Dienste stellen in der Wohnung eingebaute Kameras und Mikrofone dar. Durch den Kontaktdienst werden personenbezogene Daten gespeichert und fur die Turklingel und die Gegenstellen bereitgestellt. Zusatzlich beinhaltet dieser einen Authentifizierungstunktionalitat.

Das folgende Sequenzdiagramm 4.8 zeigt einen Verbindungsaufbau sowie dessen Abbau. Hieran soll nochmals die Kommunikation der Komponenten untereinander verdeutlicht werden.

Der Verbindungsaufbau wird durch das Klingeln eines Besucher in Gang gesetzt. Da die Turklingel durch den Ortungsdienst standig mitgeteilt bekommt, wo sich der Bewohner zur Zeit aufhalt, kann diese Information in die asynchrone Dienstanfrage eingebaut werden. Eine Gegenstelle, die sich in der Nahe des Bewohners befindet, signalisiert diesem das Klingeln anhand einer Visualisierung. Daraufhin nimmt der Bewohner die Kommunikation an und die 

[MISSING_PAGE_EMPTY:54]

[MISSING_PAGE_EMPTY:55]

[MISSING_PAGE_EMPTY:56]

## Chapter 5 Realisierung

Das im Jahr 2009 eingerichtet Living Place (2.3) an der Hochschule fur Angewandte Wissenschaften in Hamburg stellt eine Umgebung zur Verfugung, in der Studenten den Bereich des Ubiquitous Computing erforschen konnen. Hierdurch werden Anwendungen entwickelt, die dem Menschen den Alltag erleichtern sollen, ganz nach den Visionen von Mark Weiser (Weiser (1991)). Dazu gehort auch das hier vorgestellte System.

Auf der Basis des im vorherigen Kapitel entwickelten Designs steht nun die Realisierung und Implementierung einer auf der Android(tm)- basierten Turklingel mit der Funktionalitat einer Gegensprechanlage im Fokus. Grundlage hierfur ist die Verwendung des Android(tm)-Betriebssystems in der Version 2.3 fur den Betrieb auf einer Handyplattform und 3.0 fur die Tabletversion.

### 5.1 Technische Umsetzung

Um eine Gegensprechanlage zu realisieren werden verschiedenste Funktionalitaten benotigt. Dazu zahlen die Moglichkeit Ton und Bilder aufzuzeichnen und diese auch wiedergeben zu konnen. Dafur muss die entsprechende Hardware, also Kamera, Mikrofon, Display und Lautsprecher in einem Gerat vorhanden sein.

#### Turklingel

Sichtung geeigneter Gerate

Aufgrund des ausgewahlten Betriebssystems ergibt sich die Moglichkeit aus einer breiten Palette von Geraten unterschiedlichster Hersteller das geeignetste Gerat auszuwahlen. Hatte man zum Beispiel das Betriebssystem der Firma Apple als Implementierungsfurndlage herangezogen, ware die Auswahl auf ein einziges Modell beschrankt.

Nach einigen Recherchen kristallisierte sich das von Samsung produzierte Nexus S (Abbildung: 5.1) heraus. Auf diesem Smartphone befindet sich noch die Urform des Android(tm)-Systems, ohne das Anpassungen seitens des Herstellers vorgenommen wurden. Dadurchergibt sich ein schneller Zugriff auf Updates. Bei Geraten anderer Hersteller werden die Updates erst geprutt, bevor diese fur den Kunden freiggegeben werden, um sicherzustellen, dass die durch den Hersteller vorgenommen Anderungen noch kompatibel zum aktuellen System sind.

Nach der Markteinfuhrung des Motorola Xoom (Abbildung: 5.1) wurde das System auf den Tablet-PC mit der Android(tm) Version 3.0 portiert. Das Motorola Xoom bieten gegenuber einer Smartphone-basierenden Gegensprechanlage mehr Rechenleistung und ein wesentlich grosses Touchdisplay. Durch diese Attribute konnen dem Anwender die Interaktionsmoglichkeiten besser prasentiert werden.

### Sichtung geeigneter Funktionen in Android(tm)

Die API von Android(tm)ermoglicht das Aufzeichnen von Inhalten auf verschiedenste Arten. Es konnen komplete Videos oder Bildinhalte von Audioinhalten getrennt aufgezeichnet werden.

Fur ersteres wird der MediaRecoder verwendet. Dieser ermoglicht das Aufzeichnen vonVideos in verschiedenen Formaten und Qualitatsstufen. Fur die Realisierung einer Gegensprechanlage benotigt man die Fahigkeit, die aufgezeichneten Daten per Live Stream verschicken zu konnen. Dies ist mit dem MediaRecoder allerdings nicht moglich, da dieser zur Aufzeichnung eines Videos einen festen Speicherplatz voraussetzt. Daraus resultiert eine Zwischenspeicherung der Daten, um diese dann zu verschicken. Durch die Implementierung eines Erzeuger-Verbraucher Konzeptes ware es denkbar, dieses Problem zu umgehen. Hieraus ergeben sich aber weitere Nachteile, wie eine Verzogerung der Ubertragung, da ein Thread erstmals Daten aufnehmen muss, damit diese dann von einem Andersen verschickt werden konnen. Des Weiteren stellt der MediaRecoder keine Funktionalitaten zum Paussieren einer Aufnahme zur Verfugung. Dies wird aber benotigt, um dem Verbraucher-Thread den Zugriff auf die Daten zu ermoglichen. Das bedeutet schlussendlich, man darf nur Videos mit sehr geringer Laufzeit von ca. einer Sekunde aufnehmen. Angenommen eine Kommunikation wurde zwei Minuten in Anspruch nehmen, dann wurde der MediaRecoder in diesem Zeitraum ca. 120 Videos erzeugen. Daraus generiert sich die Problematik, noch eine effiziente Speicherverwaltung entwickeln zu mussen, um die anfallenden Datenmengen verwalten zu konnen. Zusatzlich stellt der MediaRecoder in Android(tm) 2.3 nur die Funktion bereit, Videos mit der Ruckkamera aufzunehmen, welche sich fur den Einsatz in einer Turklingen als unpraktisch erweist.

Eine weitere Moglichkeit bietetet Android(tm) mit dem direkten Zugriff auf die Rohdaten der Kamera. Diese werden in einem Bytearray abgelegt und konnen somit ohne Weiteres uber ein verbindungsloses Datagramm oder eine Socketverbindung an den Kommunikationsparture weitergeleitet werden. Dadurch werden Verzogerungen beim Versenden der Daten vermieden und es wird keine aufwendige Speicherverwaltung benotigt. Da die Daten nicht zwischengespeichert werden mussen. Allerdings muss man sich hier vor Augen halten, dass nur einzelne Bilder und keine Videosequenz ubertragen wird. Das bedeutet, es sind keine Audiodaten vorhanden. Diese mussen gesondert aufgezeichnet und ubermittelt werden. AufBordem ist das ubertragene Datenvolumen um einiges hoher, da die Daten nicht, wie bei der Ubertragung eines Videos, vom Codec komprimiert werden konnen. Fur den Einsatz in einem lokalen Netzwerk spielt dies aber eher eine untergeordnete Rolle.

#### Gegenstellen

Damit das System funktioniert, werden noch Gegenstellen benotigt, mit der die Turklingel interagieren kann. Zur Zeit der Realisierung bot kein Hersteller ein Gerat an, welches die Vorraussetzungen fur eine Gegenstelle erfullte. Einige Hersteller von Fernsehgeraten (Samsung (2008)) bieten zwar die Moglichkeit, Multimediadaten von Geraten abzuspielen. Um aber als Gegenstelle zu fungieren, musste der Fernseher auch aktiv Daten empfangen konnen. Dies ist mit den vorhandenen Geraten zur Zeit noch nicht realisierbar. Daher wurde eine entsprechende Client-Applikation geschrieben, um das System zu testen.

Die Implementierung der Client-Applikation erfolgte in der Programmiersprache Java, da dies mehrere Vorteile mit sich brachte. Zum einen unterliegt diese Anwendungen ahnlichen Ablaufen wie die Turklingel. In Folge dessen konnten grosse Teile der Programmlogik aus der Turklingel wiederverwendet werden. Durch die Strukturierung nach dem Modell des MVC-Patterns, wie im Design Kapitel 4.1.4 beschrieben, konnte die Logik ohne nennenswerten Aufwand extrahiert werden. Zum anderen werden innerhalb der Wohnung zwei Betriebssysteme verwendet, wobei es sich um Windows 7 und Mac OSX handelt. Durch die Verwendung der Sprache Java kann ein und die selbe Applikation auf beiden Betriebssystemen verwendet werden.

Damit die Software alle erforderlichen Fahigkeiten einer Gegensprechanlage umsetzen kann, wird diese auf einem Mac Mini installiert. Dieser fungiert als Media-PC innerhalb der Wohnung und ist in Folge dessen mit einem Fernseher, der als Anzeigegerat dient, verbunden. Um audiovisuelle Daten zur Turklingel ubertragen zu konnen, wird der Mac Mini zusatzlich noch mit einer Webcam und einem Mikrofen ausgestattet.

Daruber hinaus wird der Rechner noch mit Bibliotheken ausgestattet, um der Client-Applikation den einfachen Zugriff auf Daten der Webcam und des Mikrofons zu ermoglichen. Unter dem Betriebsystem Mac OSX findet die Open Source Bibliothek Processing Verwendung, wahrend unter Windows 7 OpenCV zum Einsatz kommt, die ebenfalls Open Source ist.

#### 5.1.3 Kommunikation

In den vorigen Abschnitten wurden die unterschiedlichen Gerate vorgestellt, mit denen der Anwender interagiert. Im diesem Abschnitt werden nun die Arten der Kommunikation zwischen der Turklingel und den Gegenstellen erlautert. Hierbei handelt es sich zum einen um eine synchrone Form der Kommunikation (5.1.3), zum anderen um eine asynchrone Form (5.1.3).

Die asynchrone Form wird mittels des ActiveMQ realisiert. Hierbei handelt es sich um ein Open Source3 Message Broker - System von der Apache Software Foundation. Die Vermittlung der Nachrichten kann hier auf zwei Arten geschehen, uber Topics oder Queues. Topics sind hierbei als eine Art verbindungslose Kommunikation zu betrachten, bei der eine Nachricht nicht mehr zur Verfugung steht, sobald der ActiveMQ diese verteilt hat. Bei der Verteilung achtet dieser zusatzlich nicht darauf, ob die Clients die Nachricht wirklich empfangen haben. Im Gegensatz hierzu steht eine Queue. In ihr wird eine Nachricht solange aufbewahrt, bis ein Client diese Nachricht abruft. Dadurch kann eine Nachricht allerdings nur an einen Empfanger gesendet werden, wahrend bei einem Topic die Nachricht an eine Gruppe von Clients weitergeleitet werden kann.

### 0.5 RealisierungAuf einem Android(tm)-Gerat kann dieser aber nicht verwendet werden, da hier nur eine abgespeckte Java Version vorhanden ist, die keine Funktionalitaten von JMS beinhaltet. Daher wurde hier eine Proxy-Applikation
#### (5.1.3) entwickelt, die Nachrichten von Android(tm)-Geraten empfangen soll und diese an den ActiveMQ weiterleitet. Zusatzlich wurde eine Bibliothek (5.1.3) implementiert um auf die Funktionen des Proxys zugreifen zu konnen. Ziel ist es, zukunftigen Entwicklern den Zugriff auf den Proxy und damit auf den ActiveMQ zu erleichtern. Das Empfangen der Nachrichten wird uber einen HTTP-Request abgehandelt. Dafur wird auf dem Android(tm)-Gerat ein Thread gestartet, der die Nachrichten vom ActiveMQ uber den Request abfragt und falls Daten vorhanden sind, diese in eine JSON Objekt umwandelt. Daraufhin wird der Inhalt des Objektes untersucht und weiterverarbeitet.

#### AndroidProxy

Im Rahmen der Realisierung wurde eine Proxy-Applikation entwickelt, um die Kommunikation zwischen einem Android(tm)-Gerat und dem ActiveMQ im Living Place Hamburg zu ermoglichen. Besonders steht hier im Vordergrund, dass es Android(tm)-Geraten nicht moglich ist, Nachrichten an den ActiveMQ zu schicken.

Um dieses Problem zu losen stellt der AndroidProxy eine Socket-Schnittstelle zur Verfugung, an welche die Android(tm)-Gerate ihre Nachricht schicken konnen. Die Software empfangt die Nachrichten, liest wichtige Informationen wie den Topicnamen, an den diese weitergeleitet werden soll, aus und ubermittelt die Daten an den ActiveMQ. Intern wird dazu der LPWrapper verwendet, der speziell fur die Kommunikation im Living Place entwickelt wurde. Diese Software wird nur fur das Senden von Mitteilungen benotigt. Die Proxy-Applikation lauft auf dem selben Server wie der ActiveMQ, dadurch werden zusatzliche Netzwerkschnittstellen und erh ohneter Netzwerkverkehr vermieden. Die folgende Abbildung 5.2 soll die Kommunikation nochmals verdeutlichen.

#### AndroidPublisher

Durch den oben beschriebenen AndroidProxy ist es Android(tm)-Geraten nun moglich, Nachrichten an den ActiveMQ zu ubertragen. Um zukunftigen Entwicklern den Umgang mit dem AndroidProxy zu erleichtern, wurde die Bibliothek AndroidPublisher entwickelt, welche nach dem Prinzip eines Wrappers arbeitet. Dieser verbirgt das Nachrichtenformat und die Verbindungsort vor dem Entwickler. Somit braucht sich dieser hieruber keine Gedanken mehr zu machen.

Die Realisierung der Anwendung wird in diesem Abschnitt auf ihre Funktionalitaten hin evaluiert. Dazu werden die tatsachlichen Anforderungen und Ablaufe bei der Verwendung der Turklingel mit den in den Szenarien geschilderten verglichen.

#### Erfullung der Anwendung der Anwendung

Im dritten Kapitel wurden anhand von Beispielszenarien Anforderungen ermittelt. Hierbei ist zu beachten, dass nicht alle Anforderungen erfullt werden konnten, da nur Grundfunktionaitaten einer Gegensprechanalage implementiert wurden. Im Folgenden werden funktionale und nicht-funktionale Anforderungen auf ihre Umsetzung hin uberprunft.

[MISSING_PAGE_EMPTY:64]

[MISSING_PAGE_EMPTY:65]

Nachdem die Anwendung gestartet wurde, wird der Hauptbildschrim angezeigt, der den Ausgangspunkt jeder Interaktion bildet. Der in Abbildung 5.3 6 gezeigte Startbildschirm, bietet dem Besucher als erstes die Moglichkeit, die Familie auszuwahlen, bei der er klingeln mochte. Dabei kann diese Anzeige flexibel gestaltet werden, je nachdem, in welchem Umfeld, also Ein- oder Mehrfamilienhaus, die Turklingel zum Einsatz kommt.

Wahlt der Besucher eine der angezeigten Familien aus, werden auf der rechten Seite des Bildschirms die in der Wohnung lebenden Personen angezeigt (5.4). Welche Personen hier aufgefuhrt werden, kann der Bewohner frei konfigurieren.

Nachdem der Besucher einen Eintrag aus der Liste ausgewahlt hat, sendet die Turklingel eine Nachricht an den Nachrichtendienst und erfragt somit vorhandene Ressourcen.

Gerate, die sich fur dieses Ereignis beim Nachrichtendienst registriert haben, empfangen diese Nachricht und signalisieren dem Bewohner, dass eine Person geklingelt hat. Dieser kann nun entscheiden, auf welchem Gerat er das Klingeln annimmt.

Hat der Bewohner ein Gerat ausgewahlt, liest die Client-Applikation daraufhin die erforderlichen Verbindungsdaten aus der empfangenen Nachricht aus und baut mit diesen eine Verbindung zur Turklingel auf.

[MISSING_PAGE_EMPTY:67]

Nachdem die Verbindung aufgebaut wurde, werden die von der Turklingel empfangen Daten angezeigt, wie in Abbildung 5.5 dargestellt ist.

Dabei teilt sich die Anzeige in zwei Bereiche auf. Der Hauptbereich zeigt den Besucher, wahrend der zweite Bereich anzeigt, welche Bildaten zur Turklingel gesendet werden. Diese werden in der Anzeige unten rechts eingeblendet.

Nachdem der Bewohner gesehen hat, wer vor der Tur steht, kann dieser entscheiden, ob er das Klingel annehmen mochte und somit ein Gesprach zustande kommt oder ob er dies ablehnt. Wird das Klingeln abgelehnt, sendet die Client-Applikation eine Nachricht an die Turklingel, was zur Folge hat, dass die Verbindung beendet wird. Der Besucher wird daraufhin uber die Abwesenheit des Bewohners benachrichtigt.

Nimmt der Bewohner jedoch das Klingeln an, werden die aus der Wohnung aufgezeichneten Inhalte auf der Turklingel angezeigt, wie in Abbildung 5.6 zu sehen ist.

Daraufhin konnen Bewohner und Besucher miteinander kommunizieren. Beendet eine der beiden Parteien die Kommunikation, versendet der Initiator eine Nachricht, um dies der anderen Komponente bekannt zu machen. Anschließend versetzen sich beide Applikationen wieder in ihren Ausgangspunkt und warten auf eine neue Interaktion.

#### Erkenntnisse aus der Evaluation

Die Evaluierung hat gezeigt, dass die Erstellung einer Gegensprechanlage machar ist. Dies wird aus den umgesetzten Anforderungen und der Arbeitsweise des Prototypen deutlich. Des Weiteren hat sich gezeigt, dass die im Design beschriebene Architektur umgesetzt werden konnte. Durch den Einsatz des MVC-Entwurfsmusters wir es zusatzlich ermoglicht, weitere Interaktionen in das System zu integrieren.

Die Problemfelder, die sich bei der Erstellung des Systems ergaben, konnten zufriedenstellend gelost werden. Hier sind insbesondere die Live-Ubertragung von Videoinhalten (5.1.1) und die Kommunikation mit dem ActiveMQ (5.1.3) zu nennen.

Auf dieser Grundlage konnen nun weitere Entwicklungen stattfinden, in denen weitere Interaktionsmoglichkeiten erforscht und die Funktionalitaten ausgebaut werden konnen. Diese kann beispielsweise durch das Einbinden eines Ortungsdienstes oder die Implementierung eines Kontaktdienstes geschehen.

Ebenfalls zeigte die Evaluation, dass die bisherige Realisierung nur einen kleinen Teil der Funktionalitaten bereitstellt. Es fehlen noch die Ansteuerungsmoglichkeiten fur Hardware, um beispielsweise dem System das Offnen der Tur zu ermoglich sowie die Kontextsensitivitat. Erst durch diese Punkte stellt das System fur den Anwender einen Mehrwert der.

Ebenfalls hat die Evaluation gezeigt, dass dies System schon in heutigen Wohnungsumgebungen zum Einsatz kommen kann. Im Gegensatz zu Smart Home Umgebungen hat die Turklingel allerdings keinen Zugriff auf gewisse Dienste, wie beispielsweise einen Ortungsdienst. Daher kann die Turklingel hier nicht alle Funktionalitaten zu Verfugung stellen.

## Chapter 6 Schluss

### 6.1 Zusammenfassung

Im Rahmen dieser Arbeit sollten Interaktionsmoglichkeiten und dessen Realisierung untersucht werden. Basis hierfur bildete das mobile Betriebssystem Android(tm). Die Wahl fiel auf dieses mobile System, da dieses im Gegensatz zu den anderen Betriebsystemen einige Vorteile besitzt. Dazu gehoren unter anderem die grosse Geratevielfalt und die Open Source Plattform.

Im Verlauf der Arbeit stellte sich jedoch heraus, dass Android(tm) nicht alle Funktionalitaten zu Verfugung stellt, die fur die Realisierung benotigt wurden. Aus diesem Grund wurde externe Bibliotheken eingebunden und einige Funktionen zusatzlich implementiert.

Am Anfang dieser Arbeit wurden drei Szenarien (3.1) analysiert, durch die verschiedene Mensch-Maschinen-Interaktionen identifiziert werden konnten. Das Spektrum dieser Szenarien reicht hier von einfachen Funktionalitaten, die auch durch konventionelle Gegensprechtanlagen abgebildet werden, bis hin zu wesentliche komplexeren Funktionen. Aus dieses Szenarien gingen verschiedene funktionale und nicht-funktionale Anforderungen hervor, die das System spater abbilden sollte.

Nachdem die verschiedenen Anforderungen und Eigenschaften an das System ermittelt wurden, musste eine passende Architektur gefunden werden. Um dies zu erreichen, wurden zuerst verschieden Architekturmuster (4.1.1) miteinander verglichen. Hierfur wurden die Vorund Nachteile der verschiedenen Architekturen im Hinblick auf das zu realisierende System bewertet (4.1.2). Dabei kristallisierte sich die Event-Driven Architektur heraus.

Nach der Wahl der Systemarchitektur wurde eine Komponentenarchitektur konzipiert, die sich auf das Prinzip des MCV Patterns stutzt. Da die Komponenten auf unterschiedlichen Geraten realisiert werden sollten, konnte hiermit eine einfache Portierung sichergestellt werden. Zusatzlich wurde die Kommunikation der Komponenten untereinander untersucht und ein festes Nachrichtenformat wurde definiert.

Auf Basis der getroffenen Designentscheidungen wurde das System umgesetzt. Um das System spater auch testen zu konnen, wurde nicht nur die Turklingel (5.1.1) implementiert, sondern auch eine Client-Applikation, die als Gegenstelle (5.1.2) fungiert. Dabei wurden einige Grundfunktionalitaten implementiert, die fur die Verwendung einer GegensprechanlageVorraussetzung sind. Einige Funktionalitaten, die hierfur benotigt wurden, waren bereits in Android(tm) vorhanden. Andere wurden durch externe Bibliotheken hinzugefugt oder zusatzlich implementiert.

Aus den Erfahrungen, die in der Evaluation gesammelt wurden, ergaben sich einige Erkenntnisse, die der Weiterentwicklung des Systems dienen konnen. Diese werden im folgenden Ausblick aufgefuhrt.

### 6.2 Ausblick

Die Arbeit hat gezeigt, dass eine intelligente Turklingel ein hohes Potential besitzt. Aber auch, dass eine gewisse Infrastruktur in einer Wohnung vorhanden sein muss, um die Funktionalitaten nutzbar zu machen. Bis Wohnungen so eine Infrastruktur besitzen, wird es allerdings noch einige Zeit dauern. Bis dahin ware die Realisierung eine abgespeckten Version aber durchaus denkbar.

Essentiell fur die Akzeptanz des Systems wird die Sicherheit sein. Das Hauptaugenmerk liegt hier vor allem in der Authentifizierung von Personen. Einige Moglichkeiten hierfur wurden ein dem Szenario "Benutzerauthentifizierung" (3.1.2) geschildert. Um die Sicherheit fur die Zukunft zu erhohen, ware es denkbar, Personen durch das Erstellen und den Austausch elektronischer Zertifikate zu verifizieren. Aber auch der neue elektronische Personalausweis (Bundesministerium) mit seiner Ausweisfunktionalitat konnte in Zukunft fur die Verifizierung von Personen verwendet werden.

Ein weiterer essentieller Punkt stellen zukunftige Bedienkonzepte dar. Gerade im Smart Home Bereich sind aktuelle Konzepte, basierend auf einer Tastatur- und Maussteuerung, eher ungeeignet. Hier wurde der Einsatz einer Sprachsteuerung oder einer Gestenerkennung eine wesentlich intuitivere Bedienung ermoglichen. Denkbar ist hier auch eine Kombination dieser beiden Techniken.

Ob Android(tm)-Geraten der Einzug ins Heim und Haus gelingen wird oder nicht wird die Zeit zeigen. Einiges spricht allerdings dafur. Zum einen werden die Gerate in Zukunft immer leistungsfahiger, kleiner und kostengunstiger. Zum anderen werden durch das Projekt Android(r)Home, das auf der Developer Conference Google l/O 2011 (Google (2011c)) vorgestellt wurde, einige neue APIs entstehen. Hierdurch wird es Entwicklern erleichtert, spezielle Anwendungen fur Smart Home Umgebungen zu konzipieren und zu implementieren. Zusatzlich werden im Laufe der Zeit Komponenten auf den Markt kommen, die sich uber Android(tm)-Gerate steuern lassen, wobei hier schon ein Anfang durch die Leuchtmittel der Firma Lighting Science gemacht wurde.

Inwiefern aus diesen Vorraussetzungen nutzliche Funktionen entstehen, die dem Anwender einen Mehrwert bringen, bleibt abzuwarten. Des Weiteren wird sich zeigen, wie Aspekte derSicherheit, Schutz der Privatsphare und Stabilitat der Systeme mit in die Entwicklung einfliessen. Mit diesen Fragestellungen werden sich mit Sicherheit in der nahen Zukunft weitere wissenschaftliche Arbeiten beschaftigen.

### References

* URL http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.147.553&rep=rep1&type=pdf.
- abgerufen am 07.07.2011
* URL http://www.aal-deutschland.de/.
- abgerufen am 21.07.2011
* URL http://domino.watson.ibm.com/comm/wwwr_thinkresearch.nsf/pages/bergman398.html.
- abgerufen am 06.07.2011

- URL http://www.personalausweisportal.de/DE/Der_Neue_Ausweis/der-neue-ausweis_node.html.
- abgerufen am 10.07.2011
* Ein Pattern-System._ 1. korr. Nachdruck. Addison Wesley Verlag, 2000.
- URL http://amazon.com/o/ASIN/3827312825/.
- ISBN 9783827312822
* 368 S.
- URL http://amazon.com/o/ASIN/3827371759/.
- ISBN 9783827371751
* URL http://dx.doi.org/10.1007/s007790170019.
- ISSN 1617-4909
* URL http://amazon.com/o/ASIN/3446413219/.
- ISBN 9783446413214
- URL http://amazon.com/o/ASIN/3540430881/.
- ISBN 9783540430889
* URL http://users.informatik.haw-hamburg.de/~ubicomp/projekte/master10-11-seminar/ellenberg/bericht.pdf.
- abgerufen am 26.07.2011
* URL http://source.android.com/compatibility/index.html.-abgerufen am 08.07.2011
* URL http://source.android.com/source/licenses.html.-abgerufen am 07.07.2011
* Developer Conference_. 2011.
- URL http://www.google.com/events/io/2011/index-live.html.-abgerufen am 11.07.2011
* URL http://source.android.com/about/philosophy.html.-abgerufen am 07.07.2011
* URL http://amazon.com/o/ASIN/1420093606/.-ISBN 9781420093605
* URL http://amazon.com/o/ASIN/0470565527/.-ISBN 9780470565520
* URL http://users.informatik.haw-hamburg.de/~ubicomp/projekte/master10-11-proj2/otto-voskuhl.pdf.
- abgerufen am 26.07.2011
* [Rahimi und Vogt 2008]Rahimi, Mohammadali ; Vogt, Matthias: _Gestenbasierte Computerinteraktion auf Basis von Multitouch-Technologie_, Hochschule fur Angewandte Wissenschaften Hamburg, Bachelorarbeit, 2008
* URL http://users.informatik.haw-hamburg.de/~ubicomp/projekte/master09-10-proj/rahimi-vogt.pdf.
- abgerufen am 09.06.2011

- CONTROLLERS_. Dezember 1979.
- URL http://heim.ifi.uio.no/~trygver/1979/mvc-2/1979-12-MVC.pdf.
- abgerufen am 24.05.2011

* URL http://www.samsung.com/us/pdf/dlna_guide.pdf.
- abgerufen am 26.07.2011
* URL http://www.engadget.com/2011/02/24/visualized-android-activations-mapped-geographically-chronology/.
- abfgerufen 07.07.2011
* URL http://amazon.com/o/ASIN/3540205683/.
- ISBN 9783540205685

- URL http://www.sciencedirect.com/science/article/pii/S009784939900120X.
- ISSN 0097-8493
* URL http://www.zdnet.de/news/mobile_wirtschaft_google_stellt_android_home_vor_story-39002365-41552871-1.htm.
- abgerufen am 11.05.2011
* Ubiquitares Computing / Buro fur Technologiefolgen-Abschatzungen beim Deutschen Bundestag. Mai 2009.
* Prinzipien und Paradigmsen_. Pearson Education Deutschland, 2007.
- URL http://amazon.com/o/ASIN/3827372933/.
- ISBN 9783827372932
* URL http://users.informatik.haw-hamburg.de/~ubicomp/projekte/master09-10-aw1/Voskuhl/bericht.pdf.
- abgerufen am 09.06.2011
- URL http://users.informatik.haw-hamburg.de/~ubicomp/projekte/master10-11-seminar/voskuhl/bericht.pdf.
- abgerufen am 09.06.2011
* Formen Storungen Paradoxien._ 11., unveranderte Auflage. Hans Huber Verlag, 2007
* URL http://www.ubiq.com/hypertext/weiser/SciAmDraft3.html.
- abge-rufen 11.04.2011
* [Witt 2011] Witt, Kristoffer: _Kontextabhangige multimodalale Interaktion mit Schwerpunkt Spracherkennung im Smart-Home Umfeld_, Hochschule fur Angewandte Wissenschaften Hamburg, Masterarbeit, 2011

## **Verischenung uber Selbststandigkeit**

Hiermit versichere ich, dass ich die vorliegende Arbeit im Sinne der Prufungsordnung nach: SS24(5) ohne fremde Hilfe selbststandig verfasst und nur die angegebenen Hilfsmittel benutzt habe.

Hamburg, 29. Juli 2011
