## **U**

## **technische universitat**

## **dortmund**

Bachelorarbeit

## **Umsetzung einer High-Performance**

## **FPGA-Schnittstelle fur maschinelles Lernen**

Fabian Dillkotter

Februar 2019

Gutachter:

Prof. Dr. Katharina Morik

M. Sc. Sebastian Buschjager

Technische Universitat Dortmund

Fakultat fur Informatik

Lehrstuhl fur Kunstliche Intelligenz (LS 8)

https://www-ai.cs.uni-dortmund.de

[MISSING_PAGE_EMPTY:2]

## Index

Inhaltsverzeichnis 1 Einleitung 1 Motivation und Zielsetzung 1.1 Aufbau der Arbeit 1.1 Verwandte Arbeiten 2 FPGAs 2.1 Aufbau und Besonderheiten 2.2 Konfiguration 2.3 Verwendete Hardware
3 PCI Express 3.1 Wahl der Schnittstelle 3.2 Aufbau von PCIe Netzwerken 3.3 PCIe Ubertragungsablauf 3.4 FPGA IP Core fur PCIe Kommunikation 4 Schnittstellenentwurf 4.1 Xillybus 4.1.1 Linux Treiber 4.1.2 FPGA IP Core 4.1.3 Kommunikationsablauf 4.2 Anforderungen 4.2.1 Perzeptron 4.2.2 Metriken 5 Implementierung 5.1 Xillybus Parameter 5.2 FPGA Code 5.2.1 Loopback 5.2.2 Perzeptron 5.3 Blockdesign* 5.4 Hostanwendung
* 6 Evaluation
	* 6.1 Konfiguration
		* 6.1.1 Realisierungsaufwand
		* 6.1.2 Ressourcenbedarf
	* 6.2 Ubertragungsleistung
		* 6.2.1 Verzogerungszeiten
		* 6.2.2 Datendurchsatz
	* 6.3 Performanz des Perzeptrons
	* 6.4 Praxistauglichkeit
* 7 Fazit und Ausblick
* 8 Abbildungsverzeichnis
* 9 Literaturverzeichnis
* 10 Erklarung

## Kapitel 1 Einleitung

### Motivation und Zielsetzung

Am 9. Marz 2016 gewann die kunstliche Intelligenz (KI) AlphaGo von Google DeepMind gegen Lee Sedol im Spiel Go. Go ist ein Brettspiel mit vielfach hoherer Komplexitat als Schach und Sedol gilt als einer der besten Spieler der Welt. Dieser Triumph bekam weltweit grosse mediale Aufmerksamkeit, da noch kurz vor den Spielen ein Sieg der KI aufgrund der hohen Komplexitat von Go fur unmoglich gehalten worden war [6]. Damit wurden einer breiten Offentlichkeit die Fortschritte von KIs und insbesondere der Techniken des maschinellen Lernens aufgezeigt. Grundlage des Erfolgs war ein automatisiertes Training mit grossen Datenmengen. Zunachst erfolgte ein Training von AlphaGo mithilfe von 30 Millionen vorab gespeicherten Spielzugen. Der zweite Schritt basierte auf einem Training von AlphaGo Instanzen untereinander [7].

Das Gebiet des maschinellen Lernens hat grosse Erfolge erzielt und ist mittlerweile in vielen Bereichen eine etablierte Methode fur verschiedenste Problemlosungen geworden. Dabei sind haufig grosse Datenmengen erforderlich, welche effizient verarbeitet werden mussen, um in akzeptabler Zeit ein gutes Ergebnis zu erreichen.

In den letzten Jahren wurden die grossen Fortschritte im Bereich des maschinellen Lernens auch durch deutliche Verbesserungen der Rechenleistung ermoglicht. Die Verarbeitung von grossen Datenmengen erfordert die Konzeption neuer Hard- und Software. Es wurden Moglichkeiten entwickelt, die Rechenleistung der Central Processing Units (CPUs) durch externe Hardware zu beschleunigen. Neben Graphics Processing Units (GPUs) stehen auch Field Programmable Gate Arrays (FPGAs) im Fokus der Forschung.

Dabei bieten die umfangreichen Moglichkeiten fur parallele Datenverarbeitung bei FPGAs zwar viel Potenzial fur Hardwarebeschleunigung bei maschinellen Lernverfahren, doch die Leistung kann dabei nur so gut sein, wie es der Datentransfer zum FPGA erlaubt. Um die zusatzliche Leistung nutzen zu konnen, muss eine Kommunikationsschnittstelle genutzt werden, uber die Daten zwischen CPU und FPGA ausgetauscht werden. Ziel dieser Arbeitist, eine Schnittstelle fur die Kommunikation mit einem FPGA zu realisieren. Diese soll anschliessend in Bezug auf maschinelles Lernen evaluiert werden, wobei die Anforderungen dieses Fachbereichs berucksichtigt werden sollen. Erstrebenswert sind dabei eine hohe Datenrate und eine niedrige Latenz.

### 1.2 Aufbau der Arbeit

In den ersten beiden Kapiteln sollen die Grundlagen der Arbeit erlautert werden. Dabei wird auf die Funktionsweise und Konfiguration von FPGAs im Allgemeinen eingegenungen und die Vorteile dieser Rechenplattform werden herausgearbeitet. Ausserdem wird die Kommunikationstechnologie Peripheral Component Interconnect Express (PCIe) vorgestellt und mit anderen Standards verglichen.

Anschliessend werden der Anwendungsfall einer PCIe Schnittstelle fur FPGAs im Kontext des maschinellen Lernens diskutiert und die geplante Umsetzung prasentiert. Im funften Kapitel stehen die Realisierung dieser Schnittstelle und die Verwirklichung der entwickelten Anwendungen im Vordergrund. Darauf folgen die Auswertung der Ergebnisse dieser Arbeit und abschliessend eine Zusammenfassung des erarbeiteten Ansatzes sowie die Vorstellung der gewonnenen Erkenntnisse. Zusatzlich werden weitere Optimierungsmoglichkeiten aufgezeigt.

### 1.3 Verwandte Arbeiten

Im Bereich des maschinellen Lernens ist die Laufzeit eines Ansatzes haufig nur durch die verfugbare Rechenleistung limitert. Daher liegt eine Erforschung der Moglichkeiten zur Hardwarebeschleunigung nahe, wie sie z. B. in [14] schon 1996 durchgefuhrt wurde. Dabei wurde der Einsatz von FPGAs im Zusammenhang mit neuronalen Netzen als vielversprechend bewertet. Auch im direkten Vergleich zu CPUs und GPUs sind FPGAs eine valide Alternative, wie beim Einsatz zur Beschleunigung der Berechnung einer Fitnessfunktion bei evolutionaren Algorithmen von J. A. Gomez-Pulido et al. [13] gezeigt wurde.

Aus diesem Grund ist der Einsatz eines FPGAs als Koprozessor im Bereich des maschinellen Lernens weit verbreitet [21]. R. Narayanan et al. [29] zeigten, dass Klassifizierungsalgorithmen auf FPGAs die funffache Geschwindigkeit im Vergleich zu einer Implementierung ohne Koprozessor erreichen konnen. Der Apriori-Algorithmus, ein Verfahren zum Entdecken von Korrelationen in einer Datenbasis, hat haufig eine lange Laufzeit, da er mit grossen Datenbanken verwendet wird. Die Realisierung auf einem FPGA konnte in diesem Anwendungsfall eine Beschleunigung der Laufzeit um mindestens den Faktor 4 bewirken [3]. Verschiedene Methoden aus dem Bereich des maschinellen Lernens, wie z. B. Support Vector Machines oder K-means, konnten stark beschleunigt werden und wiesen dabei einen geringeren Energiebedarf als Systeme ohne Koprozessor auf [15, 38, 31, 32].

Eine effiziente Umsetzung eines Algorithmus auf einem FPGA kann jedoch nur sinnvoll eingesetzt werden, wenn der Datentransfer ebenso effizient erfolgt. Eine langsame Kommunikation kann andernfalls einen Geschwindigkeitsvorteil der Logik zunichtemachen.

Aus diesem Grund ist eine performante PCIe Schnittstelle fur FPGAs fur viele Anwendungsbereiche von Interesse. Dementsprechend wurde dieses Thema in anderen Umgebungen bereits mehrfach behandelt.

So entwickeln H. Kavianipour et al. in [17] ein PCIe Interface speziell fur einen optimierten Direct Memory Access (DMA) am IceCube Neutrino Observatory am Sudpol und erreichen Ubertragungsraten von uber 700 MB/s. Auch L. Rota et al. setzen fur den Teilchenbeschleuniger an der Angstromquelle Karlsruhe auf eine DMA Schnittstelle, um die grossen zu verarbeitenden Datenstromeme ubertragen zu konnen [36].

Die genannten Schnittstellenimplementierungen sind jedoch sehr anwendungsspezifisch, weshalb der Fokus dieser Arbeit auf einer universell einsetzbaren Schnittstelle liegen soll.

## Chapter 1 Einleitung

## Kapitel 2 FPGAs

In dieser Arbeit soll eine PCIe Schnittstelle fur ein FPGA Board entwickelt werden. Hierfur wird im Folgenden der grundlegende Aufbau eines FPGAs erklart. Anschliessend folgt die Schilderung eines typischen Konfigurationsablaufs fur ein FPGA, wobei auch die verwendeten Programmierwerkzeuge vorgestellt werden. Schliesslich wird die eingesetzte Hardware prasentiert.

### Aufbau und Besonderheiten

FPGAs sind eine besondere Art eines Integrierten Schaltkreises (IC), welcher dazu konfiguriert werden kann, sich wie eine logische Gatterschaltung zu verhalten. Programmierbare Logikblocke (CLBs) sind mithilfe von programmierbaren Verbindungen matrixformig vernetzt und bilden mit I/O-Blocken und zum Teil noch anderen Bestandteilen (Multipliziereinheiten, eingebetteten Prozessoren, Digital Signal Processor Blocken, Blockram, Taktgeneratoren und weiteren) einen solchen IC.

Die einzelnen CLBs bestehen in FPGAs des Herstellers Xilinx aus Lookup-Tabellen (LUTs) und Flip-Flops. Die CLBs von anderen Herstellern sind teilweise anders aufgebaut, doch in dieser Arbeit wird, wie in Kapitel 2.3 beschrieben, ein FPGA von Xilinx verwendet. Ein schematischer Aufbau eines CLBs ist in Abbildung 2.1 dargestellt. Durch unterschiedliche Konfiguration konnen CLBs verschiedene Funktionen ubernehmen, z. B. jene von Speicherblocken oder allgemeinen Logikblocken [12].

Die CLBs sind an ein Netzwerk aus programmierbaren Verbindungen angebunden, welche dem FPGA durch freie Konfigurationsmoglichkeiten Flexibilitat verleihen. Diese Verbindungen nehmen ca. 80-90% der Flache auf dem FPGA ein, wahrend die Logik nur 10-20% belegt [9]. Da diese Vernetzung matrixformig ist, wird eine parallele Verarbeitung von verschiedenen Operationen ermoglicht. In dieser Eigenschaft unterscheiden sich FPGAs zusammen mit Application Specific Integrated Circuits (ASICs) von General Purpose Programessoren (GPPs) wie beispielsweise CPUs. Eine schematische Zeichnung von diesen Vernetzungen ist in Abbildung 2.2 skizziert.

Im Unterschied zu FPGAs ist die Konfiguration von ASICs ab dem Zeitpunkt der Produktion festgelegt und kann nicht verandert werden. Da die Funktion dieser Schaltung also schon bei der Fertigung feststeht, kann sie fur eine Anwendung genau optimiert werden. Daher sind ASICs deutlich effizienter als FPGAs und weisen ungefahr einen zwollfrach geringeren Energieverbrauch, eine 20 bis 40 Mal kleinere Flache und eine dreimal hohere Geschwindigkeit auf [19]. Der Aufwand, bis ein funktionsfahiger ASIC fertiggestellt ist, ist jedoch immens hoch, da zuerst grosse finanzielle und zeitliche Investitionen notwendig sind. Bei niedrigen Stuckzahlen lohnt sich daher de Einsatz von FPGAs, da diese durch ihre kurzfristig mogliche Neukonfiguration in verschiedenen Einsatzbereichen verwendet werden konnen. Noch vielseitiger sind CPUs, jedoch erlaubt die Parallelitat von FPGAs eine deutlich hohere Effizienz. Der sequenziellen Abarbeitung von Operationen auf GPPs steht hier die parallele Ausfuhrung von unterschiedlichen Berechnungsschritten auf FPGAs gegenuber. Die hohere Taktfrequenz von CPUs kann bei Einsatz eines FPGAs mit optimierter Konfiguration mehr als ausgeglichen werden [30].

### 2.2 Konfiguration

Der Name,,Field Programmable" basiert darauf, dass die Funktion des Chips nach Fertigung "in the field" festgelegt oder verandert werden kann [20]. Fur eine Veranderung der Funktion muss ein FPGA neu konfiguriert werden. In dem betrachteten Fall folgt eine solche Veranderung der Software dem Muster in Abbildung 2.3. Im ersten Schritt wird die gewunschte Anwendung in einer Hochsprache programmiert. Infrage kommen dabeiz. B. MATLAB, Java, oder wie im hier behandelten Fall C [28]. Aus diesem Code wird mittels High-Level-Synthese (HLS) ein Entwurf in Hardwarebeschreibungssprache (HDL, meist VHDL oder Verilog) erzeugt. Xilinx bietet fur diesen Schritt die Software Vivado HLS, welche im Verlauf dieser Arbeit genutzt wird. Die HLS wird verwendet, um die hohere Abstraktion und den geringeren Programmieraufwand von Hochsprachen auszunutzen, allerdings ist die Performanz von nativen HDL Anwendungen den durch HLS erzeugten meistens uberlegen [26]. Dieser Performanzverlust ist nicht erheblich genug, um eine HDL Programmierung in diesem Anwendungsfall zu rechtfertigen.

Die weitere Konfiguration erfolgt mit der Vivado Design Suite von Xilinx. Zusammen mit Xilinx und Intellectual Property (IP) Komponenten von Drittanbietern werden die so erzeugten Blocke in einem Blockdiagramm zusammengefugt und die Ein-/Ausgange korrekt verbunden. Die IP Blocke werden von Xilinx oder Drittanbietern kostenpflichtig oder frei zur Verfugung gestellt und bieten vorgefertigte Logikblocke, die in Projekte eingebunden werden konnen. Bei der darauf folgenden Simulation wird versucht, das reale Verhalten eines FPGAs zu emulieren, um so die Funktion des erstellten Block Designs zu prufen. Anschliessend errechnet Vivado im Syntheseschritt eine Realisierung eines Systems, welches den vorher erarbeiteten Funktionen und Vorgaben entspricht. Dabei entsteht die Netzliste, ein Schaltplan der elektrischen Verbindungen der Bauteile. Die Implementierung setzt diese Netzliste dann fur das konkrete FPGA um und viele relevante Daten werden errechnet. Neben der Energiebelastung und der Ressourcenauslastung konnen an dieser Stelle Timing Probleme erkannt werden, bevor die Schaltung auf das FPGA geladen wird. Schliesslich wird der Bitstream generiert, um diesen uber eine Schnittstelle des Rechners auf das FPGA zu ubertragen.

### 2.3 Verwendete Hardware

In dieser Arbeit wird das AC701 Evaluation Kit der Firma Xilinx Inc. eingesetzt. Das enthaltene Board bieteten ein XC7A200T-2FBG676C FPGA der Artix-7 Reihe und weistabhangig von der Konfiguration bis zu 215.360 Logikzellen, 740 Digital Signal Processor (DSP) slices, 13.140 kB Block RAM, 1 GB DDR3 RAM und 500 I/O Pins auf [50]. Fur die Kommunikation stehen 10/100/1000 MBit/s Ethernet, ein Enhanced Small Form-factor Pluggable (SFP+) Cage, ein High Definition Multimedia Interface (HDMI) Ausgang, eine USB zu Universal Asynchronous Receiver Transmitter (UART) Brucke und ein 4-Lane PCIe Anschluss der Version 2.1 zur Verfugung [49]. Dieses Board ist in einen Desktop PC mit einer Intel Xeon W3565 CPU und 24 GB RAM eingebaut und wird unter Ubuntu 14.04.5 LTS 64-Bit betrieben. Die Konfiguration erfolgt mit einem Windows 10 (64-Bit) Notebook von Dell uber den USB-JTAG Anschluss auf dem Board.

Im AC701 Evaluation Kit sind zusatzlich zum FPGA Board neben Daten- und Stromkabelnoch eine Evaluationskarte zum Testen vom Xilinx Analog-to-Digital Converter und der Analog Mixed Signal Technologie enthalten. Ausserdem wird dazu eine Lizenz der Vivado Design Suite fur das verbaute FPGA bereitgestellt.

## Kapitel 3 PCI Express

In diesem Kapitel soll zuerst die Wahl des PCIe Standards begrundet werden. Anschliessend wird dessen Aufbau und Funktionsweise erklart und eine erste obere Schranke fur die mogliche Ubertragungsrate berechnet. Abschliessend werden verfugbare Frameworks fur PCIe Kommunikation mit FPGAs aufgezeigt und die Entscheidung fur eines davon begrundet.

### Wahl der Schnittstelle

Fur die bidirektionale Kommunikation zwischen Hostcomputer und FPGA Board stehen die folgenden Moglichkeiten zur Verfugeung: USB zu UART, Ethernet, SFP+ und PCIe 2.1 mit 4 Lanes. Der HDMI Ausgang des Boards wird nicht weiter betrachtet, da hiermit nur eine Kommunikation in eine Richtung moglich ist. Als eine performante Schnittstelle scheiden die USB zu UART Brucke und Ethernet aus, da hier technisch nur niedrige Ubertragungsraten erreichbar sind. Die verbaute Single-Chip Brucke von Silicon Laboratories Inc. unterstutzt sogar nur die USB 2.0 Full Speed Datenrate [39], weshalb sie fur viele Anwendungen unbrauchbar ist. Der SFP+ Verbinder ist fur weitaus hohere Ubertragungsarten von bis zu 1.250 MB/s geeignet [40]. Seine maximale Ubertragungsrate wird von der PCIe 2.1 x4 Schnittstelle mit 2.000 MB/s noch deutlich ubertroffen (Abbildung 3.1). Daruber hinaus steht bei der PCIe Schnittstelle in beide Richtungen gleichzeitig die volle Geschwindigkeit zur Verfugung. Aus diesem Grund wird in dieser Arbeit eine Kommunikation uber PCIe gewahlt.

### Aufbau von PCIe Netzwerken

Im Gegensatz zum Vorganger, dem Bus-System PCI, bei welchem mit parallelen Kupferleitungen mehrere Steckplatze physisch verbunden sind, ist PCIe wie ein Netzwerk aufgebaut. PCIe ist eine Schnittstelle, bei der die Datenbits nacheinander (seriell) ubertragen werdenund die gesamten angeschlossenen Elemente ein paketbasiertes Netz bilden. Die einzelnen Komponenten, die uber PCIe kommunizieren, sind mit einem Netzwerkverteiler durch Punkt-zu-Punkt-Verbindungen angeschlossen. Anders als noch bei PCI konkurrieren die angeschlossenen Gerate nicht mehr um den Zugriff auf den Bus, sondern jede Verbindung zwischen zwei Kommunikationspartnern hat einen eigenen Satz Empfangs- und Sendeleitungen, den sogenannten Link. Ein Link besteht aus einer bestimmten Anzahl an Lanes. Als Lane wird ein einzelnes Leitungspaar aus jeweils einer Leitung fur jede Richtung bezeichnet. Die einzelnen Leitungen konnen Daten nur in eine Richtung ubertragen (simplex), doch da die Leitungen immer als Paar zu einer Lane zusammengehoren, kann jede Lane gleichzeitig in beide Richtungen mit voller Geschwindigkeit ubertragen (dual simplex).

Die Elemente, welche mit PCIe verbunden werden konnen, werden von der PCIe Spezifikation [33] in vier Klassen eingeteilt:

* Root Complex: Der Root Complex ist die Basis eines PCIe Netzes. Er ist die Verbindung zwischen Arbeitsspeicher, CPU und anderen angeschlossenen Geraten. Diese Kompenente ubernimmt die Verwaltung der verbundenen Peripherie und der Zugriffe in beide Richtungen.
* PCIe-PCI Bridge: Um mit alteren Systemen wie PCI kompatibel zu sein, stellen diese Bridges das Verbindungsglied zu PCIe dar.
* Switch: Switches sind direkt mit dem Root Complex verbunden. An sie konnen mehrere Endpoint Komponenten angeschlossen werden. Die angeschlossenen Gerate konnen untereinander oder mit dem Root Complex kommunizieren.

* Endpoint: Alle Gerate, welche selbst PCIe Transaktionen senden oder empfangen, werden als Endpoint bezeichnet. Diese Komponenten konnen entweder an einen Switch oder direkt an den Root Complex angeschlossen sein.

Der genaue Aufbau eines PCIe Netzwerkes ist variabel und hangt von den angeschlossenen Geraten ab. Ein beispielhafter Aufbau ist in Abbildung 3.2 dargestellt.

Um externe Gerate als Endpoint an PCIe anzubinden, existieren Steckplatze, deren Aufbau von der unterstutzten Anzahl an Lanes abhangig ist. Ein Steckplatz fur eine solche Komponente ist in einen linken und einen rechten Kontaktteil aufgeteilt, wobei sich im linken Teil, unabhangig von der Anzahl der unterstutzten Lanes, immer 22 Kontakte fur die Stromversorgung und Baugruppenkommunikation befinden. Die Anzahl der Steckkontakte im rechten Teil ist abhangig von den Lanes. Das AC701 Board unterstutzt 4 Lanes und hat damit 42 Kontakte fur die eigentliche Datenubertragung [49]. Insgesamt wird das Board also mit 64 Kontakten an der PCIe Schnittstelle verbunden. PCIe hat je nach Version eine theoretische Ubertragungsrate (ohne Protokoll Overhead) von 250 bis 1.969 MB/s pro Lane und Richtung. In der Entwicklung ist der Standard PCIe 5.0, womit die hochste Rate im Jahr 2019 nochmals verdoppelt werden soll [1].

Im vorliegenden Fall wird PCIe 2.1 x4 mit einer maximalen Ubertragunsrate von 2 GB/s pro Richtung eingesetzt. Diese Ubertragungsrate wird aus drei Werten berechnet. Der Standard 2.1 hat eine Symbolrate von 5 GT/s, dies gibt die ubertragenen Symbole pro Zeiteinheit an. Dabei sind nicht nur die Informationsbits enthalten, sondern auch Bits, welche fur die Ubertragung an sich ubermittelt werden mussen. Die Zusammensetzung der ubertragenen Bits wird durch den Leitungscode festgelegt. Ein \(a/b\) Leitungscode bedeutet, dass fur \(a\) Bits Informationen insgesamt \(b\) Bits uber die Leitung ubertragen werden mussen.

PCIe 2.1 verwendet einen 8b/10b Leitungscode, es wird also mit 10 Leitungs-Bits ein Byte Informationen kodiert. Die zusatzlich ubertragenen Bits verhindern unter anderem lange Folgen von Nullen oder Einsen, welche technische Probleme hervorrufen konnten. Daher ergibt sich die maximale Ubertragungsrate durch:

\[\frac{5\,\mathrm{GT}}{8}\times\frac{8\,\mathrm{Bit}}{10\,\mathrm{Bit}}\times 4 \,\mathrm{Lanes}=\frac{16\,\mathrm{GBit}}{8}=\frac{2\,\mathrm{GByte}}{8}\]

### PCIe Ubertragungsablauf

Die Ubertragung von Daten erfolgt nach der PCIe Spezifikation [33] nach einer Architektur aus drei Schichten. Das Schichtenmodell wird aus den drei Schichten Physical Layer, Data Link Layer und Transaction Layer gebildet. Die Physical Layer ist die unterste Schicht und bildet die Signalubertragung zwischen zwei Geraten ab. Diese findet uber mehrere Lanes mit jeweils einer Leitung fur das Senden und Empfangen statt. In der Physical Layer werden jeweils am Anfang und am Ende des Paketes 1 Byte Informationen hinzugefugt, um die Grenzen des Paketes anzuzeigen.

Daruber befindet sich die Data Link Layer, welche als Sicherungsschicht dem Paket aus der Transaction Layer eine Sequenznummer und eine zyklische Redundanzprufung anfugt. Die Sequenznummer belegt 2 Bytes. Als zyklische Redundanzprufung werden 4 Bytes Link Layer Cyclic Redundancy Check (LCRC) angefugt, womit ein Positive Acknowledgement with Retransmission (PAR) Verfahren umgesetzt wird. Dieses Verfahren sorgt mittels Empfangsbestatigungen und erneuten Ubertragungen bei Ausbleiben von diesen fur einen korrekten Datentransfer. Ausserdem wird hier eine Datenflusssteuerung umgesetzt, welche die Aufgabe hat, Pakete nur dann zu senden, wenn der Empfangspartner bereit fur den Transfer ist.

Die oberste Schicht ist die Transaction Layer, welche Anfragepakete aus einem Datenund einem Headerteil zur Ubertragung an die Data Link Layer erstellt. Dabei werden nur noch die Sender und Empfanger des Paketes berucksichtigt und keine dazwischenliegenden Switches. In der Transaction Layer werden 12 Bytes fur einen Header angefugt, welcher z. B. die ID des Anforderers, ein Tag und eine Adresse enthalt. Bei 64-Bit Adressierung ist der Header 16 Bytes gross, da die Adresse dann 4 Bytes mehr benotigt, doch in dem vorliegenden Fall wird eine 32-Bit Adressierung eingesetzt. Darauf folgt der zu ubertragende Datenteil (Payload), welcher bis zu 4.096 Bytes gross sein kann. Am Ende des Transaction Layer Paketes werden noch 4 Bytes End-to-End Cyclic Redundancy Checksum (ECRC) angefugt, eine Prufsumme, die mittels Division errechnet wird. Diese kann Biftehler in den ubertragenen Daten offenbaren [48]. Die Zusammensetzung eines Paketes wird in Abbildung 3.3 visualisiert.

Die Grundlage der Ubertragung von Informationen uber PCIe bilden Transaktionen. Der PCIe Standard [33] definiert Transaktionen als eine Serie von Ubertragungen von Pakten, welche insgesamt Informationen von einem Kommunikationspartner zu einem anderen Kommunikationspartner ubermitteln. Transaktionen bestehen aus einer Anfrage und der Erfullung dieser Anfrage. Insgesamt existieren vier Transaktionstypen:

* Memory Transaction: Diese Art von Transaktion wird verwendet, wenn ein Gerat direkt auf einen Speicher (meist den Arbeitsspeicher) zugreift. Die wichtigsten Speichertransaktionen sind Memory Read Request, Memory Read Complete und Memory Write Request. Wenn ein PCIe Gerat etwas aus dem Arbeitsspeicher lesen mochte, sendet es mit dem Memory Read Request die gewunschte Speicheradresse und die Datenmenge. Der Root Complex greift auf den Arbeitsspeicher zu, ruft die gewunschten Daten ab und sendet diese mit (ggf. mehreren) Memory Read Completions. Wenn ein Gerat den Arbeitsspeicher beschreiben will, sendet es die zu schreibenden Daten mittels Memory Write Request an den Root Complex, welcher dann den Speicherzugriff ausfuhrt. Um die Leistungsfahigkeit der Kommunikation zu erhohen, kann auf eine Bestatigung des erfolgreichen Schreibvorgangs verzichtet werden.
* I/O Transaction: Transaktionen dieser Art erlauben das Lesen und Schreiben von Daten alterer Geraten. Sie werden nur fur die Abwartskompatibilitat zu PCI unterstutzt und verlieren im Laufe der Zeit an Bedeutung, da die Verbreitung dieses Protokolls nachlasst.
* Configuration Transaction: Jedes PCIe Gerat hat einen Konfigurationsspeicherbereich von 4 kB. Um die Konfiguration der Gerate zu steuern, stehen dem Root Complex diese Transaktionen zur Verfugung. Die unterstutzten Arten sind Configuration Read Request, Configuration Read Completion, Configuration Write Request und Configuration Write Completion.
* Message Transaction: Um eine Kommunikation zwischen Geraten zu ermoglichen, welche kein Datentransfer ist, existieren Message Transactions. Es gibt viele Anwendungsfalle fur diese Transaktionsart, z. B. Interrupts, Fehlermeldungen oder die Verwaltung der Energieversorgung.

Die Memory Transactions ermoglichen die Nutzung von DMA, womit PCIe gegenuber anderen Schnittstellen einen grossen Vorteil hat. Wenn ein Gerat uber PCIe mit DMA auf den Arbeitsspeicher zugreift, muss diese Transaktion nicht von der CPU verwaltet werden, wodurch diese entlastet wird.

### FPGA IP Core fur PCIe Kommunikation

Fur die Datenubertragung uber PCIe mit dem FPGA werden ein IP Core seitens des FPGAs und ein Treiber fur die Seite des Host Computers benotigt. Da die Entwicklungbeider Komponenten mit einem hohen Aufwand verbunden ist, gibt es verschiedene Frameworks, die in unterschiedlichem Umfang die wichtigsten Kommunikationsfunktionen bereitstellen. Hier gibt es mehrere Ansatze, welche an dieser Stelle kurz verglichen werden sollen.

Xilinx selbst bietet fur die FPGAs der Artix-7 Serie einen IP Core an [47]. Dieses Modul wird ohne weitere Kosten durch die Xilinx Vivado Design Suite Software bereitgestellt. Der Xilinx IP Core setzt die drei Schichten aus den PCIe Basis Spezifikationen um. Die fur die jeweilige Schicht notwendigen Informationen werden dem zu ubertragenden Datenpaket hinzugefugt. Die ankommenden Pakete werden schrittweise von der Physical Layer Reprasentation zu der Transaction Layer Reprasentation verarbeitet, sodass der Nutzer keine Datenvorverarbeitung bei Verwendung der PCIe Schnittstelle vornehmen muss.

Um diesen IP Core zu erganzen, wurde von M. Vesper et al. die Open Source Bibliothek JetStream entwickelt. In ihrem Tagungsbeitrag [45] werden vielversprechende Ergebnisse prasentiert, doch der Quellcode wurde nicht vollstandig veroffentlicht. Die verfugbaren Quelldateien werden seit dem 01.01.2016 nicht mehr gepflegt und Nachfragen blieben unbeantwortet. Daher kann dieser Ansatz nicht weiter betrachtet werden.

M. Jacobsen et al. stellen in [16] das alternative Framework RIFFA vor, welches flexibel mit verschiedenen FPGAs, Betriebssystemen und Programmiersprachen kompatibel ist. Dabei erzielen sie mehr als 90% der theoretisch moglichen Ubertragungsrate. Die letzte Aktualisierung des Projektes wurde am 08.09.2016 vorgenommen und auch wenn der Code weiterhin verfugbar ist, ist die Webseite mit Dokumentation und Support des Projektes nicht mehr erreichbar.

Xillybus ist eine kommerzielle Losung, bestehend aus einem IP Core und einem Interface fur die Host Anwendung [54]. Fur akademische Anwendungsszenarien werden kostenlose Lizenzen bereitgestellt. Dieses Framework ist mit FPGAs von Xilinx und Intel kompatibel und mit Windows und Linux Betriebssystemen nutzbar. Diese Flexibilitat und die einfache Einbindung in bestehende Projekte machen Xillybus zu einer beliebten Option [41]. Die genauere Funktionsweise von Xillybus wird in Kapitel 4.1 erlautert.

T. B. Preusser und R. G. Spallek haben in ihrem Tagungsbeitrag [34] RIFFA und Xillybus verglichen und kommen zu dem Ergebnis, dass fur eine stabile Kommunikation mit hoher Leistung Xillybus die bessere Losung ist. Zu RIFFA wird geraten, wenn die Umsetzung des PCIe Standards oder das Vorgehen beim Entwurf eines Treibers von Grund auf erlert werden soll. Aus diesem Grund wurde fur den vorliegenden Anwendungsfall eine Umsetzung mit Xillybus gewahlt.

## Kapitel 4 Schnittstellenntwurf

In diesem Kapitel wird der Entwurf einer PCIe Schnittstelle mit der vorgestellten Hardware erlautert. Zuerst werden dafur der Aufbau und die Funktionsweise des Xillybus IP Cores und des Treibers des Host PCs dargestellt. Anschliessend werden die Anforderungen, welche an eine solche Anwendung im Gebiet des maschinellen Lernens gestellt werden, erlautert.

### Xillybus

Das Xillybus Framework besteht aus einem IP Core auf der FPGA Seite und einem Treiber fur den Host PC. Dabei bietetc Xillybus nicht nur eine PCIe DMA Engine, sondern auch Hilfsmittel fur die Konfiguration von Ende-zu-Ende Verbindungen. Die beiden Bestandteile werden im Folgenden einzeln vorgestellt.

#### Linux Treiber

Von Xillybus sind Treiber fur Windows 7 (32/64-Bit) und Linux kostenfrei verfugbar. Der Linux Treiber kann auf der Xillybus Webseite heruntergeladen werden, ist jedoch bei dem Betriebssystem des eingesetzten Host PCs Ubuntu 14.04 bereits enthalten. Eine Installation ist daher nicht notwendig.

Sobald der Treiber ins Betriebssystem geladen wird (in der Regel beim Booten), erkennt dieser automatisch die angeschlossene Hardware und die darauf konfigurierten IP Cores. Abhangig von den im IP Core hinterlegten Parametern werden DMA Buffer im Arbeits- speicher des Host PCs mittels Memory Allocation reserviert. Die Parameter bestimmen, wie viele Datenstrome (Streams) angelegt werden sollen, wie viele DMA Buffer diese benotigen und welche Grosse die Buffer haben sollen. Durch den Treiber werden ausserdem Geratedateien fur die Anwendungslogik angelegt. Diese Dateien konnen konventionell geoffnet, gelesen und beschrieben werden. Damit kann jede beliebige Programmiersprache fur die Hostanwendung gewahlt werden, welche Moglichkeiten zur Dateibearbeitung bietet.

Die DMA Buffer werden beffullt, der jeweils anderen Seite der Schnittstelle ubergeben, bestatigt und gelesen. Dieses Verfahren nutzt Besonderheiten des PCIe Standards aus, sodass die Schreib-/Lesevorgange des FPGA Boards im Arbeitsspeicher nicht von der CPU des Host Rechners verwaltet werden mussen und die CPU damit signifikant enthalstet wird. PCIe ermoglicht es im Gegensatz zu anderen Schnittstellen, dass Gerate direkt,,,an der CPU vorbei", auf den Arbeitsspeicher des Rechners zugreifen konnen. Durch solche DMA Vorgange wird die CPU bei hohen Datenraten stark enthalstet.

Auf der Hostseite muss also keine neue Programmierschnittstelle (API) erlernt werden, da sich die Kommunkation hier wie jede andere Dateiverarbeitung verhalt. Trotzdem mussen einige Dinge beachtet werden, um auf die Besonderheiten der zugrundleigenden Kommunikation Rucksicht zu nehmen. So wird in der FPGA Logik festgelegt, welche Streams synchron und welche asynchron sind. Synchrone Streams sind teilweise einfacher zu nutzen, doch asynchrone Streams haben meist einen hoheren Datendurchsatz, weshalb fur diese Arbeit asynchrone Streams gewahlt wurden. Gerade bei Anwendungen mit grossem Datenvolumen konnen synchronize Streams die Geschwindigkeit drosseln, da der Datenfluss unterbrochen werden kann, weil die Anwendung von der CPU verdrangt wurde oder anderveitig beschaftigt ist [53].

#### FPGA IP Core

Der Xillybus IP Core ist als ein Bundle aus mehreren Blocken aufgebaut [52]. Er enthalt den Xilinx PCIe Interface IP Core fur die Kommunikation zum Host PC uber PCIe. Daruber hinaus enthalt er mehrere First In - First Out Buffer (FIFOs). Diese zeichnen sich dadurch aus, dass sie Daten in derselben Reihenfolge aus einer Warteschange ausgeben, wie sie zu dieser hinzugefugt wurden [8]. Die FIFOs bilden die Schnittstelle zur Anwendungslogik auf dem FPGA. Zwischen den FIFOs und dem Xilinx IP Core befindet sich ein internet Xillybus IP Core, welcher die Datenubertragung verwaltet, indem er abhangig von den Signalen der FIFOs (empty und full) einen Datentransfer initiiert.

Dieser interne Core agiert vollkommen unabhangig von der Anwendungslogik. Sobald ein DMA Buffer vom Xillybus Treiber freiggegeben wurde, kann der interne IP Core auf die enthaltenenen Daten zugreifen. Auf der anderen Seite erkennt dieser anhand der,,full" und,,empty" Signale der FIFOs, wann Daten gelesen bzw. geschrieben werden konnen. Der Datenfluss auf FPGA Seite ist in Abbildung 4.1 dargestellt.

Xillybus bietet drei verschiedene Revisionen des IP Cores an. Revision A sind die altesten und potenziell langsamsten Cores mit einer Datenubertragungsrate von maximal 800 MB/s. Auf Anfrage wird Zugang zu den hoheren Revisionen gewahrt, diese sind Revision B mit bis zu 1.700 MB/s und Revision XL mit bis zu 3.500 MB/s. Der Leistungsunterschied ist vor allem auf die Wortbreite der internen Datenubertragung zuruckzufuhren, welche von 32 Bit (Revision A) auf 64 Bit (Revision B) bzw. 128 Bit (Revision XL) erhoht wurde. Ausferdem erlauben Revision B und Revision XL breitere Wortbreiten bei der Kommunikation mit der Anwendungslogik auf dem FPGA.

Bei der Konfiguration des IP Cores mussen viele Parameter festgelegt werden, welche spa- ter uber den genauen Ablauf der Kommunikation entscheiden. So mussen beispielsweise die gewunschten Buffer angegeben werden, welche dann im Arbeitsspeicher des Host PCs reserviert werden. Um die Konfiguration und Verwaltung der gewunschten IP Cores zu vereinfachen, bietet Xillybus ein Web Interface fur deren Generierung an. Der Ablauf einer solchen Konfiguration wird hier nun kurz aufgezeigt.

Im ersten Schritt der Erstellung eines neuen Cores muss dieser fur die spatere Verwaltung benannt werden. Um die Netzliste korrekt erstellen zu konnen, muss daruber hinaus festgelegt werden, aus welcher Geratereihe das FPGA stammt, auf dem spater der Core integriert werden soll. Zudem muss das Betriebssystem des Host Rechners angegeben werden, da der Core fur Windows und Linux unterschiedlich angepassst werden muss.

Wenn der Core erstellt ist, mussen die Geratedateien angelegt werden. Der hier gewahlte Name entspricht spater dem Namen der Geratedatei im /dev Ordner, daher kann die Host Programmierung nie ohne eine abgestimmte Core Konfiguration funktionieren. Daruber hinaus muss die Richtung der Geratedatei aus Upstream, Downstream und Bidirektional ausgewahlt werden. Dabei entspricht Upstream der Verbindung FPGA zu Host, Downstream der Verbindung Host zu FPGA und eine bidirektionale Datei entspricht jeweils einem Down- und einem Upstream, welche mit derselben Datei angesprochen werden konnen. Xillybus bietet die Moglichkeit, die internen Parameter der Geratedateien automatisch abhangig von dem ausgesuchten Verwendungszweck und der erwarteten Ubertragungsrate zu setzen, jedoch lasst eine manuelle Konfiguration mehr Optimierungen zu.

Fur die Kommunikation mit der Anwendung auf dem FPGA kann die Wortbreite gewahlt werden, wobei bei einem Revision A Core Breiten von bis zu 32 Bit erlaubt und bei Revisions B oder XL bis zu 256 Bit moglich sind. Des Weiteren muss zwischen einem synchronen und einem asynchronen Stream gewahlt werden, da bei diesen das Verhalten bei Lese- und Schreibvorgangen stark abweicht. Um den Systemressoureverbrauch und die Performanz zu beeinflussen, konnen zudem die Bufferanzahl und die Buffergrosse gewahlt werden. Fur eine hohe Ubertragungsrate sind viele und grosse Buffer von Vorteil, jedoch durfen die Werte auch nicht zu hoch gewahlt werden, um zu verhindern, dass das Betriebssystem die Speicherresverierung verweigert. Andererseits sollte die Buffergrosse auch nicht zu gering gewahlt werden, da sonst die CPU belastet und die Leistung beeintrachtigt werden kann. Dies geschieht, da jedes Mal, wenn ein DMA Buffer gefuillt oder geleert wird, ein Interrupt an den Host gesendet wird. Bei der Wahl der Buffer mussen daher Kompromisse in Kauf genommen werden.

Wenn alle Optionen eingestellt wurden und die Konfiguration des FPGA bevorsteht, kann der Core generiert und eingebunden werden.

#### Kommunikationsablauf

Im Folgenden wird ein beispielhafter Datenfluss von Host zu FPGA (Downstream) erlautert und anschliessend kurz die Gegenrichtung (Upstream) dargestellt.

Der Datentransfer wird mit einem write() Aufruf mit der Geratedatei des Streams als Parameter auf dem Host PC gestartet, wobei der Buffer mit den Daten sowie die Grosse des Buffers ubergeben werden. Der Treiber versucht nun, so viele Daten wie moglich in die DMA Buffer zu kopieren. Der Buffer wird an den Xillybus IP Core ubergeben wenn eine von drei Bedingungen erfullt ist:

* es sind 10 ms seit dem letzten write() Aufruf vergangen
* write() wurde mit einem leeren Datenargument aufgerufen
* der Buffer ist komplett gefullt

Damit informiert der Treiber, dass diese Daten gelesen werden konnen und garantiert, diesen Buffer nicht zu beschreiben, bis die FPGA Seite ihn wieder freigegeben hat. Anschliessend wahlt der Treiber mittels Rundlaufverfahren den nachsten Buffer zum Beschreiben aus.

Aus den DMA Buffern im RAM des Host Rechners werden die Daten anschliessend vom Xillybus IP Core in das FIFO auf dem FPGA kopiert. Dieser Datentransfer ist abhangig davon, ob dem IP Core DMA Buffer mit Daten ubergeben wurden, und von dem full Signal des FIFOs. Die Daten werden mithilfe des Xilinx PCIe IP Cores ubertragen, ohne dass die CPU des Hostrechners die Ubertragung steuern muss. Nachdem der Buffer geleert wurde, wird er von der FPGA Seite wieder freigegeben.

Die Anwendungslogik auf dem FPGA kann nun eigenmachtig nach Bedarf Daten aus dem FIFO abrufen und diese verarbeiten. Dabei muss das empty Signal des FIFOs beachtet werden, um einen Unterlauf zu vermeiden. Der komplette Datentransfer in dieser Richtung ist in Abbildung 4.2 dargestellt.

Ein Upstream beginnt damit, dass die Anwendungslogik auf dem FPGA zu ubertragende Daten in den FIFO schreibt. Auch in dieser Richtung muss der Zustand des FIFOs beachtetwerden, genauer muss das full Signal respektiert werden, um einen Uberlauf zu vermeiden. Wenn ein FIFO Daten enthalt und in einem DMA Buffer noch Speicher frei ist, verwendet der Xillybus IP Core das PCIe Interface, um Daten in einen Buffer im RAM des Host PCs zu schreiben. Auch hier wird die CPU nicht durch die Schreibvorgange belastet. Dieser Datentransfer funktioniert nach dem Rundlaufverfahren, dementsprechend befullt der IP Core einen Buffer, gibt diesen fur den Host Treiber frei und fahrt mit dem Beschreiben des nachsten Buffers fort.

Der Treiber reagiert auf read() Aufrufe mit der Geratedatei des Streams als Parameter, indem er Daten aus einem DMA Buffer in den Buffer der Host Anwendung kopiert. Falls durch diesen Aufruf ein DMA Buffer komplett geleert wurde, wird dieser wieder fur den Xillybus IP Core freigeeben.

Dieser Ablauf ist in Abbildung 4.3 veranschaulicht.

### 4.2 Anforderungen

An die Schnittstelle werden verschiedene Anforderungen gestellt, die sie bestmoglich erfullen sollte. Da die entwickelte Losung im Gebiet des maschinellen Lernens eingesetzt werden soll, wird beispielhaft ein einfaches Perzeptron auf dem FPGA umgesetzt. Anhand dieses Prototypen soll exemplarisch die Leistungsfahigkeit der Schnittstelle untersucht werden.

Ausserdem soll grundsatzlich eine moglichst hohe Ubertragungsrate erreicht werden, um so die Vorteile von PCIe auszunutzen. Dabei soll daruber hinaus die Latenz der entwickelten Schnittstelle untersucht werden. In den folgenden Abschnitten werden der Aufbau und die Funktionsweise eines Perzeptrons sowie die zu ermittelnden MaSzahlen vorgestellt.

#### Perzeptron

Das Perzeptron als Lernmodell fur KI wurde 1958 von F. Rosenblatt vorgestellt [35]. Es handelt sich dabei um eine Sonderform eines neuronalen Netzes, welches anhand von variablen Gewichtungen und Schwellenwerten Eingabeevktoren klassifiziert und einen Ausgabetvektor ausgibt. Ein Perzeptron kann dabei aus mehreren Lagen von kunstlichen Neuronen oder in der simpelsten Form auch nur aus einem einzelnen Neuron bestehen. Die Neuronen werden abhangig vom angewandten Modell verbunden. So werden beispielsweise Multi-layer feed-forward Netze gebildet, indem die Neuronen in eine Eingabeschicht, eine Ausgabeschicht und eine Anzahl von verdeckten Schichten gruppiert werden. Die Verbindungen sind dabei so aufgebaut, dass ein Neuron aus Schicht \(i\) alle Ausgange der Schicht \(i-1\) als Eingang hat und am Ausgang jeweils eine Verbindung zu allen Neuronen der Schicht \(i+1\) besitzt [42].

Die Neuronen haben im Allgemeinen entweder eine globale Eingabe oder aber individuell gewichtete Ausgaben von anderen Neuronen in Form von reellen Zahlen als Eingange. Eine Aktivierungsfunktion ermittelt fur jedes Neuron abhangig von dessen Zustand wiederum eine reelle Zahl als Ausgabe. Der allgemeine Aufbau eines Neurons ist in Abbildung 4.4 dargestellt.

Wesentliche Eigenschaft von Perzeptrons ist, dass die variablen Gewichtungen und Parameter der Aktivierungsfunktionen der Neuronen nicht zur Zeit der Implementierung festgelegt, sondern durch Trainingsdaten selbststandig erlernt werden. Hierfur mussen Lernregeln festgelegt werden, welche definieren, wie die Parameter der Neuronen beim Training modifiziert werden sollen.

Ein klassisches Anwendungsgebiet von Perzeptrons ist die Mustererkennung. Dabei wird das Perzeptron mit einer Trainingsdatenmenge trainiert, welche Beispiele mit dem gesuchten Muster und solche ohne dieses Muster enthalt. Anschliessend ist das Perzeptron in der Lage, auch bei neuen Daten das trainierte Muster zu erkennen.

Der genaue Aufbau des in dieser Arbeit verwendeten Perzeptrons folgt in Kapitel 5.2.2.

#### Metriken

Fur Kommunikationsschnittstellen wird haufig die Datenubertragungsrate als Maszahl der Leistungsfahigkeit verwendet. Diese berechnet sich nach der Formel \(C=\frac{D}{t}\), wobei \(C\) die Datenubertragunsrate, \(D\) die ubertragene Datenmenge in Bytes und \(t\) die Ubertragungszeit in Sekunden ist. Die Einheit der Datenubertragungsrate ist Bytes/s bzw. MB/s.

Da bei dieser Maszahl jedoch auch Steuerdaten in der Datenmenge enthalten sind, ist fur eine anwendungsnahe Abschatzung der nutzbaren Geschwindigkeit der Datendurchsatz besser geeignet. Beim Datendurchsatz werden nicht die gesamten ubertragenen Daten, sondern nur die Nutzdaten pro Sekunde gezahlt. In jeder der drei PCIe Schichten kommen mehrere Bytes Overhead zum ubertragenen Paket hinzu. In [48] wird von Xilinx beschrieben, wie sich der Overhead fur PCIe Pakete zusammensetzt. In dem hier betrachteten Fall sind dies durch die Physical Layer 2 Bytes, durch die Data Link Layer 6 Bytes und durch die Transaction Layer 16 Bytes (vgl. Kapitel 3.3). Aus diesen Parametern kann wie folgt die Paketeffizienz berechnet werden:

\[Paketeffizienz=\frac{Nutzdatenmenge}{Nutzdatenmenge+Overhead}\]

Aus dem Overhead im hier betrachteten Fall ergeben sich die in Tabelle 4.5 beispielhaft dargestellten Werte. Wie in 4.5 erkenntlich verlauft die Paketeffizienz nicht linear zur Nutzdatenmenge. So erreicht eine Nutzdatenmenge von 4 Bytes nur eine Effizienz von 14,29% und bei einer Datenmenge von 16 Bytes bereits 40%. Bei sehr grossen Nutzdatenmegen ist der Effizienzunterschied nicht mehr signifikant, so erreicht eine Nutzdatenemge von 1024 Bytes bereits eine Effizienz von 97,71% und eine Vervierfachung der Datenmenge erhoht die Effizienz um nicht einmal zwei Prozentpunkte.

Die Betrachtung der Paketeffizienz ist elementar fur die Bewertung der Kommunikation, da der Datendurchsatz bei einer Nutzdatenemenge von 4 Bytes auf 14,29% der Datenubertragungsrate nach oben beschrankt wird. Wenn nur sehr wenige Daten ubertragen werden, kann die maximale Leistung von PCIe also nicht ausgenutzt werden. Eine genaue Berechnung des Datendurchsatzes erfolgt in Kapitel 6.2.2.

Eine andere wichtige Masszahl zur Bewertung einer Schnittstelle ist die Latenz. Diese Metrik wird auch Verzogerungszeit genannt und gibt die Zeitspanne an, wie lange ein Signal vom Sender bis zum Empfanger fur die Ubertragung benotigt. In dem vorliegenden Fall betrifft dies die Kommunikationszeit zwischen Logik auf dem FPGA und Anwendung auf dem Host PC. Damit verbunden ist die Round Trip Time (RTT), welche die Zeitspanne beschreibt, die ein Paket benotigt, um den Weg vom Sender zum Empfanger und wieder zuruck zu durchlaufen.

Bei der Konfiguration von FPGAs ist immer der Ressourchenbedarf einer Anwendung ein wichtiger Aspekt der Bewertung. Fur die Schnittstelle ist die Laufzeit der Konfiguration des FPGAs ein wichtiger Gesichtspunkt, um die Tauglichkeit des FPGAs fur den Einsatz als Koprozessor einschatzen zu konnen. Eine zu lange Konfigurationszeit konnte unter Umstanden eine Laufzeitverringerung annihilieren und so effektiv zu einer langeren Zeitspanne bis zu einem Ergebnis fuhren.

Daruber hinaus mussen die Ressourcen des FPGAs effektiv genutzt werden, wofur Stromverbrauch sowie der verbrauchte Platz auf dem FPGA betrachtet werden. Ein moglichst geringer Bedarf an den Ressourcen des FPGAs ist erstrebenswert, da diese nur begrenzt vorhanden sind und fur die Anwendungslogik noch ausreichend zur Verfugung stehen solten.

## Chapter 5 Implementing Implementing

### 5.1 Xillybus Parameter

Im ersten Schritt muss der Xillybus IP Core generiert werden. Hierfur wird ein Revision XL Core fur ein Artix-7 FPGA und einen Host mit Linux Betriebssystem erstellt. Um die Performanz evaluieren zu konnen, benotigt dieser Core eine Geratedatei fur den Upstream und eine Geratedatei fur den Downstream.

Der Upstream wird als asynchron konfiguriert und eine Wortbreite in den FIFOs von 64 Bit festgelegt. Diese Wortbreite muss in der Evaluation beachtet werden, da fur die Ubertragung eines 64 Bit Wortes der gleiche Zeitschlitz benotigt wird wie fur ein kleineres Wort. Ein Zeitschlitz ist dabei die feste Dauer der Ubertragung eines Wortes. Anschliessend mussen die DMA Buffer fur diesen Stream konfiguriert werden. Um Probleme bei der Reservierung des Speichers zu vermeiden, sollten die Buffer aller Streams zusammen unter Linux nicht grosser als 8 MB sein. Die Bufferanzahl sollte moglichst gering gehalten werden, da mehr Buffer zu mehr Interrupts fuhren konnen und damit die Leistung der CPU beeintrachtigen konnen. Allerdings sollte die Grosse eines einzelnen Buffers 128 kB nicht ubersteigen, da sonst ebenfalls Probleme bei der Reservierung des Speichers auftreten konnen (vgl. Kapitel 4.1.2). Um diese Anforderungen moglichst gut zu erfullen, werden fur den Upstream 32 Buffer mit jeweils 128 kB Grosse, also insgesamt 4 MB Speicher, reserviert. Dem Upstream wird der Geratename xillybusread64 gegeben, unter welchem der Stream auf dem Host PC ansprechbar ist.

Der Downstream wird analog konfiguriert, also ebenfalls asynchron mit einer Wortbreite von 64 Bit und mit 32 Buffern von je 128 kB. Um die DMA Bandbreite noch weiter zu optimieren, bietet Xillybus noch die Moglichkeit, Daten auf dem FPGA RAM zu bufferen. Um eine hohe Ubertragungsrate zu erreichen, werden 16 Segmente von je 512 Bytes auf dem RAM des FPGAs reserviert. Analog zum Geratenamen des Upstreams wird dem Downstream der Name xillybuswrite64 zugewiesen.

Die gewahlten Parameter erfullen die gestellten Vorgaben, doch kann jeder Stream bis zu

[MISSING_PAGE_FAIL:28]

### Fpga Code

Wie in [27] bewiesen wurde, hat ein solches neuronales Netz starke Beschrankungen. So kann bereits eine logische XOR Funktion nicht auf diese Art erlernt werden. Eine XOR Funktion gibt genau dann die Ausgabe 1 aus, wenn exakt einer der Eingange den Wert 1 hat. Komplexere Perzeptrons mit mehreren Schichten sind nicht auf diese Weise limitiert [37, S. 22]. Die Limitierung ist darauf zuruckzufuhren, dass ein solches einfaches Perzepton nur konvergent lernen kann, wenn der Trainingsdatensatz linear separierbar ist. Zwei Mengen mit Tupeln der Dimension \(n\) heissen linear separierbar, wenn sie durch eine Hypere ebene getrennt werden. Fur \(n=2\) bedeutet dies, dass eine Gerade existieren muss, welche die beiden Mengen voneinander trennt [25]. Diese starke Einschrankung von einfachen Perzeptrons ist im vorliegenden Fall nicht von Bedeutung, da keine reale Datenverarbeitung notwendig ist und die Trainingsdaten so gewahlt werden konnen, dass das Perzeptron zu einem sinnvollen Ergebnis kommen kann.

Der Aufbau folgt der Beschreibung in Kapitel 4.2.1. Die Eingabefunktion \(net\) addiert die gewichteten Eingaben auf. Dabei folgt die Eingabe des Neurons der Formel:

\[net=\sum_{i=1}^{n}w_{i}x_{i}\]

Die Anzahl an Eingaben wird hierbei mit \(n\) bezeichnet. \(w_{i}\) ist die Gewichtung von Eingabe \(x_{i}\). Als Aktivierungsfunktion \(\varphi\) wird anstelle einer Stufenfunktion eine Sigmoidfunktion verwendet, da diese differenzierbar ist. Um eine Verschiebung der Aktivierungsfunktion zu ermoglichen, wird der variable Bias \(b\) zum Ergebnis der Eingabefunktion addiert. Gewahlt wird die logistische Funktion:

\[\varphi=\frac{1}{1+e^{-(net+b)}}\]

Um das einfache Perzeptron in C umzusetzen, mussen dort zuerst die wichtigsten Parameter festgelegt sowie Funktionen zum Zurucksetzen der Variablen und zum Berechnen der logistischen Funktion implementiert werden. Die Parameter bestimmen die Art und Grosse der Eingabe und Ausgabe. Hierbei ist von Bedeutung, dass FPGAs deutlich effizienter bei der Verarbeitung von Daten in Festkommadarstellung sind als bei Berechnungen mit Fliesskommazahlen [46]. Ausserdem wird die Lernrate bestimmt und die Grosse eines Batches festgelegt. Ein Batch ist die Menge an Beispielen, nach deren Verarbeitung die Gewichtungen der Eingaben und der Bias angepasst werden sollen [37, S. 719-720]. Daruber hinaus wird eine Vorhersagefunktion benotigt, welche aus einer Menge von Eingabedaten eine Ausgabe bestimmt. Die Vorhersagefunktion besteht aus der oben genannten Eingabefunktion und der Aktivierungsfunktion. Die Ausgabe \(o\) der Funktion entspricht der geschatzten Wahrscheinlichkeit, dass den Eingabeparametern \(x_{1}..x_{n}\) die Ausgabe 1 zugeordnet wird. Ein Ruckgabewert von 0,7 entspricht also einer geschatzten Wahrscheinlichkeit von 70% einer Klassifizierung zu Ausgabe 1. Da dieser Wert uber 50% liegt, sagt das Perzeptron also die Klasse 1 als Ergebnis voraus. Diese Codebasis ist in Abbildung 5.2 dargestellt.

Kern des Perzeptrons ist die Traningsmethode. Es existieren verschiedene Methoden fur

[MISSING_PAGE_EMPTY:30]

### 5.3 Blockdesign

Beim Blockdesign werden die IP Cores zusammengefuhrt und verbunden. Insgesamt besteht das Design aus drei Blocken. Der Xillybus IP Core wird wie in Kapitel 5.1 beschrieben konfiguriert und zum Blockdiagramm hinzugefugt. Dieser Block benotigt Verbindungen zu den externen PCIe Ports.

Der zweite Block des Designs wird von der HLS erzeugt und enthalt die Loopback- bzw.

)Perzeptronlogik. Der data_in Port wird mit dem from_host_read_64 Port des Xillybus IP Cores verbunden und data_out mit to_host_write_64. Ausserdem wird ap_rst_n mit to_host_read_64_open verbunden, damit die Logik zuruckgesetzt wird, wenn die xillybus_read_64 Geratedatei geschlossen wird.

Schliesslich wird eine Clock fur die Anwendung benotigt. Dafur wird dem Diagramm ein Clocking Wizard mit einer Ausgangsfrequenz von 100 MHz hinzugefugt. Diese Frequenz wird gewahlt, um moglichst hohe Leistungen zu ermoglichen ohne dabei eine Gefahr von Timingproblemen hervorzurufen. Der Ausgang des Blocks clk_out1 wird mit den Clock Eingangen ap_clk des Xillybus Blocks und des HLS Blocks verbunden. Daruber hinaus wird der reset Eingang des Clocking Wizards mit dem quiesce Ausgang des Xillybus Blocks verbunden, welcher den Wert 1 annimmt, wenn der Xillybus Treiber auf dem Host PC nicht geladen ist.

Ein nach diesem Muster erstelltes Blockdiagramm ist in Abbildung 5.4 dargestellt.

### 5.4 Hostanwendung

Um die optimalen Leistungsdaten der Verbindung zu ermitteln, muss die Anwendung auf dem Host PC einige Regeln beachten.

Nach der Initialisierung der Variablen werden zuerst die Geratedateien (/dev/xillybus_read_64 und /dev/xillybus_write_64) als Read-only bzw. Write-only gefmet. Diese Dateien sind fur die Kommunikation mit dem FPGA notwendig und durfen nicht von einem anderen Programm verwendet werden.

Die read und write Funktionalitaten bekommen eigene Prozesse, um zu erreichen, dass die beiden Richtungen unabhangig voneinander arbeiten und keinesfalls auf die andere warten mussen. Fur diesen Zweck teilt sich der weitere Programmablauf durch fork() in einen Eltern- und einen Kindprozess auf.

### Elternprozess

Der Elternprozess ist fur den Datentransfer zum FPGA hin zustandig und benotigt daher die xillybus_read_64 Datei im weiteren Verlauf nicht mehr. Aus diesem Grund wird sie geschlossen. Anschliessend wird der benotigte Speicher fur die zu ubertragenden Daten im Arbeitsspeicher reserviert. Je nach gewunschter Funktion werden die Daten, welche transferiert werden sollen, mit einer festgelegten Grosse generiert bzw. geladen.

Da nun die Datenubertragung folgt, muss bei einer Leistungsmessung an dieser Stelle die aktuelle Systemzeit gespeichert werden, um spater die Dauer der Ubertragung errechnen zu konnen. Die Daten werden in einer while Schleife in getrennten Teilen in die Gerate-datei geschrieben. Dabei gibt der Ruckgabewert des write() Aufrufs an, wie viele Daten tatsachlich geschrieben wurden. Dem nachsten Aufruf beim nachsten Schleifendurchlauf werden daher nur die noch fehlenden Daten ubergeben. Wichtig ist, dass EINTR Fehler beachtet werden. Diese zeigen an, dass der write() Aufruf durch ein Signal unterbrochen wurde, ohne dass Daten geschrieben werden konnten [23]. Wenn ein solcher Fehler erkannt wurde, wird der Aufruf einfach wiederholt.

Wenn alle Daten geschrieben wurden, ist die Abbruchbedingung der Schleife erfullt und die Ubertragung damit beendet. Bei der Leistungsmessung wird zu diesem Zeitpunkt wieder die Systemzeit ermittelt und die Differenz zwischen End- und Startzeitstempel errechnet. Das hierbei ermittelte Ergebnis entspricht der Zeitspanne in us, welche fur das Schreiben der gewunschten Daten benotigt wurde.

Zum Schluss wird die Geratedatei xillybus_write_64 wieder geschlossen, um sie fur andere Prozesse freizugeben.

### Kindprozess

Fur die Verarbeitung der ankommenden Daten ist der Kindprozess zustandig, daher wird hier die xillybus_write_64 Datei nicht weiter benotigt und geschlossen. Da vorher definiert wurde, in welcher Form und Menge die Daten vorliegen, kann nun passend der Speicher fur die ankommenden Daten reserviert werden.

Eine genaue Messung der Zeitspanne, welche benotigt wird um alle Daten zu lesen, gestaltet sich als schwieriger als beim Schreiben der Daten, da kein genauer Startzeitpunkt ermittelt werden kann. Nur durch eine kunstliche Verzogerung kann garantiert werden, dass bereits Daten zum Lesen bereitstehen, wenn der read() Aufruf getatigt wird.

Wie im Elternprozess werden auch hier wieder solange Daten in einer while Schleife ubertragen, bis die vorher spezifizierte Menge erreicht ist. Im Kindprozess wird jedoch die Kommunikation vom FPGA zum Host abgewickelt und daher die read() Funktion statt der write() Funktion verwendet. Auch hier wird der EINTR Fehler behandelt.

Nachdem die gewunschte Datenmenge ubertragen wurde, wird ein Zeitstempel gespeichert. Mit diesem Zeitstempel kann nun die Dauer des Lesevorgangs (mit der Differenz zumStartzzeitpunkt des Lesevorgangs), sowie die Gesamtdauer der Datenverarbeitung durch das FPGA (mit der Differenz zum Startzeitpunkt des Schreibvorgangs) berechnet werden. Abschliessend wird noch die xillybus_read_64 Datei geschlossen, um diese nicht weiter zu blockieren.

[MISSING_PAGE_EMPTY:36]

## Chapter 6 Evaluation

Bei der Bewertung der entwickelten Schnittstelle werden zunachst die ermittelten Attribute der Konfiguration des FPGAs vorgestellt. Anschliessend werden die Messungen der Performanz der Kommunikation prasentiert und die Werte in dem Kontext von anderen Schnittstellen bewertet. Abschliessend wird die Praxistauglichkeit der realisierten Losung fur Anwendungen im Gebiet des maschinellen Lernens evaluiert.

### 6.1 Konfiguration

Die Konfiguration eines FPGAs ist bedingt durch den Aufbau immer mit einem gewissen Aufwand verbunden. Diese notwendigen Bemuhungen werden im nachsten Abschnitt aufgelistet. Darauf folgend wird dann der Ressourcenbedarf der entwickelten Konfiguration des FPGAs ermittelt und bewertet. Hierzu werden verschiedene Masszahlen zur Beurteilung herangezogen.

#### Realisierungsaufwand

Der Realisierungsaufwand einer Software mit Hardwarebeschleunigung durch ein FPGA, welche uber die entwickelte Schnittstelle kommuniziert, ist immer hoher als der Aufwand bei der Implementierung einer Applikation ohne Hardwarebeschleunigung. Dies ist bedingt durch die Besonderheiten bei der Programmierung von FPGAs und die zusatzliche Schnittstelle nicht anders moglich.

Es muss zusatzlich zur Software auf dem Host PC noch eine weitere Anwendung fur den Einsatz auf dem FPGA implementingert werden. Der entwickelte Code fur die FPGA Seite muss dabei noch durch die HLS ubersetzt, wenn nicht sogar von Grund auf in einer Hardwarebeschreibungssprache wie Verilog oder VHDL programmiert werden.

Anschliessend muss der so erzeugte Block in das Blockdiagramm eingefugt und mit bestehenden Elementen verbunden werden. Es muss darauf geachtet werden, dass das gesamte Blockdesign nicht die Begrenzungen des FPGAs ubersteigt. Insbesondere ist zu beachten,dass das FPGA genugend LUTs fur die entworfene Konfiguration bereitstellt.

Fur die Synthese von Applikationen in Vivado wurden im Durchschnitt auf dem eingesetzten Laptop 14 Minuten benotigt. Dies ist bei jeder Neukonfiguration des FPGAs notwendig.

Ausserdem muss der Host PC neu gestartet werden, damit der Treiber korrekt geladen ist und die Kommunikation mit dem FPGA funktioniert. Dies nahm bei den durchgefuhrten Versuchen weitere zwei Minuten in Anspruch.

Daruber hinaus muss die Software auf dem Host PC mit Funktionen fur die Kommunikation mit dem FPGA ausgestattet werden.

Dieser Aufwand bei der Umsetzung einer Anwendung muss immer beachtet werden. Fur einfache Anwendungen mit kurzer Laufzeit lohnt sich eine Beschleunigung durch einen Koprozessor daher nicht. Die vorgestellte Schnittstelle hat diesen Aufwand jedoch auf ein Minimum reduziert, so werden dem Entwickler einer Anwendung die meisten Aufgaben beim Entwurf der Kommunikation von dem vorhandenen Grundgerust abgenommen. Die Anbindung an die Software auf dem Host PC wird durch das Unterstutzen von Lesse/Schreibbefehlen jeder Art (_read()_ und write()_ in C) hochgradig vereinfacht.

#### 6.1.2 Ressourcenbedarf

Im Gebiet des maschinellen Lernens ist der Ressourcenbedarf eines Systems eine wichtige beschrankende Grosse. Daher sollten bei der Umsetzung von Applikationen in diesem Gebiet die benotigten Mittel betrachtet werden. Vivado bietet zur Abschatzung des Strombedarfs einige automatisiert generierte Berichte, deren Inhalt gruppiert nach Anwendung im Folgenden kurz prasentiert werden soll. Anschliessend wird die Auslastung der Ressourcen des FPGAs ermittelt und vorgestellt.

#### Energieverbrauch Loopback

Bei Umsetzung der Loopback Anwendung hat das FPGA einen Leistungsbedarf von insgesamt 1,26 W. Diese Leistung wird hauptsachlich fur die PCIe Kommunikation benotigt, da die Anwendung an sich sehr simpel ist. Insgesamt 0,68 W bzw. 53% benotigten die vier PCIe Transceiver, welche fur jede Lane notwendig sind. 0,06 W bzw. 5% benotigt der Xilinx PCIe Block fur den Datentransfer. 0,15 W (12%) der Gesamtleistung sind statische Leistung des Gerates, womit noch insgesamt 30% der Leistung fur dynamische Zwecke ubrig bleiben.

Der Mixed-Mode Clock Manager (MMCM), welcher fur die Generierung von benutzerdefinierten Clocks notwendig ist, verbraucht von diesem dynamischen Teil 57% (17% oder 0,21 W der Gesamtleistung). 20% (6% der Gesamtleistung) sind auf weitere clockbezogene Zwecke zuruckzufuhren, womit zusatzliche 0,08 W verbraucht werden. Fur speicherbezogene Dienste werden 5% der Gesamtleistung (0,06 W) aufgebracht, womit nur jeweils 1% fur Signale und Logik verbleiben.

Anhand der Ubersicht der Leistungsaufnahme in Abbildung 6.1 ist erkennbar, dass bei der Loopback Anwendung der Grossteil der Leistung von PCIe-bezogenen Teilen verbraucht wird. Dies ist aufgrund des simplen Aufbaus der Applikation leicht nachvollziehbar. Bei anspruchsvollenen Anwendungen ist eine hohere Leistungsaufnahme zu erwarten, eine niedrige als die hier genannte ist jedoch mit dieser PCIe Schnittstelle nicht realisierbar.

##### Energieverbrauch Perzeptron

## 6.2). Der Grund
Die Umsetzung des Perzeptrons auf dem FPGA ist deutlich komplexer als die Loopback Anwendung. Daher ist auch ein hoherer Energiebedarf zu erwarten. Der gesamte Energiebedarf liegt bei der Perzeptron Anwendung mit 1,64 W ungefahr 30% uber dem der Loopback Anwendung (Siehe Abbildung  dafur ist der deutlich hohere Bedarf an Logikschaltungen. Im Vergleich zur Loopback Anwendung ist der Anteil am Gesamtenergiebedarf der Logik achtmal hoher und der Anteil der kommunikationsbezogenen Teile ist geringer. Im Gegensatz zur Loopback Konfiguration werden ausserdem DSPs benotigt, welche nun 4% der Gesamtleistung ausmachen.

Insgesamt lasst sich also feststellen, dass mit steigender Komplexitat der Logik der Anteil der Schnittstelle am Energiebedarf sinkt. Da die Perzeptron Anwendung die Grenzen des FPGAs bei weitem nicht ausnutzt (vgl. auch der folgende Abschnitt,,FPGA Auslastung"), wird erwartet, dass bei einer anspruchsvollenen Logik der Energiebedarf der Schnittstelle weiter in den Hintergrund tritt.

## FPGA Auslastung

Bei der Entwicklung von Anwendungen fur GPPs wird in der Regel nicht die Architektur des Prozessors in den Entwicklungsprozess einbezogen. Die Software ist in der Regel mit jedem Prozessor ausfuhrbar, nur die Laufzeit kann sich unterscheiden. Der Entwurf einer Konfiguration fur die Ausfuhrung auf einem FPGA folgt einem anderen Ablauf. So ist es ein elementarer Bestandteil der Konfiguration, dass gepruft wird, ob das FPGA die erstellte Konfiguration uberhaupt ausfuhren kann. Wenn die Ressourcen des FPGAs in einer Hinischt nicht ausreichen (z. B. wenn nicht genugend Block RAM zur Verfugung steht), kann die Anwendung so nicht ausgefuhrt werden und muss angepasst werden, bis das FPGA sie bewaltigen kann.

Aus diesem Grund sollte die PCIe Schnittstelle moglichst wenige Ressourcen des FPGAs in Anspruch nehmen, da andernfalls Probleme bei der Integration von Anwendungsgik auftreten konnen. In Abbildung 6.3 sind die ermittelten Werte der Auslastung fur die beiden entwickelten Anwendungen aufgelistet. Diese werden im Folgenden erlautert.

Wie in Kapitel 2.1 dargestellt wurde, sind LUTs ein elementarer Bestandteil eines FPGAs. Die Leistungsfahigkeit eines FPGAs hangt stark von der Anzahl an LUTs ab, da diese Logikoperationen durchfuhren konnen oder als Speicher dienen. Wenn eine Konfiguration zu viele LUTs benotigt, lasst sie sich nicht auf das FPGA programmieren, da nicht die notwendigen Ressourcen im Chip verbaut sind.

Bei der Loopbackanwendung wurden 4.914 LUTs fur Logikfunktionen und 328 als Speicher verwendet. Dies stellt eine sehr geringe Auslastung dar, es bleiben noch 96,11% der LUTs ungenutzt. Dieser hervorragende Wert zeigt, dass mit der Schnittstelle komplexe Anwendungen umgesetzt werden konnen, welche viele LUTs benotigen. Die Konfiguration der Perzeptron Anwendung unterstreicht diesen Eindruck, da auch nach Integration dieserLogik noch 85,61% der LUTs ungenutzt bleiben. Das FPGA ist also in dieser Hinsicht bei weitem noch nicht ausgelastet und mit der Schnittstelle sind auf dem FPGA noch aufwendigere Anwendungen moglich.

Ein weiterer Grundbaustein von FPGAs sind die Flip-Flops. Diese konnen jeweils ein Bit abbilden und bilden in Gruppen sogenannte Register. In diesen Registern konnen Daten zwischengespeichert oder weitergeleitet werden [43]. Das verwendete FPGA in der evaluierten Konfiguration stellt pro LUT zwei Register zur Verfugung und bietet damit insgesamt 269.200 Register.

Von dieser Menge wurden bei der Loopback Applikation insgesamt 6.652 Flip-Flops in Registern benotigt, was noch 97,53% ungenutzt lasst. Bei der Perzeptron Anwendung steigert sich der Bedarf auf 19.661, doch in gleicher Weise bleibt hier noch ein hoher Anteil (92,7%) frei. Auch dieser Wert lasst darauf schliessen, dass die realisierte Schnittstelle noch viel Potenzial fur die Umsetzung von diffizilen Algorithmen bietet.

Das AC701 Evaluation Board verfugt uber insgesamt 365 Block RAM Einheiten. Diese sind eine Art Arbeitsspeicher und ermoglichen das Zwischenspeichern von Daten auf dem FPGA. Die festen Speichereinheiten konnen Logikzellen sparen und damit komplexere Anwendungen ermoglichen. 14 Einheiten werden von den beiden Designs verwendet, womit noch 96,16% der verfugbaren Elemente verbleiben.

Weiterhin verfugt das FPGA noch uber 400 I/O Blocke, wovon bei den beiden Konfigurationen drei als Master und zwei als Slave Pads verwendet werden. Diese geringe Anzahl lasst sich damit erklaren, dass die PCIe Transceiver andere Pins verwenden, sogenannte Gigabit Transceiver I/O Pins, und keine anderen Kommunikationswege verwendet werden. Insgesamt lasst sich feststellen, dass sehr wenige Ressourcen des FPGAs fur die Schnittstelle benotigt werden. Dies ist fur den Einsatz in praktischen Anwendungen sehr wichtig, da hier fur die Anwendungslogik auf diese Weise viele Mittel bereitstehen. Ein hoher Ressourcenbedarf hingegen wurde die Umsetzung von einigen Applikationen erschweren.

### Ubertragungsleistung

Wie in Kapitel 4.2.2 beschrieben eigenen sich vor allem die Masszahlen Latenz, RTT und Datendurchsatz fur eine Evaluation der Schnittstelle. In den folgenden Abschnitten werden daher die ermittelten Werte fur verschiedene Datentransfers vorgestellt und bewertet.

#### Verzogerungszeiten

Die Latenz einer Schnittstelle ist ein wichtiges Bewertungsmass, da mindestens diese Zeitspanne bei jeder Kommunikation anfallt, unabhangig davon, welche Daten ubertragen werden und welchen Zustand der Hostrechner und das FPGA haben. Die Latenz sollte daher moglichst gering sein, um nur minimale Verzogerungen zwischen dem Versenden der Daten vom Host PC bis zur Verarbeitung der Daten am FPGA hinnehmen zu mussen.

Die vorgestellte Schnittstelle wird sowohl im Hinblick auf die Latenz als auch im Hinblick auf die RTT untersucht. Dafur wird ein einzelnes Paket versendet und die Zeit gemessen, bis es wieder am Absender ankommt. Im Gegensatz zur Latenz ist fur die RTT auch die Zeit relevant, welche fur das Lesen und Zurucksenden auf der Seite des Empfangers benotigt wird. Die RTT ist damit immer grosser oder gleich zur zweifachen Latenz. Fur beide Maszahlen werden jeweils 100 Versuche durchgefuhrt und der Durchschnittswert prasentiert.

Die durchschnittliche Latenz der Schnittstelle betragt 49,14 us. Werte von dieser Grossenordnung sind jedoch nur erreichbar, wenn nach dem Schreibbefehl der beschriebene Buffer manuell ubergeben wird (wie in Kapitel 4.1.3 beschrieben erfolgt dies mit einem leeren Schreibbefehl). Ansonsten erhoht sich die Latenz um 10 ms, da ein nicht komplett gefullter Buffer erst nach dieser Zeitspanne ubergeben wird.

Der ermittelte Durchschnittswert der RTT betragt 101,78 us. Da es sich allgemein bei der RTT um eine sehr kurze Zeitspanne handelt, in der das Verhalten der CPU nicht vorhergesagt werden kann, weist sie eine hohe Varianz auf. Die niedrigste gemessene RTT betragt 37 us und die hochste RTT betragt 204 us. Da die CPU jederzeit durch andere Prozesse blockiert werden kann, ist eine solche Streuung nicht zu vermeiden, wenn nicht auf einer niedrigen Betriebssystemehene ein eigener Treiber umgesetzt wird. Insgesamt wird somit deutlich, dass die Schnittstelle eine RTT von weit unter einer Millisekunde besitzt, welche jedoch trotzdem bei dem Einsatz beachtet werden sollte. Operationen mit einer Ausfuhrungszeit von unter 99 us konnen nicht durch Nutzung des FPGAs als Koprozessor beschleunigt werden, es sei denn sie werden fur viele Daten hintereinander ausgefuhrt. Dann kann die parallele Datenverarbeitung wieder einen Laufzeitvorteil hervorrufen. Es sollten Algorithmen vermieden werden, bei denen die an den Koprozessor ubermittelten Werte von vorherigen Ergebnissen des Koprozessors abhangen. Ansonsten addieren sich die Latenzen fur jede Ubertragung auf, was die Laufzeit des Algorithmus verschlechtert.

#### Datendurchsatz

Die entwickelte Schnittstelle soll in Anwendungen eingesetzt werden, bei denen grosse Datenmengen auf das FPGA ubertragen werden mussen. Die benotigte Zeit fur den Datentransfer soll moglichst kurz gehalten werden, um den Geschwindigkeitsvorteil einer Hardwarebeschleunigung durch ein FPGA zu erhalten. Ein wichtiges Kriterium fur die Bewertung der Schnittstelle im Hinblick darauf, ob sie sich fur den praktischen Einsatz eignet, ist, wie schnell Daten ubertragen werden konnen.

Um die Leistungsfahigkeit verlasslich einschatzen zu konnen, werden Messreihen mit verschiedenen Parameter durchgefuhrt. Dabei wird jede Parameterkombination 100 Mal ausgefuhrt, damit Ausreisser und der Einfluss von Messungenauigkeiten minimiert werden. Unterschiede in den einzelnen Messungen sind vor allem durch die CPU des Host PCs zuerklaren, deren Verhalten nicht zuverlassig vorhergesagt werden kann. Die Ausfuhrung des Host Prozesses wird so, z. B. durch die CPU Auslastung, aufgrund von anderen laufenden Prozessen, beeinflusst.

Die beiden wesentlichen Parameter sind die Paketgrose und die Paketanzahl. Die Paketgrose beschreibt die Datenmenge, welche in einem Datenpaket enthalten ist, das an das FPGA gesendet werden soll. Der kleinste betrachtete Wert ist hierbei 8 Bytes, was (in der eingesetzten Programmiersprache C) einer einzelnen Variable des Typs,,long long" entspricht. Diese Paketgrose ist nicht mit der Grosse des PCIe Pakets zu verwechseln. Die Grosse des PCIe Pakets kann nur muhsam beeinflusst werden, da die PCIe Kommunikation von dem Xillybus Treiber abgewickelt wird. Eine Moglichkeit, die Paketgrose zu kontrollieren, ist, nach jedem write() Aufruf mit einer gewahlten Datenmenge erneut write() mit einem leeren Datenparameter aufzurufen. Wie in Kapitel 4.1.3 erlautert hatte dies eine sofortige Ubergabe des beschriebenen Buffers an den Xillybus IP Core auf dem FPGA zur Folge. Da ein solches Verhalten in der Praxis jedoch nicht gewunscht ist und der Fokus dieser Arbeit auf einer realitatsbezogenen Wertung der Schnittstelle liegt, wird diese Moglichkeit nicht weiter betrachtet. In produktiven Anwendungen ist der genaue Ablauf des Datentransfers nicht relevant, lediglich die effektive Dauer der Ubertragung ist von Bedeutung.

In Abbildung 6.4 ist der erreichte Datendurchsatz bei dem Transfer von sehr kleinen (8 Bytes) und sehr grossen (800 kB) Paketen dargestellt. Dabei entspricht der Datendurchsatz (in MB/s) jeweils dem Wert fur die Ubertragung vom Host zum FPGA. Wenn die Schnittstelle doppelt durchlaufen wird, also alle Daten zum FPGA und zuruck gesendet werden, entspricht der Datendurchsatz fur den kompletten Weg dem jeweils halben Wertdes Dargestellten.

Deutlich erkennbar ist, dass die Schnittstelle bei kleinen Datenmengen noch nicht ihre volle Geschwindigkeit erreicht. Bis zu einer Datenmenge von 20 MB liegt der erzielte Durchsatz noch zum Teil deutlich unter 400 MB/s. Ab ungefahr 40 MB ubertragenen Daten nahert sich der Durchsatz seinem Maximalwert von ungefahr 500 MB/s nur noch langsam. Bei den durchgefuhrten Tests ist eine Konvergenz gegen diesen Wert erkennbar.

Wie zu erwarten ist die Varianz bei den geringen Datenmengen hoher, da bei insgesamt kurzen Ubertragungen die unvorhersehbare Prozessausfuhrung des Host Rechners einen hoheren Einfluss auf das Ergebnis hat.

Ausserdem wird deutlich, dass die Paketgrose im Gegensatz zur Datenmenge keinen Einfluss auf die effektive Ubertragungsgeschwindigkeit hat. Uber das gesamte Spektrum an betrachteten Datenmengen sind die erzielten Durchsatzgeschwindigkeiten nahezu kongruent. Somit ist die Schnittstelle gleichermassen fur Anwendungen mit hoher Paketgrose sowie fur Anwendungen mit geringer Paketgrose geeignet. Beispielhafte Messungen des Datendurchsatzes bei realen Datensatzen folgen in Kapitel 6.4.

### 6.3 Performanz des Perzeptrons

Nachdem ein einfaches Perzeptron wie in Kapitel 5.2.2 beschrieben implementiert wurde, soll dieses nun evaluiert werden. Dafur wurde es mit einer selbsterstellten Trainingsdatenmenge trainiert. Die Beispiele in dieser Menge bilden das Verhalten eines logischen OR Gatters ab, die Ausgabe ist also 1, wenn mindestens einer der Eingange den Wert 1 hat. Die Menge umfasst 100.000 Elemente, welche aus den moglichen Ein-/Ausgabekombinationen eines solchen Gatters in zufalliger Reihenfolge zusammengesetzt sind. An das Perzeptron werden beim Training also fur jedes Trainingselement jeweils 8 Bytes ubertragen, um den gewunschten Modus (Training) anzugeben und jeweils 8 Bytes fur jede Ein-/Ausgabe. Bei zwei Eingaben betragt die Beispielgrosse demnach 32 Bytes.

Die Messungen der benotigten Zeiten wurde jeweils 100 Mal vorgenommen und die errechneten Mittelwerte folgend prasentiert. Fur das Training mit der kompletten Trainingsdatenmenge wurden 167,52 ms benotigt. Dies entspricht einer Rate an Datenverarbeitung von 19,10 MB/s. Da diese Rate deutlich unter den beobachteten Ubertragungsraten liegt, muss der Grund fur diese verhaltnismagig langsame Verarbeitung in der Ausfuhrung der Trainingsmethode liegen. Diese These wird durch einen Versuch validiert, in welchem die selbe Datenmenge im Vorhersagemodus ubertragen wurde. Es wurde also der Parameter fur den Modus so gesetzt, dass das Perzeptron nicht trainiert wird, sondern Vorhersagen macht. Da die Berechnung der Vorhersage weniger Rechenschritte benotigt als das Training, wird hier eine hohere Verarbeitungsrate erwartet. Diese Erwartung bestatigt sich, da in diesem Modus fur die Ubertragung im Durchschnitt 95,62 ms benotigt wurden, was einer Verarbeitungsrate von 33,47 MB/s entspricht. Bei Messungen der Ubertragungsdauerohne Anwendungslogik auf dem FPGA wurden im Durchschnitt Verarbeitungszeiten von 14,43 ms erreicht. Dies zeigt, dass die Transferzeit der Daten nur einen geringen Anteil an der gesamten Laufzeit hat.

Die Geschwindigkeit der Verarbeitung ist also mehr von der Implementierung und Optimierung der Logik abhangig als von der Schnittstelle. Die Schnittstelle ist bei der untersuchten Anwendung nicht der limitierende Faktor. Da der Fokus der Arbeit nicht auf einer effizienten Implementierung eines Perzeptrons liegt, gibt es an dieser Stelle noch grosses Optimierungspotenzial. So konnte der Code, welcher fur die HLS verwendet wurde, noch fur die Ausfuhrung auf einem FPGA angepast werden. Ausserdem konnten mehrere (gegebenenfalls identische) Perzeptrons in das Blockdesign integriert und mit der Schnittstelle verbunden werden, um parallel mehr Daten zu verarbeiten.

Funktional sind die Implementierung und das Training als erfolgreich zu bewerten, da nach Verarbeitung der Trainingsdatenmenge zu allen vier Eingabekombinationen der beiden Parameter die gewunschte Ausgabe vorhergesagt wird. Die logische OR Funktion wird also korrekt abgebildet.

### Praxistauglichkeit

Die entwickelte Schnittstelle soll fur Applikationen auf dem Gebiet des maschinellen Lernens eingesetzt werden. Da sie eine flexible Losung darstellt und nicht fur einen speziellen Anwendungsfall entwickelt ist, soll sie moglichst einfach und gut in unterschiedliche Projekte integrierbar sein.

Eine Starke der Schnittstelle ist daher, dass die Hostanwendung in nahezu jeder Programmiersprache entwickelt werden kann. Die Kommunikation mit dem FPGA wird durch das Schreiben und Lesen von Dateien ubernommen, einer Funktion, die von praktisch allen Hochsprachen unterstutzt wird. Damit kann die Schnittstelle auch gut in bereits bestehen-de Anwendungen integriert werden, da der bereits enwickelte Code nicht in eine spezielle Sprache ubersetzt werden muss.

Ausserdem mussen beim Einsatz der Schnittstelle weder der Aufbau noch die Besonderheiten von PCIe erlernt werden, die Verbindung kann daher als Black Box angesehen werden, deren inneres Verhalten fur den Einsatz nicht beachtet werden muss. Wie in Kapitel 6.2.2 gezeigt muss auch die Paketgrose der Eingabe nicht optimiert werden, um eine performantte Verbindung zu erreichen.

Im praktischen Einsatz mussen bei Anwendungen im Gebiet des maschinellen Lernens haufig grosse Datensatze zum FPGA ubertragen werden [21]. Damit die Leistung der Schnittstelle realitatsnah verdeutlicht wird, werden verschiedene gangige Datensatze ubertragen und dabei die Geschwindigkeit der Schnittstelle gemessen. In Abbildung 6.5 sind die betrachteten Datensatze aufgelistet. Bei der Auswahl wurde darauf geachtet, dass die Datensatze aus verschiedenen Fachgebieten stammen und die Daten unterschiedlich zusammengesetzt sind.

Der MNIST Datensatz besteht aus Bildern von handgeschriebenen Ziffern. Diese sind als 28*28 Pixel Matrix hinterlegt, wobei jedes Pixel als Graustufendarstellung einen Byte belegt. Im Trainingsdatensatz sind 60.000 Bilder enthalten, womit die Gesamtgröse 47,04 MB betragt [22]. Mit dem Datensatz wurden bereits verschiedene Lernmethoden, wie beispielsweise neuronale Netze oder Support Vector Machines, umgesetzt und die Mustererkennung evaluiert [10]. Ein weiterer Datensatz, welcher hauptsachlich fur Mustererkennung verwendet wird, ist der Covertype Datensatz. Dieser enthalt 581.012 Beispiele, bestehend jeweils aus 54 Merkmalen, wovon zehn jeweils als Gleitkommazahl (vier Bytes) und 44 als Binarwert vorliegen. Die Binardaten wurden im vorliegenden Fall als sechs Bytes codiert. Dieser Datensatz wird verwendet, um mittels Methoden des maschinellen Lernens verschiedene Bewaldungsarten zu erkennen [5]. Verfugbar ist der Datensatz im UCI Machine Learning Repository [11]. Ebenso ist CIFAR-10 [18] ein etablierter Datensatz aus dem Gebiet der Bilderkennung. Er enthalt 60.000 32*32 Bilder, wobei von jedem Pixel der Rot-, Grun- und Blauwert als 8 Bit Integer hinterlegt ist. Dieser Datensatz ist eine Untermenge aus einer Datenbank von 80 Millionen Bildern [44].

Aus dem Anwendungsgebiet Physik werden Daten verwendet, die vom First G-APD Cherenkov Telescope (FACT) [2] gesammelt wurden. Von den uber 600 TB an gesammelten Daten wurde ein Datensatz von 200.000 Beispielen mit jeweils 22 Merkmalen in Form von Gleitkommazahlen gewahlt. Daruber hinaus wird ein Datensatz betrachtet, welcher in der,,Higgs Boson Machine Learning Challenge" veroffentlicht wurde. Dabei handelt es sich um Daten, die vom ATLAS Teilchendetektor am Large Hadron Collider von der Kernforschungsorganisation CERN gesammelt wurden. Der Trainingsdatensatz umfasst 250.000 Beispiele mit 30 Merkmalen, welche als Gleitkommazahl vorliegen [4]. Die ausgewahlten Datensatze haben nur wenige Merkmale, was charakteristisch fur Daten aus der Physikist. Da haufig die Merkmale jedoch als Gleitkommazahlen vorliegen, ist die Beispielgrose trotzdem nicht klein.

Als letztes wird noch ein typischer Datensatz aus dem Bereich der Verarbeitung von naturlichsprachlichen Texten gewahlt. Der IMDb Datensatz wurde fur die Sentimentanalyse entwickelt, bei welcher erkannt werden soll, ob die Rezension eines Films positiv oder negativ ist. Der Trainingsdatensatz enthalt 25.000 Beispiele mit jeweils 10.000 Merkmalen, die als Integer hinterlegt sind [24]. Dies ergibt eine Gesamtgrosse von 500 MB. Bei der Verarbeitung von naturlichsprachlichen Texten sind solche hochdimensionalen Daten gangig und stellen damit teilweise eine besondere Herausforderung dar.

In Abbildung 6.5 sind die erreichten Ubertragungsleistungen von der Schnittstelle mit den genannten Datensatzen dargestellt. Hier wird jeder Datensatz 100 Mal ubertragen und dieermittelten Durchschnittswerte werden prasentiert. Dabei wird deutlich, dass die Komposition der Daten keinen Einfluss auf den Datendurchsatz zu haben scheint. Lediglich die Gesamtgrosse des Datensatzes beeinflusst die Ubertragungsgeschwindigkeit. So erreicht die Schnittstelle eine hohere Geschwindigkeit, je mehr Daten ubertragen werden mussen. Dies ist ein sehr positives Ergebnis fur die Bewertung der Schnittstelle im praktischen Einsatz, da sie unabhangig von der Zusammensetzung der Daten einen konstanten Durchsatz erreicht. Ausserdem bleiben alle Transferzeiten unter zwei Sekunden, also konnen gangige Datensatze mit der Schnittstelle in kurzer Zeit auf das FPGA ubertragen werden.

## Chapter 6 Evaluation

## Kapitel 7 Fazit und Ausblick

In dieser Arbeit wurde eine PCIe Schnittstelle fur die Kommunikation mit einem FPGA realisiert. Diese Schnittstelle wurde im Hinblick auf eine Anwendung im Bereich des maschinellen Lernen evaluiert. Die besonderen Anforderungen an eine Schnittstelle in diesem Fachbereich wurden dabei berucksichtigt. Das Ziel einer praxisnahen Umsetzung wurde erreicht, indem ein geeignetes Framework ermittelt wurde. Anschliessend wurde eine Schnittstelle realisiert und ein einfaches Perzeptron als Beispielanwendung umgesetzt. Die Schnittstelle wurde mit realen Datensatzen aus dem Bereich des maschinellen Lernens getestet.

Die entwickelte Schnittstelle hat bei praxisnahen Versuchen einen Durchsatz von fast 480 MB/s erreicht. Diese Geschwindigkeit ermoglicht es, innerhalb kurzer Zeit gangige Datensatze aus verschiedenen Anwendungsgebieten zu ubertragen (vgl. Kapitel 6.4). Der erreichte Datendurchsatz erweist sich also als gut und ermoglicht eine Anwendung bei Algorithmen im Gebiet des maschinellen Lernens. Die minimale Latenz bei der Datenubertragung lag bei 49,14 us. Diese Latenz ist niedrig genug, um die Laufzeit von produktiven Applikationen nicht erheblich zu erhohen. Operationen mit einer sehr kurzen Laufzeit (geringer als die RTT) konnen jedoch nicht durch Einsatz eines FPGAs und dieser Schnittstelle beschleunigt werden.

Es konnte gezeigt werden, dass die Schnittstelle vielseitig einsetzbar ist, da sie nicht fur einen spezifischen Algorithmus optimiert wurde. Unabhangig von der zu ubertragenden Datenmenge und Datenzusammensetzung lassen sich kurze Ubertragungszeiten erreichen. Da die betrachtete Verbindung wenige Ressourcen auf dem FPGA belegt (vgl. Kapitel 6.1.2), sind Berechnungen mit hohem Ressourcenbedarf auf dem FPGA umsetzbar. Ein besonderer Vorteil der Schnittstelle ist die Kompatibilitat zu vielen Programmiersprachen, wodurch sie flexibel einsetzbar ist. Auch in bestehende Projekte kann die Schnittstelle so integriert werden.

Perspektivisch sind die erreichten Leistungen bei der Realisierung eines einfachen Perzeptrons jedoch noch optimierbar. Durch sorgfaltige Anpassung der HLS Parameter konnte die Anwendung weiter beschleunigt werden. Ausserdem konnten mehrere Instanzen gleichzeitig in das Design integriert werden, wodurch die Datenverarbeitung parallelisiert und damit der Datendurchsatz gesteigert werden konnte. Daruber hinaus bietet ein einfaches Perzeptron zwar eine gute Moglichkeit zur Evaluation der Schnittstelle, doch das Leistungspotenzial des FPGAs wird bei weitem nicht ausgenutzt. Da die Schnittstelle sehr ressourcenschonend umgesetzt ist, konnen auch komplexere Strukturen wie neuronale Netze mit mehreren Neuronen und Schichten realisiert werden.

Gefordert war eine Kommunikationsmoglichkeit, die den Aufwand der Umsetzung einer Anwendung mit einem FPGA erleichtert. Wenn eine Methode aus dem Bereich des maschinellen Lernens durch ein FPGA als Koprozessor beschleunigt werden soll, eignet sich die vorgestellte Schnittstelle sehr gut. Die Schnittstelle ermoglicht eine Abstraktion der Kommunikation, wodurch der Fokus weiterer Arbeiten auf der Implementierung von Algorithmen mit Beschleunigung durch das FPGA liegen kann. Ausserdem kann ein hoher Durchsatz erreicht werden, wenn die Logik auf dem FPGA die ubermittelten Daten schnell verarbeiten kann.

Es wurde gezeigt, dass die Schnittstelle bei der Umsetzung eines sequenziellen Algorithmus mit geringen Datenmengen unter Umstanden eine hohe Latenz aufweisen kann. Die Reduzierung dieser Latenz sollte in Folgearbeiten untersucht und wenn moglich reduziert werden. Als Ansatz kann hierbei die Realisierung eines eigenen Treibers im Betriebssystemkernel verfolgt werden.

Mit modernerer und leistungsstarkerer Hardware sind ausserdem noch bessere Ubertragungsdaten zu erwarten. Die PCIe Version 5.0, welche sich in der Entwicklung befindet, erreicht Symbolraten von 32 GT/s und der modernere Leitungscode 128b/130b reduziert den Overhead von 20% (bei 8b/10b) auf ungefahr 1,54% [1]. Bei Ausnutzung von 16 Lanes ist die theoretisch mogliche Datenrate mehr als 30 Mal hoher als die der hier betrachteten Version 2.1 x4.

Zusammenfassend lasst sich sagen, dass die angestrebte PCIe Schnittstelle zur Kommunikation mit einem FPGA erfolgreich und sehr ressourcenschonend umgesetzt werden konnte. Sie genugt den Anforderungen des maschinellen Lernens an eine Schnittstelle vollkommen und weist hinsichtlich des Datendurchsatzes und der niedrigen Latenz sehr gute Ergebnisse auf. Sie ist somit vielfaltig einsetzbar und zukunftstauglich, da durch leistungssatkere Hardware und sorgfaltige Optimierung der Konfiguration perspektivisch noch hohere Uberragungsraten erzielt werden konnten.

## Bibliography

* [1]

[MISSING_PAGE_EMPTY:52]

## References

* [1]Alcorn, Paul: _PCIe 5.0 Is Ready For Prime Time._ Tom's Hardware, Januar 2019. https://www.tomshardware.com/news/pcie-4.0-5.0-pci-sig-specification, 38460.html. Online, Eingesehen am 23.01.2019.
* the first G-APD Cherenkov telescope_. Journal of Instrumentation, 8(06):P06008-P06008, Juni 2013.
* [3]Baker, Z. K. und V. K. Prasanna: _Efficient hardware data mining with the Aprio-ri algorithm on FPGAs._ In: _13th Annual IEEE Symposium on Field-Programmable Custom Computing Machines (FCCM'05)_, Seiten 3-12, April 2005.
* [4]Baldi, Pierre, Peter Sadowski und Daniel Whiteson: _Searching for Exotic Particles in High-Energy Physics with Deep Learning_. Nature communications, 5:4308, Juli 2014.
* 151, 1999.
* [6]Byford, Sam: _Google's AlphaGo AI beats Lee Se-dol again to win Go series 4-1._ https://www.theverge.com/2016/3/15/11213518/alphago-deepmind-go-match-5-result, Marz 2016. The Verge, 15. Marz 2016, Online, Eingesehen am 21.02.2019.
* [7]Chen, J. X.: _The Evolution of Computing: AlphaGo._ Computing in Science Engineering, 18(4):4-7, Juli 2016.
* [8]Cormen, Thomas H., Charles E. Leiserson, Ronald L. Rivest und Clifford Stein: _Introduction to Algorithms_, Kapitel 10.1, Seiten 232-235. MIT Press, 3. Auflage, Juli 2009.
* [9]DeHon, Andre: _Balancing Interconnect and Computation in a Reconfigurable Computing Array (or, Why You Don't Really Want 100% LUT Utilization)_. In: _Proceedingsof the 1999 ACM/SIGDA Seventh International Symposium on Field Programmable Gate Arrays_, FPGA '99, Seiten 69-78, New York, NY, USA, Februar 1999. ACM.
* [10]Deng, L.: _The MNIST Database of Handwritten Digit Images for Machine Learning Research [Best of the Web]_. IEEE Signal Processing Magazine, 29(6):141-142, November 2012.
* [11]Dua, Dheeru and Efi Karra Taniskidou: _UCI Machine Learning Repository_. http://archive.ics.uci.edu/ml, 2017. Online, Eingesehen am 11.12.2018.
* [12]Farooq, Umer, Zied Marrakchi und Habib Mehrez: _FPGA Architectures: An Overview_, Seiten 7-48. Springer New York, New York, NY, 2012.
* [13]Gomez-Pulido, Juan A., Miguel A. Vega-Rodriguez, Juan M. Sanchez-Perez, Silvio Priem-Mendes und Vitor Carreira: _Accelerating floating-point fitness functions in evolutionary algorithms: a FPGA-CPU-GPU performance comparison_. Genetic Programming and Evolvable Machines, 12(4):403-427, Dezember 2011.
* [14]Higuchi, T., M. Iwata, I. Kajitani, H. Yamada, B. Manderick, Y. Hirao, M. Murakawa, S. Yoshizawa und T. Furuya: _Evolvable hardware with genetic learning_. In: _1996 IEEE International Symposium on Circuits and Systems. Circuits and Systems Connecting the World. ISCAS 96_, Band 4, Seiten 29-32 vol.4, Mai 1996.
* [15]Hussain, H. M., K. Benkrid, H. Seker und A. T. Erdogan: _FPGA implementation of K-means algorithm for bioinformatics application: An accelerated approach to clustering Microarray data_. In: _2011 NASA/ESA Conference on Adaptive Hardware and Systems (AHS)_, Seiten 248-255, Juni 2011.
* [16]Jacobsen, Matthew, Dustin Richmond, Matthew Hogains und Ryan Kastner: _RIFFA 2.1: A Reusable Integration Framework for FPGA Accelerators_. ACM Trans. Reconfigurable Technol. Syst., 8(4):22:1-22:23, September 2015.
* [17]Kavianipour, H., S. Muschter und C. Bohm: _High Performance FPGA-Based DMA Interface for PCIe_. IEEE Transactions on Nuclear Science, 61(2):745-749, April 2014.
* [18]Krizhevsky, Alex: _Learning Multiple Layers of Features from Tiny Images_. University of Toronto, Mai 2012.
* [19]Kuon, Ian und Jonathan Rose: _Measuring the Gap Between FPGAs and ASICs_. IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems, 26(2):203-215, Februar 2007.

* [20]Kuon, Ian, Russell Tessier und Jonathan Rose: _FPGA Architecture: Survey and Challenges_. Foundations and Trends(r) in Electronic Design Automation, 2(2):135-253, 2008.
* [21]Lacey, Griffin, Graham W. Taylor und Shawki Areibi: _Deep Learning on FPGAs: Past, Present, and Future_. http://arxiv.org/abs/1602.04283, 2016. Online, Eingesehen am 18.12.2018.
* [22]LeCun, Y., L. Bottou, Y. Bengio und P. Haffner: _Gradient-based learning applied to document recognition_. Proceedings of the IEEE, 86(11):2278-2324, November 1998.
* [23]Loosemore, Sandra, Andrew Oram, Ulrich Drepper, Richard Stallmann und Roland McGrath: _The GNU C Library: System & Network Applications_. Seite 408, Marz 1999.
* [24]Maas, Andrew L., Raymond E. Daly, Peter T. Pham, Dan Huang, Andrew Y. Ng und Christopher Potts: _Learning Word Vectors for Sentiment Analysis_. In: _Proceedings of the 49th Annual Meeting of the Association for Computational Linguistics: Human Language Technologies_, Seiten 142-150, Portland, Oregon, USA, Juni 2011. Association for Computational Linguistics.
* [25]Mangasarian, O. L.: _Linear and Nonlinear Separation of Patterns by Linear Programming_. Operations Research, 13(3):444-452, 1965.
* [26]Meeus, Wim, Kristof Van Beeck, Toon Goedeme, Jan Meel und Dirk Stroobandt: _An overview of today's high-level synthesis tools_. Design Automation for Embedded Systems, 16(3):31-51, September 2012.
* [27]Minsky, Marvin und Seymour Papert: _Perceptrons_. MIT Press, 1969.
* [28]Nane, R., V. M. Sima, C. Pilato, J. Choi, B. Fort, A. Canis, Y. T. Chen, H. Hsiao, S. Brown, F. Ferrandi, J. Anderson und K. Bertels: _A Survey and Evaluation of FPGA High-Level Synthesis Tools_. IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems, 35(10):1591-1604, Oktober 2016.
* [29]Narayanan, R., D. Honbo, G. Memik, A. Choudhary und J. Zambreno: _An FPGA Implementation of Decision Tree Classification_. In: _2007 Design, Automation Test in Europe Conference Exhibition_, Seiten 1-6, April 2007.
* [30]Nurvitadhi, E., D. Sheffield,, A. Mishra, G. Venkatesh und D. Marr: _Accelerating Binarized Neural Networks: Comparison of FPGA, CPU, GPU, and ASIC_. In: _2016 International Conference on Field-Programmable Technology (FPT)_, Seiten 77-84, Dezember 2016.

* [31]Papadonikolakis, M. und C. Bouganis: _Efficient FPGA mapping of Gilbert's algorithm for SVM training on large-scale classification problems._ In: _2008 International Conference on Field Programmable Logic and Applications_, Seiten 385-390, September 2008.
* [32]Papadonikolakis, M. und C. Bouganis: _A scalable FPGA architecture for nonlinear SVM training._ In: _2008 International Conference on Field-Programmable Technology_, Seiten 337-340, Dezember 2008.
* [33]PCI-SIG: _PCI Express Base Specification v3.0._ http://www.lttconn.com/res/lttconn/pdres/201402/20140218105502619.pdf, November 2010. Online, Eingesehen am 23.01.2019.
* [34]Preusser, Thomas B. and Rainer G. Spallek: _Ready PCIe data streaming solutions for FPGAs._ In: _2014 24th International Conference on Field Programmable Logic and Applications (FPL)_, Seiten 1-4, September 2014.
* [35]Rosenblatt, F.: _The Perceptron: A Probabilistic Model for Information Storage and Organization in The Brain._ Psychological Review, 65(6):65-386, 1958.
* [36]Rota, L., M. Caselle, S. Chilingaryan, A. Kopmann und M. Weber: _A new DMA PCIe architecture for Gigabyte data transmission._ In: _2014 19th IEEE-NPSS Real Time Conference_, Seiten 1-2, Mai 2014.
* [37]Russell, Stuart und Peter Norvig: _Artificial Intelligence: A Modern Approach._ Pearson, 3. Auflage, Dezember 2009.
* [38]Shan, Yi, Bo Wang, Jing Yan, Yu Wang, Ningyi Xu und Huazhong Yang: _FPMR: MapReduce Framework on FPGA._ In: _Proceedings of the 18th Annual ACM/SIGDA International Symposium on Field Programmable Gate Arrays_, FPGA '10, Seiten 93-102, New York, NY, USA, 2010. ACM.
* [39]Silicon Laboratories Inc.: _CP2103 Single-Chip USB to UART Bridge v1.0._ https://www.silabs.com/documents/public/data-sheets/CP2103.pdf, Dezember 2010. Online, Eingesehen am 23.01.2019.
* [40]Small Form Factor Committee: _SFF-8431 Specifications for Enhanced Small Form Factor Pluggable Module SFP+ v4.1._ http://www.l0gtek.com/templates/wzten/pdf/SFF-8431-(SFP+%20MSA).pdf, Juli 2009. Online, Eingesehen am 23.01.2019.
* [41]Stratakos, Ioannis, Dionysios Reisis, George Lentaris, Konstantinos Maragos und Dimitrios Soudris: _A Co-Design Approach For Rapid Prototyping OfImage Processing On SoC FPGAs_. In: _Proceedings of the 20th Pan-Hellenic Conference on Informatics_, PCI '16, Seiten 57:1-57:6, New York, NY, USA, 2016. ACM.
* 62, 1997.
* [43]Teubner, Jens und Louis Woods: _Data Processing on FPGAs_, Kapitel 4.3.1, Seiten 38-39. Morgan & Claypool, 2013.
* [44]Torralba, A., R. Fergus und W. T. Freeman: _80 Million Tiny Images: A Large Data Set for Nonparametric Object and Scene Recognition_. IEEE Transactions on Pattern Analysis and Machine Intelligence, 30(11):1958-1970, November 2008.
* [45]Vesper, Malte, Dirk Koch, Kizheppatt Vipin und Suhaib A. Fahmy: _Jet-Stream: An open-source high-performance PCI Express 3 streaming library for FPGA-to-Host and FPGA-to-FPGA communication_. In: _2016 26th International Conference on Field Programmable Logic and Applications (FPL)_, Seiten 1-9, August 2016.
* [46]Vestias, M. und H. Neto: _Trends of CPU, GPU and FPGA for high-performance computing_. In: _2014 24th International Conference on Field Programmable Logic and Applications (FPL)_, Seiten 1-6, September. 2014.
* [47]Xilinx Inc.: _7 Series FPGAs Integrated Block for PCI Express v.3.0_. https://www.xilinx.com/support/documentation/ip_documentation/pcie_7x/v3_0/pg054-7series-pcie.pdf, November 2014. Online, Eingesehen am 03.01.2019.
* [48]Xilinx Inc.: _Understanding Performance of PCI Express Systems v1.2_. https://www.xilinx.com/support/documentation/white_papers/wp350.pdf#G1041430, Oktober 2014. Online, Eingesehen am 23.01.2019.
* [49]Xilinx Inc.: _AC701 Evaluation Board User Guide v1.3_. https://www.xilinx.com/support/documentation/boards_and_kits/ac701/ug952-ac701-a7-eval-bd.pdf, April 2015. Online, Eingesehen am 19.12.2018.
* [50]Xilinx Inc.: _7 Series FPGAs Data Sheet: Overview v2.6_. https://www.xilinx.com/support/documentation/data_sheets/ds180_7Series_Overview.pdf, February 2018. Online, Eingesehen am 23.01.2019.
* [51]Xillybus Ltd.: _The guide to Xillybus Block Design Flow for non-HDL users v1.0_. http://xillybus.com/downloads/doc/xillybus_host_programming_guide_linux.pdf. Online, Eingesehen am 12.01.2019.

* [52]Xillybus Ltd.: _Principle of operation_. http://xillybus.com/doc/xilinx-pcie-principle-of-operation. Online, Eingesehen am 27.01.2019.
* [53]Xillybus Ltd.: _Xillybus host application programming guide for Linux v2.3._ http://xillybus.com/downloads/doc/xillybus_host_programming_guide_linux.pdf. Online, Eingesehen am 23.01.2019.
* [54]Xillybus Ltd.: _IP core product brief v1.11._ http://xillybus.com/downloads/xillybus_product_brief.pdf, August 2018. Online, Eingesehen am 02.01.2019.

Hiermit versichere ich, dass ich die vorliegende Arbeit selbststandig verfasst habe und keine anderen als die angegebenen Quellen und Hilfsmittel verwendet sowie Zitate kenntlich gemacht habe.

Dortmund, den 22. Februar 2019

Fabian Dillkotter

[MISSING_PAGE_EMPTY:60]