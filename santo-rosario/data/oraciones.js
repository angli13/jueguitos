/* oraciones.js — Textos del Santo Rosario (método tradicional latín–castellano).
 *
 * Transcritos del folleto "Sanctum Rosarium — Método Tradicional Latín-Castellano".
 * Cada oración es una lista de líneas. Tipos de línea:
 *   p  → párrafo normal
 *   v  → versículo (V.)
 *   r  → respuesta (R.)
 *   l  → invocación de letanía (se le añade la respuesta indicada en `resp`)
 * Cada línea tiene su texto en latín (la) y en castellano (es). Si falta el
 * latín (p. ej. el Ofrecimiento, que el folleto da solo en castellano) se
 * muestra el castellano en su lugar.
 */
(function () {
  'use strict';

  const p = (la, es) => ({ k: 'p', la, es });
  const v = (la, es) => ({ k: 'v', la, es });
  const r = (la, es) => ({ k: 'r', la, es });

  // Nombre del Papa para la oración "por el Sumo Pontífice" (en el folleto: N.).
  // Cámbialo aquí si hace falta.
  const PONTIFEX = { la: 'Leone', es: 'León' };

  const GLORIA = [
    v('Gloria Patri, et Filio, et Spiritui Sancto.',
      'Gloria al Padre, y al Hijo, y al Espíritu Santo.'),
    r('Sicut erat in princípio, et nunc et semper, et in sǽcula sæculórum. Amen.',
      'Como era en un principio, ahora y siempre, por los siglos de los siglos. Amén.'),
  ];

  const SANCTA_MARIA_R = r(
    'Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostræ. Amen.',
    'Santa María, Madre de Dios, ruega por nosotros los pecadores, ahora y en la hora de nuestra muerte. Amén.'
  );

  const ORA_PRO_NOBIS = [
    v('Ora pro nobis, Sancta Dei Genetrix.', 'Ruega por nosotros, Santa Madre de Dios.'),
    r('Ut digni efficiamur promissionibus Christi.',
      'Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo.'),
  ];

  const P = {
    signum: {
      title: { la: 'Signum Crucis', es: 'Señal de la Cruz' },
      lines: [
        p('Per signum (✝) Sanctæ Crucis de inimícis (✝) nostris líbera nos (✝), Deus noster. In nómine Patris, et Fílii, et Spíritus Sancti. Amen.',
          'Por la señal (✝) de la Santa Cruz, de nuestros enemigos (✝) líbranos, Señor (✝) Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.'),
      ],
    },

    invocatio: {
      title: { la: 'Invocatio', es: 'Invocación' },
      lines: [
        v('Dómine, lábia mea apéries.', 'Señor, abrid mis labios.'),
        r('Et os meum annuntiábit laudem tuam.', 'Y mi boca proclamará tu alabanza.'),
        v('Deus, in adiutórium meum inténde.', 'Dios mío, ven en mi auxilio.'),
        r('Dómine, ad adiuvándum me festína.', 'Señor, date prisa en socorrerme.'),
        ...GLORIA,
      ],
    },

    dignare: {
      title: { la: 'Dignare me', es: 'Haz que yo te alabe' },
      lines: [
        v('Dignáre me laudáre Te, Virgo sacráta.', 'Haz que yo te alabe, oh Virgen Santa.'),
        r('Da mihi virtútem contra hostes tuos.', 'Dame fuerzas contra tus enemigos.'),
        v('María, Mater grátiæ, Mater misericórdiæ.', 'María, Madre de la gracia, Madre de misericordia.'),
        r('Tu nos ab hoste prótege, et hora mortis súscipe.',
          'Defiéndenos del enemigo y recíbenos a la hora de nuestra muerte.'),
      ],
    },

    contritio: {
      title: { la: 'Actus contritionis', es: 'Acto de contrición' },
      lines: [
        p('Oh mi Dómine Iesu, verus Deus et Homo verus, Creátor, Pater et Redémptor meus, in qui credo et spero, et quem super ómnia díligo, me pœnitet propter peccáta mea, quia tu Deus bonus es, ac me pœnis inférni puníre potes; et tua grátia adiuvánte futúris pollíceor. Amen.',
          'Señor mío Jesucristo, Dios y hombre verdadero, Creador, Padre y Redentor mío, en quien creo y espero, y a quien amo por sobre todas las cosas. Me arrepiento de mis pecados por ser Tú un Dios tan bueno, y porque puedo merecer las penas del infierno; espero que tu gracia me ayude a reparar mis faltas y a no cometerlas en adelante. Amén.'),
      ],
    },

    oblatio: {
      title: { la: 'Oblatio', es: 'Ofrecimiento inicial' },
      // {INTENCION} se sustituye por la intención particular del orante.
      lines: [
        p(null,
          'Señor Dios nuestro, dirigid y guiad todos nuestros pensamientos, palabras y obras a mayor honra y gloria vuestra. Y vos, Virgen Santísima, alcanzadnos de vuestro divino Hijo, que con toda atención y devoción podamos rezar vuestro santísimo Rosario; el cual os ofrecemos por la exaltación de la santa fe católica, por nuestras necesidades espirituales y temporales, y por el bien y sufragio de vivos y difuntos, en especial por {INTENCION}.'),
      ],
    },

    pater: {
      title: { la: 'Pater Noster', es: 'Padre Nuestro' },
      lines: [
        p('Pater noster, qui es in cælis, sanctificétur nomen tuum; advéniat regnum tuum; fiat volúntas tua, sicut in cælo et in terra.',
          'Padre nuestro, que estás en los cielos, santificado sea tu nombre; venga a nosotros tu reino; hágase tu voluntad, así en la tierra como en el cielo.'),
        r('Panem nostrum quotidiánum da nobis hódie; et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris; et ne nos indúcas in tentatiónem; sed líbera nos a malo. Amen.',
          'El pan nuestro de cada día dánosle hoy; perdónanos nuestras deudas, así como nosotros perdonamos a nuestros deudores; y no nos dejes caer en la tentación, mas líbranos del mal. Amén.'),
      ],
    },

    ave: {
      title: { la: 'Ave Maria', es: 'Ave María' },
      lines: [
        p('Ave María, grátia plena, Dóminus tecum; benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus.',
          'Dios te salve, María, llena eres de gracia, el Señor es contigo; bendita eres entre todas las mujeres, y bendito el fruto de tu vientre, Jesús.'),
        SANCTA_MARIA_R,
      ],
    },

    gloria: {
      title: { la: 'Gloria Patri', es: 'Gloria' },
      lines: GLORIA,
    },

    iaculatoriae: {
      title: { la: 'Iaculatoriæ', es: 'Jaculatorias' },
      lines: [
        v('María, Mater grátiæ, Mater misericórdiæ.', 'María, Madre de la gracia, Madre de misericordia.'),
        r('Tu nos ab hoste prótege, et hora mortis súscipe.',
          'Defiéndenos del enemigo y recíbenos a la hora de nuestra muerte.'),
        p('O bone Iesu, dimítte nobis débita nostra, salva nos ab igne inférni, perduc in cælum omnes ánimas, præsértim eas quæ misericórdiæ tuæ máxime índigent.',
          'Oh Jesús mío, perdona nuestras deudas, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.'),
      ],
    },

    aveFilia: {
      title: { la: 'Ave Sanctíssima — Patris Filia', es: 'Dios te salve — Hija de Dios Padre' },
      lines: [
        p('Ave Sanctíssima María, ætérni Patris Fília, Virgo puríssima ante partum, in manus tuas comméndo fidem meam illuminándam. Grátia plena, Dóminus tecum; benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus.',
          'Dios te salve, María Santísima, Hija de Dios Padre, Virgen purísima antes del parto, en tus manos ponemos nuestra fe para que la ilumines. Llena eres de gracia, el Señor es contigo; bendita eres entre todas las mujeres, y bendito el fruto de tu vientre, Jesús.'),
        SANCTA_MARIA_R,
      ],
    },

    aveMater: {
      title: { la: 'Ave Sanctíssima — Filii Dei Mater', es: 'Dios te salve — Madre de Dios Hijo' },
      lines: [
        p('Ave Sanctíssima María, Fílii Dei Mater, Virgo puríssima in partu, in manus tuas comméndo spem meam erigéndam. Grátia plena, Dóminus tecum; benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus.',
          'Dios te salve, María Santísima, Madre de Dios Hijo, Virgen purísima en el parto, en tus manos ponemos nuestra esperanza para que la alientes. Llena eres de gracia, el Señor es contigo; bendita eres entre todas las mujeres, y bendito el fruto de tu vientre, Jesús.'),
        SANCTA_MARIA_R,
      ],
    },

    aveSponsa: {
      title: { la: 'Ave Sanctíssima — Spiritus Sancti Sponsa', es: 'Dios te salve — Esposa del Espíritu Santo' },
      lines: [
        p('Ave Sanctíssima María, Spíritus Sancti Sponsa, Virgo puríssima post partum, in manus tuas comméndo caritátem meam inflammándam. Grátia plena, Dóminus tecum; benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus.',
          'Dios te salve, María Santísima, Esposa de Dios Espíritu Santo, Virgen purísima después del parto, en tus manos ponemos nuestra caridad para que la inflames. Llena eres de gracia, el Señor es contigo; bendita eres entre todas las mujeres, y bendito el fruto de tu vientre, Jesús.'),
        SANCTA_MARIA_R,
      ],
    },

    aveTemplum: {
      title: { la: 'Ave Sanctíssima — Templum Trinitatis', es: 'Dios te salve — Templo de la Trinidad' },
      lines: [
        p('Ave Sanctíssima María, Templum et Sacrárium Sanctíssimæ et Augustíssimæ Trinitátis, Virgo puríssima sine labe originális concépta.',
          'Dios te salve, María Santísima, Templo y Sagrario de la Santísima y Augustísima Trinidad, Virgen purísima sin la culpa original.'),
        r('Salve, Regína, Mater misericórdiæ, vita, dulcédo, et spes nostra, salve. Ad te clamámus, éxsules fílii Hevæ. Ad te suspirámus, geméntes et flentes in hac lacrimárum valle. Eia, ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum, benedíctum fructum ventris tui, nobis post hoc exsílium osténde. O clemens, O pia, O dulcis Virgo María.',
          'Dios te salve, Reina, Madre de misericordia, vida, dulzura y esperanza nuestra. Dios te salve. A ti clamamos los desterrados hijos de Eva. A ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos. Y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente! ¡Oh piadosa! ¡Oh dulce Virgen María!'),
        ...ORA_PRO_NOBIS,
      ],
    },

    kyrie: {
      title: { la: 'Litaniæ Lauretanæ', es: 'Letanía Lauretana' },
      lines: [
        v('Kýrie, eléison.', 'Señor, ten piedad de nosotros.'),
        r('Kýrie, eléison.', 'Señor, ten piedad de nosotros.'),
        v('Christe, eléison.', 'Cristo, ten piedad de nosotros.'),
        r('Christe, eléison.', 'Cristo, ten piedad de nosotros.'),
        v('Kýrie, eléison.', 'Señor, ten piedad de nosotros.'),
        r('Kýrie, eléison.', 'Señor, ten piedad de nosotros.'),
        v('Christe, audi nos.', 'Cristo, óyenos.'),
        r('Christe, audi nos.', 'Cristo, óyenos.'),
        v('Christe, exáudi nos.', 'Cristo, escúchanos.'),
        r('Christe, exáudi nos.', 'Cristo, escúchanos.'),
        v('Pater de cælis, Deus,', 'Dios Padre celestial,'),
        r('miserére nobis.', 'ten piedad de nosotros.'),
        v('Fili, Redémptor mundi, Deus,', 'Dios Hijo, Redentor del mundo,'),
        r('miserére nobis.', 'ten piedad de nosotros.'),
        v('Spíritus Sancte, Deus,', 'Dios Espíritu Santo,'),
        r('miserére nobis.', 'ten piedad de nosotros.'),
        v('Sancta Trínitas, unus Deus,', 'Santísima Trinidad, que eres un solo Dios,'),
        r('miserére nobis.', 'ten piedad de nosotros.'),
      ],
    },

    agnus: {
      title: { la: 'Agnus Dei', es: 'Cordero de Dios' },
      lines: [
        v('Agnus Dei, qui tollis peccáta mundi,', 'Cordero de Dios, que quitas los pecados del mundo,'),
        r('parce nobis, Dómine.', 'perdónanos, Señor.'),
        v('Agnus Dei, qui tollis peccáta mundi,', 'Cordero de Dios, que quitas los pecados del mundo,'),
        r('exáudi nos, Dómine.', 'escúchanos, Señor.'),
        v('Agnus Dei, qui tollis peccáta mundi,', 'Cordero de Dios, que quitas los pecados del mundo,'),
        r('miserére nobis.', 'ten misericordia de nosotros.'),
      ],
    },

    antiphona1: {
      title: { la: 'Antiphona I', es: 'Antífona I' },
      lines: [
        p('Concéde nos, fámulos tuos, quǽsumus, Dómine Deus, perpétua mentis et córporis sanitáte gaudére: et gloriósa beátæ Maríæ semper Vírginis intercessióne, a præsénti liberári tristítia, et ætérna pérfrui lætítia. Per Christum Dóminum nostrum.',
          'Te rogamos, Señor, que nos concedas a nosotros tus siervos gozar de perpetua salud de alma y cuerpo; y por la gloriosa intercesión de la bienaventurada siempre Virgen María, seamos liberados de la tristeza presente y disfrutemos de la eterna alegría. Por Cristo nuestro Señor.'),
        r('Amen.', 'Amén.'),
      ],
    },

    antiphona2: {
      title: { la: 'Antiphona II', es: 'Antífona II' },
      lines: [
        p('Sub tuum præsídium confúgimus, Sancta Dei Génetrix: nostras deprecatiónes ne despícias in necessitátibus; sed a perículis cunctis líbera nos semper, Virgo gloriósa et benedícta.',
          'Bajo tu amparo nos acogemos, Santa Madre de Dios; no desprecies las súplicas que te dirigimos en nuestras necesidades, antes bien, líbranos de todo peligro, Virgen gloriosa y bendita.'),
        ...ORA_PRO_NOBIS,
      ],
    },

    oremus: {
      title: { la: 'Oremus', es: 'Oremos' },
      lines: [
        p('Deus, cuius Unigénitus per vitam, mortem et resurrectiónem suam nobis salútis ætérnæ prǽmia comparávit: concéde, quǽsumus; ut, hæc mystéria sacratíssimo beátæ Maríæ Vírginis Rosário recoléntes, et imitémur quod cóntinent, et quod promíttunt assequámur. Per eúndem Christum Dóminum nostrum. Amen.',
          'Oh Dios, cuyo Hijo Unigénito, por medio de su vida, muerte y resurrección, nos otorgó los premios de la vida eterna: te rogamos que, venerando humildemente los misterios del Rosario de la Santísima Virgen María, imitemos lo que contienen y consigamos lo que prometen. Por el mismo Cristo, nuestro Señor. Amén.'),
      ],
    },

    pontifex: {
      title: { la: 'Pro Pontifice', es: 'Por el Sumo Pontífice' },
      lines: [
        v('Orémus pro Pontífice nostro ' + PONTIFEX.la + '.', 'Oremos por nuestro Sumo Pontífice ' + PONTIFEX.es + '.'),
      ],
    },

    defuncti: {
      title: { la: 'Pro fidelibus defunctis', es: 'Por los fieles difuntos' },
      lines: [
        p('Orémus pro fidélibus defúnctis.', 'Oremos por los fieles difuntos.'),
        v('Réquiem ætérnam dona eis, Dómine.', 'Dales, Señor, el descanso eterno.'),
        r('Et lux perpétua lúceat eis.', 'Y brille para ellos la luz perpetua.'),
        v('Requiéscant in pace.', 'Descansen en paz.'),
        r('Amen.', 'Amén.'),
      ],
    },

    preces: {
      title: { la: 'Preces finales', es: 'Preces finales' },
      lines: [
        v('Regína Sacratíssimi Rosárii,', 'Reina del Sacratísimo Rosario,'),
        r('ora pro nobis.', 'ruega por nosotros.'),
        v('Nos cum prole pia', 'Con su descendencia pía'),
        r('benedícat Virgo María.', 'nos bendiga la Virgen María.'),
        v('O María, sine labe concépta,', 'Oh María, sin pecado concebida,'),
        r('ora pro nobis, qui confúgimus ad Te.', 'ruega por nosotros, que recurrimos a Vos.'),
      ],
    },

    memorare: {
      title: { la: 'Memorare', es: 'Acordaos' },
      lines: [
        p('Memoráre, o piíssima Virgo María, non esse audítum a sǽculo, quemquam ad tua curréntem præsídia, tua implorántem auxília, tua peténtem suffrágia, esse derelíctum. Ego tali animátus confidéntia, ad te, Virgo Vírginum, Mater, curro, ad te vénio, coram te gemens peccátor assísto. Noli, Mater Verbi, verba mea despícere; sed audi propítia et exáudi. Amen.',
          'Acordaos, ¡oh piadosísima Virgen María!, que jamás se ha oído decir que ninguno de los que han acudido a vuestra protección, implorando vuestra asistencia y reclamando vuestro socorro, haya sido abandonado de vos. Animado por esta confianza, a vos también acudo, ¡oh Madre, Virgen de las vírgenes!, y aunque gimiendo bajo el peso de mis pecados, me atrevo a comparecer ante vuestra presencia soberana. No desechéis, ¡oh Madre del Verbo!, mis súplicas; antes bien, escuchadlas y acogedlas benignamente. Amén.'),
      ],
    },
  };

  // Letanía: invocaciones a las que se responde "ora pro nobis / ruega por nosotros".
  // Divididas en tres grupos para que cada pantalla sea cómoda de leer.
  const LITANIA = [
    {
      title: { la: 'Sancta Maria · Mater Christi', es: 'Santa María · Madre de Jesucristo' },
      items: [
        ['Sancta María,', 'Santa María,'],
        ['Sancta Dei Génetrix,', 'Santa Madre de Dios,'],
        ['Sancta Virgo vírginum,', 'Santa Virgen de las vírgenes,'],
        ['Mater Christi,', 'Madre de Jesucristo,'],
        ['Mater divínæ grátiæ,', 'Madre de la divina gracia,'],
        ['Mater puríssima,', 'Madre purísima,'],
        ['Mater castíssima,', 'Madre castísima,'],
        ['Mater invioláta,', 'Madre inviolada,'],
        ['Mater intemeráta,', 'Madre sin defecto,'],
        ['Mater immaculáta,', 'Madre inmaculada,'],
        ['Mater amábilis,', 'Madre amable,'],
        ['Mater admirábilis,', 'Madre admirable,'],
        ['Mater boni consílii,', 'Madre del buen consejo,'],
        ['Mater Creatóris,', 'Madre del Creador,'],
        ['Mater Salvatóris,', 'Madre del Salvador,'],
      ],
    },
    {
      title: { la: 'Virgo prudentissima · Speculum iustitiæ', es: 'Virgen prudentísima · Espejo de justicia' },
      items: [
        ['Virgo prudentíssima,', 'Virgen prudentísima,'],
        ['Virgo veneránda,', 'Virgen venerada,'],
        ['Virgo prædicánda,', 'Virgen laudable,'],
        ['Virgo potens,', 'Virgen poderosa,'],
        ['Virgo clemens,', 'Virgen clemente,'],
        ['Virgo fidélis,', 'Virgen fiel,'],
        ['Spéculum iustítiæ,', 'Espejo de justicia,'],
        ['Sedes sapiéntiæ,', 'Trono de la sabiduría,'],
        ['Causa nostræ lætítiæ,', 'Causa de nuestra alegría,'],
        ['Rosa mýstica,', 'Rosa mística,'],
        ['Turris Davídica,', 'Torre de David,'],
        ['Turris ebúrnea,', 'Torre de marfil,'],
        ['Domus áurea,', 'Casa de oro,'],
        ['Iánua cæli,', 'Puerta del cielo,'],
        ['Stella matutína,', 'Estrella de la mañana,'],
        ['Salus infirmórum,', 'Salud de los enfermos,'],
        ['Refúgium peccatórum,', 'Refugio de los pecadores,'],
        ['Consolátrix afflictórum,', 'Consuelo de los afligidos,'],
        ['Auxílium christianórum,', 'Auxilio de los cristianos,'],
      ],
    },
    {
      title: { la: 'Regina Angelorum', es: 'Reina de los Ángeles' },
      items: [
        ['Regína Angelórum,', 'Reina de los Ángeles,'],
        ['Regína Patriarchárum,', 'Reina de los Patriarcas,'],
        ['Regína Prophetárum,', 'Reina de los Profetas,'],
        ['Regína Apostolórum,', 'Reina de los Apóstoles,'],
        ['Regína Mártyrum,', 'Reina de los Mártires,'],
        ['Regína Confessórum,', 'Reina de los Confesores,'],
        ['Regína Vírginum,', 'Reina de las Vírgenes,'],
        ['Regína Sanctórum ómnium,', 'Reina de todos los Santos,'],
        ['Regína sine labe origináli concépta,', 'Reina concebida sin pecado original,'],
        ['Regína in cælum assúmpta,', 'Reina elevada al cielo,'],
        ['Regína Sacratíssimi Rosárii,', 'Reina del Santísimo Rosario,'],
      ],
    },
  ];
  const LITANIA_RESP = { la: 'ora pro nobis.', es: 'ruega por nosotros.' };

  // Misterios. `dias` usa Date.getDay(): 0 = domingo … 6 = sábado.
  const MISTERIOS = {
    gozosos: {
      id: 'gozosos',
      name: { la: 'Mystéria Gaudiósa', es: 'Misterios Gozosos' },
      adj: { la: 'gaudiosum', es: 'gozoso' },
      when: { la: 'in feria secunda et in feria quinta', es: 'Lunes y jueves' },
      dias: [1, 4],
      list: [
        {
          short: { la: 'Annuntiatio', es: 'La Anunciación' },
          fruit: { la: 'Humilitas', es: 'La humildad' },
          la: 'Beátæ Maríæ Vírginis annuntiatiónem contemplámur, et humílitas pétitur.',
          es: 'Se contempla la Anunciación de la Santísima Virgen María y se pide la humildad.',
        },
        {
          short: { la: 'Visitatio', es: 'La Visitación' },
          fruit: { la: 'Cháritas ad fratres', es: 'El amor al prójimo' },
          la: 'Beátæ Maríæ Vírginis visitatiónem contemplámur, et cháritas ad fratres pétitur.',
          es: 'Se contempla la Visitación de la Santísima Virgen María a su prima Santa Isabel y se pide el amor al prójimo.',
        },
        {
          short: { la: 'Nativitas', es: 'El Nacimiento de Jesús' },
          fruit: { la: 'Paupertátis spíritus', es: 'El amor a la pobreza' },
          la: 'Dómini nostri Iesu Christi nativitátem contemplámur, et paupertátis spíritus pétitur.',
          es: 'Se contempla la Natividad de nuestro Señor Jesucristo y se pide el amor a la pobreza.',
        },
        {
          short: { la: 'Præsentatio in templo', es: 'La Presentación en el templo' },
          fruit: { la: 'Obediéntia', es: 'La obediencia' },
          la: 'Dómini nostri Iesu Christi præsentatiónem in templo contemplámur, et obediéntia pétitur.',
          es: 'Se contempla la Presentación de nuestro Señor Jesucristo en el templo y se pide la obediencia.',
        },
        {
          short: { la: 'Inventio in templo', es: 'El Niño hallado en el templo' },
          fruit: { la: 'Deum inquiréndi volúntas', es: 'El deseo de buscar a Dios' },
          la: 'Dómini nostri Iesu Christi inventiónem in templo contemplámur, et Deum inquiréndi volúntas pétitur.',
          es: 'Se contempla el hallazgo de nuestro Señor Jesucristo en el templo y se pide el deseo de buscar a Dios.',
        },
      ],
    },
    dolorosos: {
      id: 'dolorosos',
      name: { la: 'Mystéria Dolorósa', es: 'Misterios Dolorosos' },
      adj: { la: 'dolorosum', es: 'doloroso' },
      when: { la: 'in feria tertia et in feria sexta', es: 'Martes y viernes' },
      dias: [2, 5],
      list: [
        {
          short: { la: 'Oratio in horto', es: 'La Oración en el huerto' },
          fruit: { la: 'Dolor pro peccatis', es: 'La contrición de nuestros pecados' },
          la: 'Dómini nostri Iesu Christi oratiónem in horto contemplámur, et dolor pro peccátis nostris pétitur.',
          es: 'Se contempla la oración y la agonía de nuestro Señor Jesucristo en el huerto y se pide la contrición de nuestros pecados.',
        },
        {
          short: { la: 'Flagellatio', es: 'La Flagelación' },
          fruit: { la: 'Córporum mortificátio', es: 'La mortificación de los sentidos' },
          la: 'Dómini nostri Iesu Christi flagellatiónem contemplámur, et córporum nostrórum mortificátio pétitur.',
          es: 'Se contempla la flagelación de nuestro Señor Jesucristo y se pide la mortificación de nuestros sentidos.',
        },
        {
          short: { la: 'Coronatio spinis', es: 'La Coronación de espinas' },
          fruit: { la: 'Supérbiæ mortificátio', es: 'La mortificación de la soberbia' },
          la: 'Dómini nostri Iesu Christi spinis coronatiónem contemplámur, et supérbiæ mortificátio pétitur.',
          es: 'Se contempla la coronación de espinas de nuestro Señor Jesucristo y se pide la mortificación de nuestra soberbia.',
        },
        {
          short: { la: 'Baiulatio Crucis', es: 'Jesús con la Cruz a cuestas' },
          fruit: { la: 'Patiéntia', es: 'La paciencia en las tribulaciones' },
          la: 'Dómini nostri Iesu Christi crucis baiulatiónem contemplámur, et patiéntia in tribulatiónibus pétitur.',
          es: 'Se contempla a nuestro Señor Jesucristo con la Cruz a cuestas y se pide la paciencia en las tribulaciones.',
        },
        {
          short: { la: 'Crucifixio', es: 'La Crucifixión y muerte' },
          fruit: { la: 'Animárum redémptio', es: 'El amor de Dios y la redención de las almas' },
          la: 'Dómini nostri Iesu Christi crucifixiónem et mortem contemplámur, et sui ipsíus donum ad animárum redemptiónem pétitur.',
          es: 'Se contempla la Crucifixión y muerte de nuestro Señor Jesucristo y se pide el amor de Dios y la redención de las almas.',
        },
      ],
    },
    gloriosos: {
      id: 'gloriosos',
      name: { la: 'Mystéria Gloriósa', es: 'Misterios Gloriosos' },
      adj: { la: 'gloriosum', es: 'glorioso' },
      when: { la: 'in Domínica, in feria quarta et in sábbato', es: 'Domingo, miércoles y sábado' },
      dias: [0, 3, 6],
      list: [
        {
          short: { la: 'Resurrectio', es: 'La Resurrección' },
          fruit: { la: 'Fides', es: 'La fe' },
          la: 'Dómini nostri Iesu Christi resurrectiónem contemplámur, et fides pétitur.',
          es: 'Se contempla la Resurrección de nuestro Señor Jesucristo y se pide la fe.',
        },
        {
          short: { la: 'Ascensio', es: 'La Ascensión' },
          fruit: { la: 'Spes', es: 'La esperanza y el deseo del cielo' },
          la: 'Dómini nostri Iesu Christi in cælum ascensiónem contemplámur, et spes pétitur.',
          es: 'Se contempla la Ascensión de nuestro Señor Jesucristo y se pide la esperanza y el deseo del cielo.',
        },
        {
          short: { la: 'Descensio Spiritus Sancti', es: 'La venida del Espíritu Santo' },
          fruit: { la: 'Cháritas ad Deum', es: 'La caridad' },
          la: 'Spíritus Sancti descensiónem contemplámur, et cháritas ad Deum pétitur.',
          es: 'Se contempla la venida del Espíritu Santo sobre los Apóstoles y se pide la caridad.',
        },
        {
          short: { la: 'Assumptio', es: 'La Asunción' },
          fruit: { la: 'Bene moriéndi grátia', es: 'La gracia de una buena muerte' },
          la: 'Beátæ Maríæ Vírginis in cælum assumptiónem contemplámur, et bene moriéndi grátia pétitur.',
          es: 'Se contempla la Asunción de la Santísima Virgen María y se pide la gracia de una buena muerte.',
        },
        {
          short: { la: 'Coronatio B. M. V.', es: 'La Coronación de María' },
          fruit: { la: 'Fidúcia in María', es: 'La confianza en María' },
          la: 'Beátæ Maríæ Vírginis coronatiónem contemplámur, et fidúcia in María Regína nostra pétitur.',
          es: 'Se contempla la Coronación de la Santísima Virgen María como Reina nuestra y se pide la confianza en María.',
        },
      ],
    },
  };

  const DIAS = {
    es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    la: ['Domínica', 'Féria secúnda', 'Féria tértia', 'Féria quarta', 'Féria quinta', 'Féria sexta', 'Sábbatum'],
  };

  const ORDINALES = {
    es: ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto'],
    la: ['Primum', 'Secúndum', 'Tértium', 'Quartum', 'Quintum'],
  };

  // Rúbricas (indicaciones en rojo del folleto).
  const RUBRICAS = {
    presencia: 'Pongámonos en presencia de Dios.',
    misterio: 'Se enuncia el misterio que se va a meditar; hecho esto se rezan 1 Padre Nuestro, 10 Ave Marías, 1 Gloria y las jaculatorias.',
    finales: 'Concluidos los misterios, se reza un Padre Nuestro y a continuación las siguientes oraciones.',
    letania: 'Récese ahora la Letanía Lauretana.',
    antifonas: 'Antífonas del Santo Rosario (no es necesario recitar ambas).',
    pontifice: 'Se reza un Padre Nuestro, un Ave María y un Gloria por las intenciones del Sumo Pontífice.',
  };

  window.ROSARIO = { P, LITANIA, LITANIA_RESP, MISTERIOS, DIAS, ORDINALES, RUBRICAS };
})();
