/**
 * Parse the English and Hindi dubbed lists and output language_dubs.json
 * Run: bun scripts/parse-dubs-list.js  (or node)
 * Reads from scripts/dubs-list.txt (paste the user's list there) or use embedded default.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function parseNumberedList(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\d+\.\s*/, '').trim())
    .map((t) => (t.endsWith('...') ? t.slice(0, -3).trim() : t))
    .filter(Boolean);
}

// Embedded list from user (English then Hindi, separated by section header)
const raw = `### English Dubbed Anime Titles
1. 18if
2. 243: Seiin High School Boys...
3. 86 EIGHTY-SIX
4. 91 Days
5. A Centaur's Life
6. A Certain Magical Index
7. A Certain Scientific Accelerator
8. A Certain Scientific Railgun
9. A Condition Called Love
10. A Couple of Cuckoos
11. A Galaxy Next Door
12. A Journey Through Another World
13. A Lull in the Sea Nagi-Asu: A Lull in the Sea
14. A Returner's Magic Should Be Special
15. A Sign of Affection
16. A Sister's All You Need
17. A Wind Named Amnesia
18. A3
19. Absolute Duo
20. Ace Attorney
21. Actors: Songs Connection
22. Adachi and Shimamura
23. Aesthetica of a Rogue Hero
24. Africa Salaryman
25. Afro Samurai
26. After School Dice Club
27. AFTERLOST
28. Ah My Buddha
29. Aharen-san wa Hakarenai
30. Ai Tenchi Muyo
31. Akashic Records of Bastard Magic Instructor
32. Akebi's Sailor Uniform
33. Akiba's Trip: The Animation
34. Akudama Drive
35. Alderamin on the Sky
36. Alice & Zoroku
37. Alya Sometimes Hides Her Feelings
38. Am I Actually the Strongest?
39. AMAIM: Warrior at the Borderline
40. An Archdemon's Dilemma: How to Love Your Elf Bride
41. And You Thought There Is Never a Girl Online?
42. Angel Cop
43. Angels of Death
44. Anime Crimes Division
45. Anime-Gataris
46. Anohana: The Flower We Saw That Day
47. Aoashi
48. AOKANA: Four Rhythm Across the Blue
49. APPARE-RANMAN!
50. Aria the Scarlet Ammo
51. Arifureta: From Commonplace to World's Strongest
52. Arte
53. As the Gods Will
54. Ascendance of a Bookworm
55. Assassination Classroom
56. Assault Lily BOUQUET
57. Asteroid in Love
58. ASTRA LOST IN SPACE
59. Attack on Titan
60. Attack on Titan Movies
61. Attack on Titan: Junior High
62. AYAKA
63. AZUR LANE
64. BACK ARROW
65. Baka Test - Summon the Beasts
66. Bamboo Blade
67. Banished from the Hero's Party, I Decided to Live a Quiet Life in the Countryside
68. Barakamon
69. BARTENDER: Glass of God
70. Basilisk
71. Basilisk: The Ouka Ninja Scrolls
72. Battle Athletes Victory ReSTART!
73. Battle Game in 5 Seconds
74. Beast Tamer
75. BEM
76. Berserk
77. Berserk of Gluttony
78. Berserk: Das Goldene Zeitalter
79. Beyblade: Metal Fusion
80. Big Fish & Begonia
81. Big Windup!
82. Bikini Warriors
83. Black Blood Brothers
84. Black Butler
85. Black Cat
86. Black Clover
87. Black Lagoon
88. Black Rock Shooter
89. Black Summoner
90. Blade Runner: Black Out 2022
91. BLASSREITER
92. Blood Blockade Battlefront
93. Bludgeoning Angel Dokuro-chan
94. Blue Exorcist
95. BLUE LOCK
96. Blue Reflection Ray
97. Blue Seed
98. Blue Submarine No. 6
99. BOFURI: I Don't Want to Get Hurt, so I'll Max Out My Defense
100. Boogiepop and Others
101. Bottom-Tier Character Tomozaki
102. Brave Witches
103. Brothers Conflict
104. BUCCHIGIRI
105. Buddy Daddies
106. Bungo and Alchemist -Gears of Judgement-
107. Bungo Stray Dogs
108. Bungo Stray Dogs WAN
109. Burst Angel
110. By the Grace of the Gods
111. Bye Bye Earth
112. Campfire Cooking in Another World with My Absurd Skill
113. Captain Tsubasa Staffel 2: Brought to You by the World Cup
114. Cardcaptor Sakura
115. Case File n221: Kabukicho
116. Casshern Sins
117. Cat Girl Nuku Nuku
118. Cautious Hero: The Hero is Overpowered but Overly Cautious
119. Cells at Work
120. Cells at Work CODE BLACK
121. Ceres Celestial Legend
122. Chainsaw Man
123. Chaos Dragon
124. CHAOS;CHILD
125. Chaos;HEAd
126. Charlotte
127. Cherry Magic! Thirty Years of Virginity Can Make You a Wizard?!
128. Children of Ether
129. Chillin' in Another World with Level 2 Super Cheat Powers
130. Chio's School Road
131. Chobits
132. Chrono Crusade
133. CHRONOS RULER
134. citrus
135. City Hunter
136. Classroom of the Elite
137. Claymore
138. Clockwork Planet
139. Code: Realize - Guardian of Rebirth
140. Code:Breaker
141. Comic Party Revolution
142. Conception
143. Concrete Revolutio
144. Convenience Store Boy Friends
145. Cop Craft
146. Corpse Princess: Shikabane Hime
147. Cowboy Bebop
148. Coyote Ragtime Show
149. Cromartie High School
150. Crunchyroll Anime Awards
151. Crunchyroll Collection
152. Cyber City Oedo 808
153. D-Frag!
154. D4DJ First Mix
155. Dagashi Kashi
156. DANDA DAN
157. Dance in the Vampire Bund
158. Dance with Devils
159. Dances with the Dragons
160. Danganronpa 3: The End of Hope's Peak High School
161. Danganronpa: The Animation
162. DARLING in the FRANXX
163. Das Verschwinden der Haruhi Suzumiya
164. Das Verschwinden der Yuki Nagato
165. Date A Live
166. DEAD DEAD DEMONS DEDEDEDE DESTRUCTION
167. Dead Mount Death Play
168. Deadman Wonderland
169. DearS
170. Death March to the Parallel World Rhapsody
171. Death Parade
172. DECA-DENCE
173. Deep Insanity: THE LOST CHILD
174. Delicos Nursery
175. DEMON LORD 2099
176. Demon Lord Retry
177. Demon Slayer: Kimetsu no Yaiba
178. Der stärkste Held mit dem Maulkorb
179. Desert Punk
180. Devil May Cry
181. D.Gray-man
182. Diary of Our Days at the Breakwater
183. Didn't I Say to Make My Abilities Average in the Next Life?!
184. Die Heilige Cecilia und Pastor Lawrence
185. Die Melancholie der Haruhi Suzumiya
186. Die Parallelwelt-Chroniken
187. Die Schleim-Tagebücher
188. Die Tagebücher der Apothekerin
189. Dies irae
190. Digimon Adventure tri Films
191. Dimension W
192. Disgaea
193. Divine Gate
194. DNA2
195. Dog Scissors
196. Don't Hurt Me, My Healer!
197. Don't Toy with Me, Miss Nagatoro
198. Donten: Laughing Under the Clouds
199. DOUBLE DECKER! Doug & Kirill
200. Dr. STONE
201. Dragon Ball
202. Dragon Ball GT
203. Dragon Ball Movies
204. Dragon Ball Super
205. Dragon Ball Z
206. Dragonar Academy
207. Dragonaut: THE RESONANCE
208. Dropout Idol Fruit Tart
209. Eden of the East
210. Eiken
211. Ein Drache auf Wohnungsjagd
212. Ein Fremder am Strand
213. Ein Landei aus dem Dorf vor der Stadt
214. El Cazador de la Bruja
215. Elaina's Journey
216. elDLIVE
217. Elemental Gelade
218. Endride
219. ENDRO!
220. Engage Kiss
221. Ensemble Stars
222. Ergo Proxy
223. Estab Life: Great Escape
224. Eureka Seven AO
225. Eureka Seven Hi-Evolution
226. Excel Saga
227. Fafner
228. Fairy gone
229. Fairy Tail
230. FAIRY TAIL 100 YEARS QUEST
231. Fairy Tail Movies
232. Fatal Fury OVA
233. Fatal Fury: The Motion Picture
234. Fate/Grand Carnival
235. Fate/stay night: Unlimited Blade Works
236. Fate/strange Fake -Whispers of Dawn-
237. Fate/Zero
238. Fire Force
239. FIRST LOVE MONSTER
240. Flame of Recca
241. Flesh for the Beast: Tsukikage
242. Fractale
243. FreakAngels
244. Freezing
245. Frieren: After the End of the World
246. Fruits Basket
247. Fruits Basket (2001)
248. Full Dive: This Ultimate Next-Gen Game Is Even Shittier Than Real Life!
249. Full Metal Panic!
250. Full Metal Panic! Fumoffu
251. Full Metal Panic! Invisible Victory
252. Full Metal Panic! The Second Raid
253. Fullmetal Alchemist: Brotherhood
254. Fushigi Yûgi
255. Fushigi Yûgi OVA
256. Fushigi Yûgi: Eikoden
257. Future Card Buddyfight
258. Fuuka
259. Ga-Rei-Zero
260. Gad Guard
261. Gal Dino
262. GAMERS!
263. Gankutsuou
264. GANTZ
265. GARO -VANISHING LINE-
266. GARO: CRIMSON MOON
267. Gekidol
268. Ghost Hunt
269. Ghost in the Shell: Arise
270. Ghost Stories
271. Girlfriend, Girlfriend
272. Girls Bravo
273. Girls Frontline
274. Glass Fleet
275. Gleipnir
276. GLOOMY THE NAUGHTY GRIZZLY
277. GOBLIN SLAYER
278. Gods Games We Play
279. Golden Boy
280. Golden Kamuy
281. Good Luck Girl
282. Gosick
283. Gravion
284. Gravitation
285. Grimgar: Ashes and Illusions
286. GTO - The Animation
287. Guilty Crown
288. Gun X Sword
289. Gunbuster
290. Gungrave
291. Gunslinger Girl
292. Guyver: The Bioboosted Armor
293. GXYZ123
294. Haganai
295. Hajime No Ippo: The Fighting
296. Hakata Tonkotsu Ramens
297. HAKYU HOSHIN ENGI
298. Hand Shakers
299. Handa-kun
300. Handyman Saitou in Another World
301. HANEBADO!
302. Happy Tree Friends
303. HarmonQuest
304. Harukana Receive
305. Hatena Illusion
306. Heat Guy J
307. Heaven Official's Blessing
308. Hells
309. Hells Paradise
310. Hellsing
311. Hellsing Ultimate
312. Hensuki: Are You Willing to Fall in Love with a Pervert, as Long as She's a Cutie?
313. Hero Tales
314. Heroic Age
315. Heroines Run the Show
316. Hetalia
317. Higehiro: After Being Rejected, I Shaved and Took in a High School Runaway
318. High Guardian Spice
319. High School DxD
320. High School Prodigies Have It Easy Even in Another World!
321. Higurashi: When They Cry - GOU
322. Hikakin Beatbox
323. Hina Logic: From Luck & Logic
324. HINAMATSURI
325. Hinomaru Sumo
326. Hokkaido Gals Are Super Adorable!
327. Holy Knight
328. Horimiya
329. Hortensia SAGA
330. How a Realist Hero Rebuilt the Kingdom
331. How Heavy Are the Dumbbells You Lift?
332. Human Lost
333. Hundred
334. Hyouka
335. Hyperdimension Neptunia
336. I Got a Cheat Skill in Another World and Became Unrivaled in the Real World, Too
337. I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability
338. Ich bin eine Spinne, na und?
339. ID: INVADED
340. If It's for My Daughter, I'd Even Defeat a Demon Lord
341. If My Favorite Pop Idol Made It to the Budokan, I Would Die
342. Ikebukuro West Gate Park
343. Ikki Tousen
344. I'm in Love with the Villainess
345. I'm Standing on a Million Lives
346. I'm the Villainess, So I'm Taming the Final Boss
347. In Another World with My Smartphone
348. In the Land of Leadale
349. Infinite Dendrogram
350. Initial D
351. InSpectre
352. Interviews with Monster Girls
353. Investor Z Motion Manga
354. Irina: The Vampire Cosmonaut
355. Is This a Zombie?
356. Isekai Cheat Magician
357. ISLAND
358. I've Been Killing Slimes for 300 Years and Maxed Out My Level
359. Izetta: The Last Witch
360. Jinki: Extend
361. JOKER GAME
362. Jormungand
363. Josie, the Tiger and the Fish
364. Jubei-Chan 2: The Counterattack of the Dark General
365. JUJUTSU KAISEN
366. JUNI TAISEN: ZODIAC WAR
367. Junior High and High School Students Are the Best!
368. Junji Ito Collection
369. Jyu-Oh-Sei
370. KADO: The Right Answer
371. Kageki Shojo!!
372. Kaguya-sama: Love Is War
373. Kaiju No 8
374. Kakuriyo: Bed & Breakfast for Spirits
375. Kaleido Star
376. KamiKatsu: Working for God in a Godless World
377. KanColle
378. Kanon
379. Karneval
380. Katana Maidens: Toji No Miko
381. Kaze no Stigma
382. Keijo!!!!!!!!
383. Kekkaishi
384. Kemono Jihen
385. Kemono Michi: Rise Up
386. KenIchi: The Mightiest Disciple
387. Kenka Bancho Otome: Girl Beats Boys
388. Key the Metal Idol
389. Kiddy Grade
390. Kill la Kill
391. Kings Game
392. KINGs RAID: Successors of the Will
393. Kino's Journey: The Beautiful World
394. KIZNAIVER
395. Knight's Magic
396. Knights of Sidonia
397. Kochoki: Wakaki Nobunaga
398. Kombattanten werden entsandt
399. Kono Oto Tomare: Sounds of Spring
400. KONOHANA KITAN
401. KONOSUBA: An Explosion on This Wonderful World!
402. KONOSUBA: God's Blessing on This Wonderful World!
403. Koro Sensei Quest
404. Kuss ihn nicht, mich
405. Kuma Kuma Kuma Bear
406. Kurau: Phantom Memory
407. Kyo Kara Maoh!
408. Ladies Versus Butlers!
409. Laid-Back Camp
410. Last Exile
411. LASTEXILE: Fam, the Silver Wing
412. Laughing Under the Clouds
413. LBX Girls
414. Leviathan: The Last Defense
415. Liar Liar
416. Life Lessons with Uramichi Oniisan
417. Life with an Ordinary Guy Who Reincarnated into a Total Fantasy Knockout
418. Link Click
419. Listeners
420. Liz and the Blue Bird
421. Log Horizon
422. Lord El-Melloi II's Case Files
423. Lord Marksman and Vanadis
424. Lord of Vermilion: The Crimson Labyrinth
425. Love After World Domination
426. Love Hina Again
427. Love Live! School Idol Project
428. Love Live! Sunshine!!
429. Love of Kill
430. Love Tyrant
431. Lucifer and the Biscuit Hammer
432. Lucky Star
433. LUPIN III: The Woman Called Fujiko Mine
434. Lupin the Third Part 2
435. Lycoris Recoil
436. Maesetsu! Opening Act
437. MAGATSU WAHRHEIT
438. Magia Record: Puella Magi Madoka Magica Side Story
439. Magic Knight Rayearth
440. Magic Users Club
441. Magic Users Club OVA
442. Magical Girl Raising Project
443. Magical Girl Spec-Ops Asuka
444. Magical Sempai
445. Magikano
446. Makeine: Too Many Losing Heroes
447. Maken-ki!
448. Maquia: When the Promised Flower Blooms
449. March Comes in Like a Lion
450. Maria the Virgin Witch
451. MARS RED
452. Masamune-kun's Revenge
453. MASHLE: MAGIC AND MUSCLES
454. Mass Effect
455. MEGALOBOX
456. Meiji Tokyo Renka
457. Mein Schulgeist Hanako
458. Mein Schulgeist Hanako: After Story
459. Meine Wiedergeburt als Schleim in einer anderen Welt
460. Metallic Rouge
461. MF GHOST
462. Michiko & Hatchin
463. Midnight Eye Goku
464. Midnight Occult Civil Servants
465. Mieruko-chan
466. MigiDali
467. Mikagura School Suite
468. Millennium Actress
469. Miss Caretaker of Sunohara-sou
470. Miss KUROITSU from the Monster Development Department
471. Mob Psycho 100
472. MOBILE SUIT GUNDAM: THE ORIGIN
473. MOBILE SUIT GUNDAM: THE ORIGIN - Chronicles of the War
474. Mobile Suit Gundam: The Witch from Mercury
475. Mobile Suit Gundam Wing
476. Mobile Suit Gundam: Cucuruz Doan's Island
477. Mobile Suit Zeta Gundam
478. Moeyo Ken
479. Mongolian Chop Squad
480. Mononoke
481. Monster Girl Doctor
482. Monster Hunter Stories: Ride On
483. More than a Married Couple, But Not Lovers
484. Moriarty the Patriot
485. Muhyo & Roji's Bureau of Supernatural Investigation
486. Murder Princess
487. Mushoku Tensei: Jobless Reincarnation
488. My Clueless First Friend
489. My Dress-Up Darling
490. My First Girlfriend is a Gal
491. My Hero Academia
492. My Hero Academia Movies
493. My Home Hero
494. My Love Story with Yamada-kun at Lv999
495. My Next Life as a Villainess: All Routes Lead to Doom!
496. My Roommate is a Cat
497. My Senpai is Annoying
498. My Tiny Senpai
499. My Unique Skill Makes Me OP Even at Level 1
500. My-HiME
501. Myriad Colors Phantom World
502. Nabari no Ou
503. NANBAKA
504. Natsume's Book of Friends
505. Natsume Yujin-cho 6
506. Natsume's Book of Friends: The Movie
507. Nekopara
508. NEW GAME!
509. Nichijou: My Ordinary Life
510. Nicht schon wieder Takagi-san
511. NieR:Automata Ver1.1a
512. Night on the Galactic Railroad
513. Ningen Fushin: Adventurers Who Don't Believe in Humanity Will Save the World
514. Ninja Nonsense
515. Ninja Scroll: The Series
516. No Guns Life
517. No Longer Allowed in Another World
518. Noblesse
519. Nobunagun
520. Noein: To Your Other Self
521. Noir
522. Noragami
523. number24
524. Occultic;Nine
525. Oh Edo Rocket
526. Okami-san and Her Seven Companions
527. One Piece
528. One Piece Movies
529. Onyx Equinox
530. Orange
531. ORGUSS
532. ORIENT
533. Otherside Picnic
534. Our Last Crusade or the Rise of the New World
535. Ouran High School Host Club
536. Pani Poni Dash
537. Panty Stocking with Garterbelt
538. Parallel World Pharmacy
539. Paranoia Agent
540. PEACE MAKER KUROGANE
541. Peacemaker Kurogane
542. Peach Girl
543. Penguin Highway
544. PERSONA5 the Animation
545. Phantom: Requiem for the Phantom
546. Phoenix
547. Photon the Idiot Adventures
548. Pilot Candidate
549. Ping Pong the Animation
550. Planetarian
551. Planetes
552. Platinum End
553. Please Teacher
554. Please Twins
555. Plunderer
556. Pretear
557. Pretty Boy Detective Club
558. Prince of Stride: Alternative
559. Princess Jellyfish
560. Princess Knight
561. Princess Nine
562. Prison School
563. Project Blue Earth SOS
564. Psycho-Pass: The Movie
565. PSYCHO-PASS: Providence
566. Psycho-Pass: Sinners of the System
567. Puella Magi Madoka Magica
568. Pumpkin Scissors
569. Puppet Princess
570. PuraOre: PRIDE OF ORANGE
571. Puzzle Dragons X
572. Quality Assurance in Another World
573. RADIANT
574. Raeliana: Why She Disappeared
575. Ragnarok: The Animation
576. Rampo Kitan: Game of Laplace
577. Ranking of Kings
578. Raven of the Inner Palace
579. RE-MAIN
580. Re:Monster
581. Re:ZERO - Starting Life in Another World
582. Reborn as a Vending Machine, I Now Wander the Dungeon
583. Record of Lodoss War
584. Recovery of an MMO Junkie
585. Red Data Girl
586. Red Garden
587. Regalia: The Three Sacred Stars
588. Reign of the Seven Spellblades
589. ReLIFE
590. Remake Our Life
591. Rent-a-Girlfriend
592. Requiem of the Rose King
593. RErideD: Derrida Who Leaps Through Time
594. Restaurant to Another World
595. Revenger
596. RideBack
597. RIN: Daughters of Mnemosyne
598. Rinshi Ekodachan
599. RobiHachi
600. Robotech
601. Robotics;Notes
602. Rokka: Braves of the Six Flowers
603. Romeo x Juliet
604. Rosario + Vampire
605. RUMBLE GARANNDOLL
606. Rumbling Hearts
607. Rurouni Kenshin
608. RWBY
609. RWBY: Ice Queendom
610. s-CRY-ed
611. SABIKUI BISCO
612. Sacrificial Princess and the King of Beasts
613. Saint Seiya
614. SAINT SEIYA: Knights of the Zodiac
615. SAIYUKI RELOAD BLAST
616. SAKUGAN
617. Sakura Quest
618. Sakura Wars: The Animation
619. Sakura Wars: The Movie
620. Salaryman's Club
621. Samurai 7
622. Samurai Champloo
623. Samurai Pizza Cats
624. Samurai Warriors
625. Sankarea: Undying Love
626. Sarazanmai
627. Sasaki and Peeps
628. Sasami: Magical Girls Club
629. Save Me Lollipop
630. Saving 80,000 Gold in Another World
631. Scar on the Praeter
632. Scarlet Nexus
633. School Rumble
634. Science Fell in Love, So I Tried to Prove It
635. Scrapped Princess
636. Seirei Gensouki: Spirit Chronicles
637. Sengoku BASARA: End of Judgement
638. Senran Kagura
639. SENRAN KAGURA: SHINOVI MASTER
640. SERVAMP
641. Seven Mortal Sins
642. Shachibato: President It's Time for Battle!
643. SHADOWS HOUSE
644. Shakugan no Shana
645. Shangri-la
646. Shangri-La Frontier
647. Shattered Angels
648. She Professed Herself Pupil of the Wise Man
649. Shigurui: Death Frenzy
650. Shikimori's Not Just a Cutie
651. Shimoneta: A Boring World Where the Concept of Dirty Jokes Doesn't Exist
652. Shin Ikki Tousen
653. Shingu: Secret of the Stellar Wars
654. Shinobi
655. Shinobi Girl
656. Shinobi no Ittoki
657. Shironeko Project: ZERO Chronicle
658. Shomin Sample
659. Shoot Goal to the Future
660. Show By Rock!!
661. SHOW BY ROCK!! Mashumairesh
662. Shrine of the Morning Mist
663. Shuffle!
664. SHY
665. Sing a Bit of Harmony
666. SING YESTERDAY FOR ME
667. Sister Princess
668. SK8 the Infinity
669. Skate-Leading Stars
670. Skeleton Knight in Another World
671. Sky Wizards Academy
672. Sleepy Princess in the Demon Castle
673. Smile Down the Runway
674. Smile of the Arsnotoria: The Animation
675. SNACK WORLD
676. Snow White with the Red Hair
677. Solo Leveling
678. Solty Rei
679. Sonny Boy
680. Sorcerer Hunters
681. Soul Eater
682. Sound Euphonium Movies
683. Space Battleship Tiramisu
684. Space Dandy
685. SPACE PATROL LULUCO
686. Space Pirate Mito
687. Special 7: Special Crime Investigation Unit
688. Speed Grapher
689. Spice and Wolf
690. Spice and Wolf: Merchant Meeting
691. SPY x FAMILY
692. SSSS.DYNAZENON
693. SSSS.GRIDMAN
694. Star Blazers: Space Battleship Yamato
695. Stars Align
696. Steel Fisted Dragon
697. Steins;Gate 0
698. Stellvia
699. STRAIN: Strategic Armored Infantry
700. Street Fighter II: The Animated Movie
701. Strike Witches
702. Strike Witches: 501st Joint Fighter Wing Take Off!
703. Sugar Apple Fairy Tale
704. Super Cub
705. SUPER HXEROS
706. Suzuka
707. Suzume
708. Sweet Reincarnation
709. Sword Art Online
710. Taboo Tattoo
711. Taisho Otome Fairy Tale
712. takt op.Destiny
713. Talentless Nana
714. Tales of Luminaria: The Fateful Crossroad
715. Tales of Phantasia: The Animation
716. Tales of Wedding Rings
717. Tales of Zestiria the X
718. TAMAYOMI: The Baseball Girls
719. Tenchi Muyo! War on Geminar
720. Tenjho Tenge
721. TenPuru: Von Einsamkeit kann man nicht leben
722. Tetsujin 28
723. The 100 Girlfriends Who Really, Really, Really, Really, Really Love You
724. The 8th Son? Are You Kidding Me?
725. The Ancient Magus' Bride
726. The Boy and the Beast
727. The Case Study of Vanitas
728. The Daily Life of the Immortal King
729. The Dawn of the Witch
730. The Day I Became a God
731. The Demon Prince of Momochi House
732. The Detective Is Already Dead
733. The Devil is a Part-Timer!
734. The Dragon Lives Again
735. The Duke of Death and His Maid
736. The Dungeon of Black Company
737. The Elusive Samurai
738. The Faraway Paladin
739. The Foolish Angel Dances with the Devil
740. The Fruit of Evolution: Before I Knew It, My Life Had It Made
741. The Future Diary
742. The Galaxy Railways
743. The Genius Prince's Guide to Raising a Nation Out of Debt
744. The Girl from the Other Side: Siúil, a Rún
745. The Girl Who Leapt Through Time
746. The God of High School
747. The Great Cleric
748. The Great Jahy Will Not Be Defeated!
749. The Greatest Demon Lord Is Reborn as a Typical Nobody
750. The Gymnastics Samurai
751. The Heike Story
752. The Helpful Fox Senko-san
753. The Hidden Dungeon Only I Can Enter
754. The Honor at Magic High School
755. The Ice Guy and His Cool Female Colleague
756. The Iceblade Sorcerer Shall Rule the World
757. The Irregular at Magic High School
758. The Journey
759. The King of Braves: GaoGaiGar
760. The Kingdoms of Ruin
761. The Legend of Black Heaven
762. The Legend of Heroes: Trails of Cold Steel
763. The Legendary Hero is Dead!
764. The Maid I Hired Recently Is Mysterious
765. The Master of Ragnarok & Blesser of Einherjar
766. The Millionaire Detective - Balance: Unlimited
767. The Misfit of Demon King Academy
768. The Morose Mononokean
769. The Ones Within
770. The Prince of Tennis
771. The Prince of Tennis II
772. The Prince of Tennis II Hyotei vs. Rikkai
773. The Prince of Tennis II OVA
774. The Prince of Tennis II U-17 World Cup
775. THE PROMISED NEVERLAND
776. The Quintessential Quintuplets
777. The Reflection
778. The Reincarnation Of The Strongest Exorcist In Another World
779. The Rising of the Shield Hero
780. The Sacred Blacksmith
781. The Saints Magic Power is Omnipotent
782. The Silver Guardian
783. The Tower of Druaga
784. The Twelve Kingdoms
785. The Unwanted Undead Adventurer
786. The Weakest Tamer Began a Journey to Pick Up Trash
787. The Witch and the Beast
788. The Wonderland
789. The World Ends With You: The Animation
790. The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat
791. The Wrong Way to Use Healing Magic
792. The Yakuza's Guide to Babysitting
793. Thermae Romae
794. Three Leaves, Three Colors
795. To the Abandoned Sacred Beasts
796. To Your Eternity
797. Tofugu
798. Tokyo 24th Ward
799. Tokyo Ghoul
800. Tokyo Majin
801. Tokyo Ravens
802. Tokyo Revengers
803. Tomo-chan Is a Girl!
804. Tomodachi Game
805. TONIKAWA: Over the Moon for You
806. Toradora!
807. Touken Ranbu: Hanamaru
808. Tower of God
809. Trapped in a Dating Sim: The World of Otome Games is Tough for Mobs
810. Traveling Daru
811. Tribe Nine
812. Trickster
813. Trigun
814. TRIGUN STAMPEDE
815. Trinity Blood
816. Trnke sind mein Lebenselixier
817. True Beauty
818. Tsubasa: RESERVoir CHRoNiCLE
819. Tsukigakirei
820. TSUKIMICHI: Moonlit Fantasy
821. Tsuredure Children
822. Twilight Out of Focus
823. Twin Star Exorcists
824. UFO Ultramaiden Valkyrie
825. Ulysses: Jeanne d'Arc and the Alchemist Knight
826. URAHARA
827. Urusei Yatsura Movies
828. Utawarerumono
829. Utawarerumono: Mask of Truth
830. Uzaki-chan Wants to Hang Out!
831. Valerian and Laureline
832. Valkyrie Drive: Mermaid
833. Vampire Dormitory
834. Venus Versus Virus
835. VINLAND SAGA
836. Viral Hit
837. Vivy: Fluorite Eye's Song
838. VTuber Legend: How I Went Viral After Forgetting to Turn Off My Stream
839. Wanna Be the Strongest in the World!
840. Warlords of Sigrdrifa
841. Wave, Listen to Me!
842. We Without Wings: Under the innocent sky
843. Welcome to Demon School! Iruma-kun
844. Welcome to the N-H-K
845. Why Does Nobody Remember Me?
846. WIND BREAKER
847. Wise Man's Grandchild
848. Wistoria: Wand and Sword
849. Witch Hunter Robin
850. Witchblade
851. Wolf Children
852. Wolfs Rain
853. WONDER EGG PRIORITY
854. World Break: Aria of Curse for a Holy Swordsman
855. WorldEnd: What do you do at the end of the world? Are you busy? Will you save us?
856. X
857. xxxHOLiC
858. Yamada-kun and the Seven Witches
859. Yamada's First Time: B Gata H Kei
860. Yashahime: Princess Half-Demon
861. Yona of the Dawn
862. Your Lie in April
863. Your Name
864. Yu-Gi-Oh! 5D's
865. Yu-Gi-Oh! GX
866. Yu-Gi-Oh! ZEXAL
867. YU-NO: A Girl Who Chants Love at the Bound of This World
868. Yuri on ICE
869. Zaion: I Wish You Were Here
870. Zo Zo Zombie
871. Zom 100: Bucket List of the Dead
872. ZOMBIE LAND SAGA

### Hindi Dubbed Anime Titles
1. A Condition Called Love
2. A Couple of Cuckoos
3. A Salad Bowl of Eccentrics
4. Akebi's Sailor Uniform
5. Akudama Drive
6. Alya Sometimes Hides Her Feelings
7. An Archdemon's Dilemma: How to Love Your Elf Bride
8. Banished from the Hero's Party, I Decided to Live a Quiet Life in the Countryside
9. BARTENDER: Glass of God
10. Black Butler
11. BUCCHIGIRI
12. Buddy Daddies
13. Bye Bye Earth
14. Code Geass
15. DARLING in the FRANXX
16. Days with My Stepsister
17. Demon Slayer: Kimetsu no Yaiba
18. Die Tagebücher der Apothekerin
19. Dragon Ball Movies
20. Fire Force
21. Frieren: After the End of the World
22. Gods Games We Play
23. Handyman Saitou in Another World
24. Hokkaido Gals Are Super Adorable!
25. Horimiya
26. I Got a Cheat Skill in Another World and Became Unrivaled in the Real World, Too
27. I'm in Love with the Villainess
28. Kaiju No 8
29. KamiKatsu: Working for God in a Godless World
30. Makeine: Too Many Losing Heroes
31. Masamune-kun's Revenge
32. MASHLE: MAGIC AND MUSCLES
33. Mein Schulgeist Hanako
34. Metallic Rouge
35. Miss KUROITSU from the Monster Development Department
36. Mobile Suit Gundam: The Witch from Mercury
37. More than a Married Couple, But Not Lovers
38. My Dress-Up Darling
39. My Love Story with Yamada-kun at Lv999
40. My One-Hit Kill Sister
41. My Tiny Senpai
42. My Unique Skill Makes Me OP Even at Level 1
43. No Longer Allowed in Another World
44. Quality Assurance in Another World
45. RADIANT
46. Raeliana: Why She Disappeared
47. Ranking of Kings
48. Reborn as a Vending Machine, I Now Wander the Dungeon
49. Reign of the Seven Spellblades
`;

const parts = raw.split(/\s*###\s+/).filter(Boolean);
const englishSection = parts.find((p) => p.toLowerCase().startsWith('english'));
const hindiSection = parts.find((p) => p.toLowerCase().startsWith('hindi'));

const english_dubbed = englishSection ? parseNumberedList(englishSection.replace(/^English[^\n]*\n/i, '')) : [];
const hindi_dubbed = hindiSection ? parseNumberedList(hindiSection.replace(/^Hindi[^\n]*\n/i, '')) : [];

const out = { english_dubbed, hindi_dubbed };
const outPath = join(rootDir, 'language_dubs.json');
writeFileSync(outPath, JSON.stringify(out, null, 0), 'utf8');
console.log('Updated language_dubs.json: English', english_dubbed.length, 'Hindi', hindi_dubbed.length);
