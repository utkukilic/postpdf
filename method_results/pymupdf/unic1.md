# IT/Tech Zusammenfassung UCB64 / BB-64 / Brunnenviertel

45 Coworker an FlexDesk (Total ca 70 coworker full member)
2 Meeting Rooms
1 Eventhall
2 Wallmount Beamer
2 Mobile Beamer
1 iMac (zur Zeit nicht in Verwendung, future Media Player?)
1 FullHD TV
1 Panasonic nFone Handset
1 AP 4 Speaker
2 Hand Mikros
2 Headset Mikros
Verkabelung via VGA (soon upgrade auf HDMI oder Wireless/Airplay?)

## Main-ISP:

Vodafone Cable
200/50 Mbit
Fritzbox 6590 Modem
Festnetznummer 030 91445472(Forward auf nFone)

remarks:
April-Junii hatten wir lange Probleme die aber nun gelöst sind. Vodafone hat
deren Verteilertechnik erneuert. Trotzdem immer mal nen Reboot am Modem
was daran liegt das die Fritzbox ne lahme Kiste ist und mit den vielen Paketen
nicht klar kommt. zb 140 MacBooks zum Bubble Developer HackDay. Hab
mittlerweile die Fritzbox gemodded damit Port2 in Bridge Mode läuft direkt aufs
Modem ohne den Router der Box zu nutzen.. aber hab irgendwie Probleme
damit.. future Project.
Unsere Vodafone Festnetz Nummer wird direkt auf nFone weitergeleitet.

## Fallback/Backup-ISP

Vodafone LTE GigaQube50
200/50Mbit Max
50GB Volume

remarks:
Wir haben ein 50GB Volumen mit nem LTE GigaQube. Laut ganz gut und schnell.
Wollte das ganze als Automatischen FailOver an unserem Router einrichten. Aber


-----

zur Zeit hab ich es nicht angeschlossen sondern nur als Backup falls das Internet
mal ausfallen sollte im Schrank zu stehen.(Wenn nicht genutzt wird fallen auch
keine Monatlichen Kosten an)
Idee: LongRange Wireless vom AEG rooftop zum UCB rooftop @Wollki ;-)

## Network

Ubiquiti Edgerouter PoE
WAN1 Vodafone cable
WAN2 Vodafone LTE
TP-Link 24Port Switch(unmanaged)
3xUnifi AP-AC-Pro
1xUnifi AP-AC-lite
1x Netgear RangeExtender für den Pavillon(Orderbird POS auf iPad)

remarks:
Wifi Works fine. no special Security settings. Ganz normales WiFi mit
PassKey(uN!c0rn!) Im Pavillon ist das Wifi nicht so gut aber overall kommt es gut
mit der Last klar, auch bei Events.

## Printer/Scanner

HP LaserJet 200 M276nw
Network Scan/Print
[Scan2mail via printer@unicorn.de](mailto:printer@unicorn.de)

## CCTV

Server:
i5 8GB 500GB-HDD Win10
CCTV Software BlueIris
IP-Cams:
1x 4k IPCam
(mehr in Planung)

remarks:
BlueIris coole Software aber only Windows :-)
HTTP Webserver läuft leider nur HTTP nicht HTTPs (nooooo)
Will weitere IP-Cams installieren aber Planung und Zeit :-(

## Meeting Room Display

Hardware: Billiges Android Tablet
Software: Roombelt Subscription 5 USD/Month
[Connected gCal Infinity und Oblivion via printer@unicorn.de :-)](mailto:printer@unicorn.de)


-----

remarks:
Seit einiger Zeit am rum testen. Vor 2 Wochen das Setup so aufgestellt und als ich
aus dem urlaub zurück war lief es immer noch. cool. Wenn Space OS soweit läuft
das man es für Solche zwecke nutzen kann können wir da gerne umswitchen.
Hier ist mein Ziel zur Zeit meine Coworker über den Status der Rooms zu
informieren da sie diese für Kurzzeit Spots nutzen können wenn sie nicht gebucht
sind. Roombelt kann interaktiv laufen ich habe es aber nur als InfoDisplay am
laufen.

## Software

Cobot zum verwalten der Coworker. Anmeldung via
[https://unicorn-berlin-brunnenviertel.cobot.me](https://unicorn-berlin-brunnenviertel.cobot.me/)
10€ half day
16,50€ full day (incl coffee)
82,11€ full month(incl coffee flatrate)

BlueIris für CCTV

Roombelt für Meeting Room Display

Google Cal für Events/Meeting Room


-----

