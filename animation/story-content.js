/* All on-screen UI strings for the v3 stories, per reel and language.
   Voice/headline texts come from timing/*.json; this file holds phone UI and glass-card texts. */

export const UI = {
  de: { plan: 'SCHICHTPLAN', open: 'offen', gap: '1 Schicht offen', full: 'Alle Schichten besetzt', cta: 'Mehr dazu', ctaEm: 'im Profil.', msg: 'Nachricht', now: 'jetzt',
        names: ['Anna', 'Lena', 'Jonas', 'Mehmet', 'Mara'], tags: ['Früh', 'Kasse 2', 'Lager', 'Spät', 'Kasse 1'], branch: 'Filiale Mitte' },
  en: { plan: 'SHIFT PLAN', open: 'open', gap: '1 shift open', full: 'All shifts covered', cta: 'More in', ctaEm: 'our profile.', msg: 'Message', now: 'now',
        names: ['Anna', 'Lena', 'Jonas', 'Mike', 'Mara'], tags: ['Early', 'Till 2', 'Stock', 'Late', 'Till 1'], branch: 'Main Street' },
  ru: { plan: 'ГРАФИК СМЕН', open: 'свободно', gap: '1 смена не закрыта', full: 'Все смены закрыты', cta: 'Подробнее', ctaEm: 'в профиле.', msg: 'Сообщение', now: 'сейчас',
        names: ['Анна', 'Лена', 'Олег', 'Тимур', 'Марина'], tags: ['Утро', 'Касса 2', 'Склад', 'Вечер', 'Касса 1'], branch: 'Центр' },
  uk: { plan: 'ГРАФІК ЗМІН', open: 'вільно', gap: '1 зміна не закрита', full: 'Усі зміни закриті', cta: 'Детальніше', ctaEm: 'у профілі.', msg: 'Повідомлення', now: 'зараз',
        names: ['Анна', 'Лена', 'Олег', 'Тарас', 'Марина'], tags: ['Ранок', 'Каса 2', 'Склад', 'Вечір', 'Каса 1'], branch: 'Центр' },
};

/* per reel: home chat (title, status pill, 3 messages), work pain cards, turn cards, plan day + gap row */
export const STORY = {
  a: {
    prop: 'keys', gapRow: 0, gapTag: { de: 'Öffnen 6:00', en: 'Open 6 AM', ru: 'Открытие 6:00', uk: 'Відкриття 6:00' },
    day: { de: 'Samstag', en: 'Saturday', ru: 'Суббота', uk: 'Субота' },
    date: { de: '30. November', en: 'November 30', ru: '30 ноября', uk: '30 листопада' },
    home: {
      de: { title: 'Familie', time: '15:42', pill: 'Kita schließt um 16:00', m: [['Mama', 'Holt heute jemand die Kinder?'], ['Papa', 'Dachte, du machst das.'], ['Oma', 'Ich dachte, ihr zwei.']] },
      en: { title: 'Family', time: '3:42', pill: 'Daycare closes at 4 PM', m: [['Mom', 'Is anyone picking up the kids?'], ['Dad', 'Thought you were.'], ['Grandma', 'I thought you two were.']] },
      ru: { title: 'Семья', time: '15:42', pill: 'Садик закрывается в 16:00', m: [['Мама', 'Кто сегодня забирает детей?'], ['Папа', 'Думал, ты.'], ['Бабушка', 'Я думала, вы двое.']] },
      uk: { title: 'Родина', time: '15:42', pill: 'Садочок зачиняється о 16:00', m: [['Мама', 'Хто сьогодні забирає дітей?'], ['Тато', 'Думав, ти.'], ['Бабуся', 'Я думала, ви двоє.']] },
    },
    pain: {
      de: [['Filiale', 'Wer schließt Samstag auf?'], ['Jonas', 'Dachte, Mara hat den Schlüssel.'], ['Mara', 'Ich dachte, du.']],
      en: [['Store', 'Who opens on Saturday?'], ['Jonas', 'Thought Mara had the keys.'], ['Mara', 'I thought you did.']],
      ru: [['Магазин', 'Кто открывает в субботу?'], ['Олег', 'Думал, ключи у Марины.'], ['Марина', 'Я думала, у тебя.']],
      uk: [['Магазин', 'Хто відчиняє в суботу?'], ['Олег', 'Думав, ключі в Марини.'], ['Марина', 'Я думала, в тебе.']],
    },
    turn: {
      de: [['Samstag', 'Öffnen 6:00 · Anna'], ['Schlüssel', 'Bei Anna · bestätigt']],
      en: [['Saturday', 'Open 6 AM · Anna'], ['Keys', 'With Anna · confirmed']],
      ru: [['Суббота', 'Открытие 6:00 · Анна'], ['Ключи', 'У Анны · подтверждено']],
      uk: [['Субота', 'Відкриття 6:00 · Анна'], ['Ключі', 'В Анни · підтверджено']],
    },
  },
  b: {
    prop: 'milk', gapRow: 3, gapTag: null,
    day: { de: 'Heute', en: 'Today', ru: 'Сегодня', uk: 'Сьогодні' },
    date: { de: 'Dienstag, 26. November', en: 'Tuesday, November 26', ru: 'Вторник, 26 ноября', uk: 'Вівторок, 26 листопада' },
    home: {
      de: { title: 'WG Küche', time: '18:05', pill: '3 Packungen im Kühlschrank', m: [['Lisa', 'Kann jemand Milch mitbringen?'], ['Tom', 'Bring ich mit.'], ['Paul', 'Hab schon welche.']] },
      en: { title: 'Flat kitchen', time: '6:05', pill: '3 cartons in the fridge', m: [['Lisa', 'Can someone grab milk?'], ['Tom', 'On it.'], ['Paul', 'Already got some.']] },
      ru: { title: 'Кухня', time: '18:05', pill: 'В холодильнике 3 пакета', m: [['Лиза', 'Кто-нибудь купит молоко?'], ['Тимур', 'Куплю.'], ['Павел', 'Я уже взял.']] },
      uk: { title: 'Кухня', time: '18:05', pill: 'У холодильнику 3 пакети', m: [['Ліза', 'Хтось купить молоко?'], ['Тарас', 'Куплю.'], ['Павло', 'Я вже взяв.']] },
    },
    pain: {
      de: [['Früh', '2 Leute eingetragen'], ['Spät', 'Niemand eingetragen'], ['Chef', 'Wer kommt heute Abend?']],
      en: [['Morning', '2 people booked'], ['Evening', 'Nobody booked'], ['Manager', 'Who is on tonight?']],
      ru: [['Утро', 'Записаны двое'], ['Вечер', 'Никого'], ['Управляющий', 'Кто сегодня вечером?']],
      uk: [['Ранок', 'Записані двоє'], ['Вечір', 'Нікого'], ['Керівник', 'Хто сьогодні ввечері?']],
    },
    turn: {
      de: [['Spät', 'Mehmet übernimmt · bestätigt'], ['Früh', 'Voll · nichts doppelt']],
      en: [['Evening', 'Mike takes it · confirmed'], ['Morning', 'Full · nothing twice']],
      ru: [['Вечер', 'Тимур берёт · подтверждено'], ['Утро', 'Заполнено · без дублей']],
      uk: [['Вечір', 'Тарас бере · підтверджено'], ['Ранок', 'Заповнено · без дублів']],
    },
  },
  c: {
    prop: 'note', gapRow: 4, gapTag: null,
    day: { de: 'Montag', en: 'Monday', ru: 'Понедельник', uk: 'Понеділок' },
    date: { de: '2. Dezember', en: 'December 2', ru: '2 декабря', uk: '2 грудня' },
    home: {
      de: { title: 'Familie', time: '19:20', pill: 'Zahnarzt · Termin verpasst', m: [['Anna', 'Wann war der Zahnarzt?'], ['Max', 'Stand auf dem Zettel am Kühlschrank.'], ['Anna', 'Der Zettel ist weg.']] },
      en: { title: 'Family', time: '7:20', pill: 'Dentist · appointment missed', m: [['Anna', 'When was the dentist?'], ['Max', 'It was on the note on the fridge.'], ['Anna', 'The note is gone.']] },
      ru: { title: 'Семья', time: '19:20', pill: 'Стоматолог · запись пропущена', m: [['Аня', 'Когда был стоматолог?'], ['Макс', 'На записке на холодильнике.'], ['Аня', 'Записки нет.']] },
      uk: { title: 'Родина', time: '19:20', pill: 'Стоматолог · запис пропущено', m: [['Аня', 'Коли був стоматолог?'], ['Макс', 'На записці на холодильнику.'], ['Аня', 'Записки немає.']] },
    },
    pain: {
      de: [['Pinnwand', 'Neuer Plan · nur als Aushang'], ['Montag', 'Kasse 1 nicht besetzt'], ['Lea', 'Hab den neuen Plan nicht gesehen.']],
      en: [['Notice board', 'New plan · printout only'], ['Monday', 'Till 1 not covered'], ['Lea', "Didn't see the new plan."]],
      ru: [['Доска', 'Новый график · только на листке'], ['Понедельник', 'Касса 1 не закрыта'], ['Лея', 'Не видела новый график.']],
      uk: [['Дошка', 'Новий графік · лише на аркуші'], ['Понеділок', 'Каса 1 не закрита'], ['Лея', 'Не бачила новий графік.']],
    },
    turn: {
      de: [['Änderung', 'Montag · Kasse 1 · Mara'], ['Erinnerung', 'Morgen 7:00 · Kasse 1']],
      en: [['Change', 'Monday · Till 1 · Mara'], ['Reminder', 'Tomorrow 7 AM · Till 1']],
      ru: [['Изменение', 'Понедельник · Касса 1 · Марина'], ['Напоминание', 'Завтра 7:00 · Касса 1']],
      uk: [['Зміна', 'Понеділок · Каса 1 · Марина'], ['Нагадування', 'Завтра 7:00 · Каса 1']],
    },
  },
};
