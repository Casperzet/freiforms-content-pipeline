# -*- coding: utf-8 -*-
"""Second layer: Ukrainian version, process/payment section, legal pages. Mutates content.* dicts."""
import content as C

C.LANG_PATH["uk"] = "uk/"
C.LANG_NAME["uk"] = "Українська"
C.LANG_LOCALE_OG["uk"] = "uk_UA"
C.DEFAULT_MARKET["uk"] = "UA"
C.MARKET_META["UA"] = dict(lang="uk", locale="uk-UA", cur="UAH", rate=250, chan="tg")
LANG_SHORT = {"en": "EN", "ru": "RU", "de": "DE", "uk": "UA"}
BRAND = C.BRAND

# ----------------------------------------------------------------- UKRAINIAN
C.LANGS["uk"] = dict(
    title=BRAND + " – навігатор змін, асистент для замовлень і сайт для вашого бізнесу",
    desc="Планування змін, завдання, чат та асистент для заявок клієнтів, сайт для малого й середнього бізнесу. Підлаштовуємо під ваш ринок. Безкоштовний вступний дзвінок.",
    nav=dict(industries="Галузі", products="Продукти", demo="Демо", roi="Економія", plans="Пакети", faq="Питання"),
    nav_cta="Безкоштовний дзвінок", skip="Перейти до вмісту", theme="Змінити тему",
    market_label="Ринок", preview="Попередній перегляд: сайт ще не запущено.",
    hero_badge="Для малих і середніх команд",
    hero_h1="Кожна зміна <em class='serif accent'>без хаосу.</em>",
    hero_lead="Навігатор змін і завдань для команд від 5 до 500 людей. Графіки, завдання, чат і сповіщення на кожному телефоні. Плюс асистент для замовлень і сайт, налаштовані під ваш ринок.",
    hero_cta1="Безкоштовний вступний дзвінок", hero_cta2="Дивитися демо",
    checks=["Працює в браузері телефона, без магазину застосунків", "Фіксована ціна після короткого аналізу", "Ваша мова, валюта і правила"],
    toasts=["Обмін змінами схвалено: Анна і Марко", "Нове замовлення від асистента", "Завдання виконано: поставку перевірено"],
    hero_phone=dict(shift="Пн · Ранкова зміна", time="06:00 – 14:00", head="Ваші завдання",
                    tasks=["Прийняти ранкову поставку", "Перевірити терміни придатності, ряд 4", "Каса 2 з 10:00", "Викласти овочі"],
                    chat="Чат команди", sos="SOS"),
    market_title="Оберіть країну. <em class='serif accent'>Ми підлаштуємо пропозицію.</em>",
    market_sub="Сторінка змінює акцент, галузі, валюту й канал зв'язку під ваш ринок. Це наші робочі гіпотези щодо кожної країни, на дзвінку ми підтвердимо їх разом із вами.",
    suggested="З чого почати",
    ind_kicker="Швидка перевірка", ind_title="Чим займається ваш бізнес?",
    ind_sub="Оберіть галузь. Покажемо типові проблеми та відповідні інструменти.",
    ind_typical="Типово для", ind_reco="Наша порада", ind_ask="Запросити такий набір",
    industries=dict(
        retail=dict(label="Роздріб і продукти", pains=["Графік змін живе фото в спільному чаті", "Приймання й перевірка термінів на папері", "Завдання голосом, у керівника немає картини"], recs=["shift", "apps"], why="Зміни, завдання й перевірки на кожному телефоні. Накладні та документи самі доходять до офісу."),
        food=dict(label="Кафе й ресторани", pains=["Обміни змінами й лікарняні тонуть у чатах", "Бронювання й замовлення лише телефоном", "Журнали гігієни на папері"], recs=["shift", "bot"], why="Графік і санітарні перевірки в одному застосунку. Асистент приймає бронювання й замовлення цілодобово."),
        care=dict(label="Клініки та догляд", pains=["Графіки й маршрути з'їдають години", "Записи двічі: на папері й у комп'ютері", "Кожен запис на прийом це дзвінок"], recs=["shift", "web"], why="Працівники бачать зміни та завдання в телефоні, пацієнти записуються онлайн."),
        trades=dict(label="Ремесла та послуги", pains=["Замовлення й матеріали на клаптиках паперу", "Рахунки йдуть із запізненням на тижні", "Заявки надходять лише телефоном"], recs=["apps", "web"], why="Кожне замовлення йде від пропозиції до рахунку в одному застосунку, нові клієнти записуються через сайт."),
        logistics=dict(label="Склад і логістика", pains=["Склад бригад вирішується на ходу", "Завантаження й розвантаження не фіксуються", "Про інциденти дізнаються пізно"], recs=["shift", "apps"], why="Завдання йдуть за вантажем, бригади бачать свою зміну, а інциденти доходять до старшого за секунди."),
    ),
    prod_kicker="Продукти", prod_title="Чотири інструменти. <em class='serif accent'>Один спокійний бізнес.</em>",
    prod_sub="Почніть з одного. Додайте наступний, коли будете готові.", before="Було", after="З " + BRAND,
    products=dict(
        shift=dict(name="Навігатор змін", tag="Графіки, завдання, команда онлайн", before="Графік це фото в чаті, роботу роздають голосом, ніхто не знає, що зроблено.", after=["Кожен бачить зміну й завдання в телефоні", "Керівник роздає роботу онлайн і бачить прогрес", "Обміни, чат, фото та кнопка SOS", "Години й перерви рахуються за вашими лімітами"]),
        apps=dict(name="Застосунки для процесів", tag="Папери, замовлення, погодження", before="Замовлення на аркушиках, форми вводяться знову й знову, рахунки із запізненням.", after=["Кожна робота йде від заявки до рахунку в одному застосунку", "Форми заповнюються з наявних даних", "Терміни й погодження нагадують про себе самі", "Звіти одним дотиком"]),
        bot=dict(name="Асистент для замовлень і чату", tag="Клієнти обслуговані цілодобово", before="Клієнт пише вночі, а відповідь отримує за два дні.", after=["Відповідає на поширені питання у ваших каналах", "Приймає замовлення й записи та збирає деталі", "Передає вам лише заявки, на які варто витрачати час", "Усі звернення в одному списку"]),
        web=dict(name="Сайт", tag="Щоб знаходили й записувалися", before="Сайт виглядає застарілим, заявки надходять лише телефоном.", after=["Сучасний швидкий дизайн для телефона", "Онлайн-запис і форми заявок", "Заявки надходять у пошту або чат", "Основи локального пошуку включено"]),
    ),
    demo_kicker="Спробуйте", demo_title="Навігатор змін. <em class='serif accent'>Натискайте.</em>",
    demo_text="Так виглядає зміна для вашої команди. Позначайте завдання або натисніть SOS. У роботі все так само просто.",
    demo_stats=["Завдань виконано", "Прогрес", "Папірців не потрібно"], demo_reset="Почати зміну знову", demo_cta="Запросити для мого бізнесу",
    demo_phone=dict(hi="Привіт, Анно", shift="Сьогодні · Ранкова зміна", tasks=["Прийняти ранкову поставку", "Перевірити терміни придатності, ряд 4", "Відкрити касу 2 о 10:00", "Викласти овочі", "Здати тару"], chat="Чат команди", sos="SOS", sosmsg="SOS надіслано старшому зміни", all="Усе зроблено. Чудова робота!"),
    roi_kicker="Ваша економія", roi_title="Скільки адміністрування коштує вам <em class='serif accent'>на рік?</em>",
    roi=dict(hours="Годин адміністрування на тиждень", rate="Вартість години", share="Частка, яку можна автоматизувати (припущення)", result="Потенціал на рік", equals="це", hrs="годин роботи", or_="або близько", days="робочих днів", unit_h="год", note="Оцінка за вашими даними та 46 робочими тижнями. Реальну цифру порахуємо разом на безкоштовному дзвінку.", cta="Перевірити мій потенціал", hint="Усі люди разом: офіс, планування, форми, погодження."),
    plans_kicker="Пакети", plans_title="Зрозумілі пакети. <em class='serif accent'>Фіксована ціна.</em>",
    gift="Сайт у подарунок: оплатіть пакет «Зростання» наперед, і сайт входить у вартість.",
    tiers=[
        dict(name="Старт", desc="Один інструмент для найгострішої проблеми.", feats=["Навігатор змін або один застосунок для процесів", "Налаштування під вашу команду", "Коротке навчання", "Підтримка на запуску"], badge=""),
        dict(name="Зростання", desc="Навігатор, асистент і сайт, що працюють разом.", feats=["Навігатор змін", "Асистент для замовлень і чату", "Сайт включено при передоплаті", "Зведена панель для власника"], badge="Сайт у подарунок"),
        dict(name="Індивідуально", desc="Кілька точок або особливі правила.", feats=["Кілька майданчиків і ролей", "Підключення до ваших систем", "Правила під ваші трудові домовленості", "Пріоритетна підтримка"], badge=""),
    ],
    price_line="Розрахунок після безкоштовного дзвінка", price_cta="Отримати розрахунок",
    faq_title="Часті питання",
    faq=[("Як швидко можна почати?", "Після безкоштовного дзвінка й короткого аналізу ми погоджуємо обсяг і фіксовану ціну. Перша робоча версія зазвичай це питання тижнів, а не місяців."),
         ("Працівникам потрібно щось встановлювати?", "Ні. Усе відкривається в браузері телефона й додається на головний екран. Без магазину застосунків і зайвих акаунтів з вашого боку."),
         ("Де зберігаються наші дані?", "Регіон розміщення ми погоджуємо з вами до старту. Для клієнтів із ЄС використовуємо хостинг у ЄС."),
         ("Чи враховуються наші трудові правила?", "Години й перерви рахуються за лімітами, які задаєте ви, тож планування лишається у ваших межах. Це допомога в плануванні, а не юридична консультація. Звіряйтеся з місцевим трудовим законодавством."),
         ("Що входить у сайт у подарунок?", "При передоплаті пакета «Зростання» ми робимо сучасний сайт із записом або формою заявки. Деталі фіксуються в пропозиції до оплати.")],
    ct_kicker="Безкоштовний вступний дзвінок", ct_title="Розкажіть про ваш бізнес",
    ct=dict(name="Ваше ім'я", contact="Телефон, пошта або месенджер", size="Розмір команди", sizes=["1–10 людей", "11–50 людей", "51–200 людей", "200+ людей"], msg="Що має працювати краще?", consent="Погоджуюсь, щоб зі мною зв'язалися щодо заявки.", send="Надіслати заявку", sending="Надсилаємо …", sent_t="Дякуємо!", sent_p="Скоро відповімо й запропонуємо час для дзвінка.", sent_preview="(Попередній перегляд: заявку не надіслано.)", err="Заповніть:", err_name="ім'я", err_contact="контакт", err_consent="згоду", fail="Не вдалося надіслати. Скористайтеся прямим каналом праворуч.", direct="Або напишіть напряму", copy="Копіювати", copied="Скопійовано"),
    foot_about="Навігатори змін, асистенти й сайти для бізнесу.", foot_note="Допомога в плануванні годин і перерв, не юридична консультація.", foot_links="Розділи",
)
C.MARKETS["uk"] = {
    "UA": dict(name="Україна", tag="Для бізнесу в Україні", lead2="Зміни, завдання й заявки клієнтів в одному застосунку. Зручно працювати через Telegram.", lead=["shift", "bot"], order=["retail", "food", "trades", "logistics", "care"]),
}

# ----------------------------------------------------------------- EXTRA KEYS FOR ALL LANGUAGES
EXTRA = {
    "en": dict(
        nav_process="How it works",
        proc_kicker="Process and payment", proc_title="Five steps. <em class='serif accent'>Nothing hidden.</em>",
        proc_sub="You know the scope and the price in writing before you pay anything.",
        steps=[("Free intro call", "A short call about your business and what slows it down."),
               ("Written offer", "Scope, deliverables and a fixed price on paper."),
               ("Prepayment", "We send an invoice or a payment link. Prepaying the Growth plan includes the website."),
               ("Build and launch", "You see a working version early and give feedback. Then we go live with your team."),
               ("Support", "Help in the first weeks, changes by agreement.")],
        pay_title="How payment works",
        pay_points=["No payments are taken on this website.", "You pay by invoice or payment link after the call and the written offer.", "Currency and payment method are written into your offer."],
        pay_generic="Invoice with bank details. Currency and method are confirmed in your offer.",
        legal=dict(privacy="Privacy", terms="Terms", seller="Seller details"),
    ),
    "ru": dict(
        nav_process="Как работаем",
        proc_kicker="Процесс и оплата", proc_title="Пять шагов. <em class='serif accent'>Ничего скрытого.</em>",
        proc_sub="Объём работ и цену вы видите в письменном виде до любой оплаты.",
        steps=[("Бесплатный вводный звонок", "Короткий разговор о вашем бизнесе и о том, что тормозит работу."),
               ("Письменное предложение", "Объём, результат и фиксированная цена на бумаге."),
               ("Предоплата", "Мы отправляем счёт или ссылку на оплату. Предоплата пакета «Рост» включает сайт."),
               ("Разработка и запуск", "Вы рано видите рабочую версию и даёте отзыв. Затем запускаем вместе с вашей командой."),
               ("Поддержка", "Помощь в первые недели, доработки по договорённости.")],
        pay_title="Как проходит оплата",
        pay_points=["Платежи на этом сайте не принимаются.", "Вы платите по счёту или по ссылке после звонка и письменного предложения.", "Валюта и способ оплаты указываются в вашем предложении."],
        pay_generic="Счёт с банковскими реквизитами. Валюта и способ подтверждаются в предложении.",
        legal=dict(privacy="Конфиденциальность", terms="Условия", seller="Реквизиты продавца"),
    ),
    "de": dict(
        nav_process="Ablauf",
        proc_kicker="Ablauf und Zahlung", proc_title="Fünf Schritte. <em class='serif accent'>Nichts versteckt.</em>",
        proc_sub="Leistungsumfang und Preis stehen schriftlich fest, bevor Sie etwas zahlen.",
        steps=[("Kostenloses Erstgespräch", "Ein kurzes Gespräch über Ihren Betrieb und das, was ihn bremst."),
               ("Schriftliches Angebot", "Umfang, Ergebnis und Festpreis auf Papier."),
               ("Vorauszahlung", "Wir senden eine Rechnung oder einen Zahlungslink. Mit Vorauszahlung des Pakets Wachstum ist die Website inklusive."),
               ("Umsetzung und Start", "Sie sehen früh eine lauffähige Version und geben Rückmeldung. Dann starten wir mit Ihrem Team."),
               ("Betreuung", "Hilfe in den ersten Wochen, Änderungen nach Absprache.")],
        pay_title="So läuft die Zahlung",
        pay_points=["Auf dieser Website werden keine Zahlungen abgewickelt.", "Sie zahlen per Rechnung oder Zahlungslink nach dem Gespräch und dem schriftlichen Angebot.", "Währung und Zahlungsweise stehen in Ihrem Angebot."],
        pay_generic="Rechnung mit Bankverbindung. Währung und Zahlungsweise bestätigen wir im Angebot.",
        legal=dict(privacy="Datenschutz", terms="Bedingungen", seller="Anbieterangaben"),
    ),
    "uk": dict(
        nav_process="Як працюємо",
        proc_kicker="Процес і оплата", proc_title="П'ять кроків. <em class='serif accent'>Нічого прихованого.</em>",
        proc_sub="Обсяг робіт і ціну ви бачите письмово до будь-якої оплати.",
        steps=[("Безкоштовний вступний дзвінок", "Коротка розмова про ваш бізнес і те, що гальмує роботу."),
               ("Письмова пропозиція", "Обсяг, результат і фіксована ціна на папері."),
               ("Передоплата", "Ми надсилаємо рахунок або посилання на оплату. Передоплата пакета «Зростання» включає сайт."),
               ("Розробка й запуск", "Ви рано бачите робочу версію й даєте відгук. Потім запускаємо разом із вашою командою."),
               ("Підтримка", "Допомога в перші тижні, доопрацювання за домовленістю.")],
        pay_title="Як проходить оплата",
        pay_points=["Платежі на цьому сайті не приймаються.", "Ви платите за рахунком або за посиланням після дзвінка та письмової пропозиції.", "Валюта й спосіб оплати вказуються у вашій пропозиції."],
        pay_generic="Рахунок із банківськими реквізитами. Валюта й спосіб підтверджуються у пропозиції.",
        legal=dict(privacy="Конфіденційність", terms="Умови", seller="Реквізити продавця"),
    ),
}
for _l, _d in EXTRA.items():
    C.LANGS[_l].update(_d)
    C.LANGS[_l]["nav"]["process"] = _d["nav_process"]

# Payment note per market (shown in the payment block, changes with the chosen country)
PAY_UA = "Картка через посилання monobank у гривнях, або рахунок із реквізитами. Остаточний спосіб вказаний у пропозиції."
for _l in C.MARKETS:
    for _code, _m in C.MARKETS[_l].items():
        _m["pay"] = PAY_UA if _code == "UA" else C.LANGS[_l]["pay_generic"]

# ----------------------------------------------------------------- LEGAL TEMPLATES (not legal advice)
PH = {"en": ("[Name / legal status / tax ID]", "[Postal address]", "[Contact email]", "[Country whose law applies]", "[retention period]", "[form provider]"),
      "ru": ("[Имя / правовой статус / налоговый номер]", "[Почтовый адрес]", "[Контактная почта]", "[Страна, право которой применяется]", "[срок хранения]", "[провайдер формы]"),
      "de": ("[Name / Rechtsform / Steuernummer]", "[Postanschrift]", "[Kontakt-E-Mail]", "[Land, dessen Recht gilt]", "[Speicherdauer]", "[Formular-Anbieter]"),
      "uk": ("[Ім'я / правовий статус / податковий номер]", "[Поштова адреса]", "[Контактна пошта]", "[Країна, право якої застосовується]", "[строк зберігання]", "[провайдер форми]")}

LEGAL = {
 "en": dict(
  note="Template. Have it reviewed by a lawyer in your country before launch. Highlighted fields must be filled in.",
  privacy=("Privacy notice", [
    ("Who is responsible", "{seller}, {addr}, {mail}."),
    ("What we collect", "When you send the contact form: your name, your phone, email or messenger, your team size and your message. Our hosting provider may also process technical data such as IP address in server logs."),
    ("Why we use it", "To reply to your request and prepare an offer. We rely on your consent and on steps taken at your request before a contract."),
    ("Who receives it", "Our hosting provider and the form service {form}. We do not sell your data."),
    ("How long we keep it", "As long as needed to handle your request and for {ret} afterwards, or longer where the law requires it."),
    ("Your rights", "You can ask for access, correction or deletion, withdraw consent, and complain to your data protection authority."),
    ("Cookies", "We use no tracking or advertising cookies. Your browser stores your theme and country choice locally on your device."),
    ("Contact", "Write to {mail}.")]),
  terms=("Terms of service", [
    ("Services", "We build shift planning tools, order and chat assistants, process apps and websites as described in your written offer."),
    ("Offer and price", "Scope, deliverables, timeline and fixed price are set in a written offer. Only the offer is binding, not the marketing text on this website."),
    ("Prepayment", "Work starts after the agreed prepayment, paid by invoice or payment link. Currency and method are stated in the offer."),
    ("Website included", "The website is included when you prepay the Growth plan as stated in the offer. Its scope is described in the offer."),
    ("Delivery and acceptance", "You review a working version and give feedback. Acceptance is confirmed in writing."),
    ("Refunds", "Refund conditions are stated in the offer. {ret}"),
    ("Ownership", "Ownership and licenses of the delivered results are stated in the offer."),
    ("Planning aid", "Hour and break tracking is a planning aid based on limits you set. It is not legal advice. You remain responsible for complying with labor law and agreements."),
    ("Liability and law", "Liability is limited as stated in the offer. The law of {law} applies unless mandatory consumer law says otherwise."),
    ("Seller", "{seller}, {addr}, {mail}.")]),
 ),
 "ru": dict(
  note="Шаблон. Перед запуском покажите юристу вашей страны. Выделенные поля нужно заполнить.",
  privacy=("Уведомление о конфиденциальности", [
    ("Кто отвечает", "{seller}, {addr}, {mail}."),
    ("Что мы собираем", "При отправке формы: имя, телефон, почту или мессенджер, размер команды и ваше сообщение. Хостинг-провайдер может обрабатывать технические данные, например IP-адрес в логах сервера."),
    ("Зачем", "Чтобы ответить на заявку и подготовить предложение. Основание: ваше согласие и действия по вашему запросу до заключения договора."),
    ("Кто получает данные", "Наш хостинг-провайдер и сервис форм {form}. Мы не продаём ваши данные."),
    ("Как долго храним", "Пока нужно для обработки заявки и ещё {ret}, либо дольше, если этого требует закон."),
    ("Ваши права", "Вы можете запросить доступ, исправление или удаление данных, отозвать согласие и пожаловаться в орган по защите данных."),
    ("Cookies", "Мы не используем трекинговые и рекламные cookies. Браузер локально хранит выбор темы и страны."),
    ("Контакт", "Пишите на {mail}.")]),
  terms=("Условия оказания услуг", [
    ("Услуги", "Мы создаём инструменты планирования смен, ассистентов для заказов и чата, приложения для процессов и сайты в объёме письменного предложения."),
    ("Предложение и цена", "Объём, результат, сроки и фиксированная цена определяются письменным предложением. Обязательно только предложение, а не рекламный текст сайта."),
    ("Предоплата", "Работа начинается после согласованной предоплаты по счёту или ссылке. Валюта и способ указаны в предложении."),
    ("Сайт в подарок", "Сайт входит в стоимость при предоплате пакета «Рост», как указано в предложении. Его объём описан в предложении."),
    ("Сдача и приёмка", "Вы проверяете рабочую версию и даёте отзыв. Приёмка подтверждается письменно."),
    ("Возвраты", "Условия возврата указаны в предложении. {ret}"),
    ("Права на результат", "Права на результат и лицензии указаны в предложении."),
    ("Помощник в планировании", "Учёт часов и перерывов это помощник в планировании по лимитам, которые задаёте вы. Это не юридическая консультация. Соблюдать трудовое законодательство и договорённости обязаны вы."),
    ("Ответственность и право", "Ответственность ограничена, как указано в предложении. Применяется право: {law}, если императивные нормы о защите потребителей не предписывают иного."),
    ("Продавец", "{seller}, {addr}, {mail}.")]),
 ),
 "de": dict(
  note="Vorlage. Vor dem Start von einer Rechtsberatung in Ihrem Land prüfen lassen. Markierte Felder ausfüllen.",
  privacy=("Datenschutzerklärung", [
    ("Verantwortlich", "{seller}, {addr}, {mail}."),
    ("Was wir erfassen", "Beim Absenden des Kontaktformulars: Name, Telefon, E-Mail oder Messenger, Teamgröße und Ihre Nachricht. Unser Hosting-Anbieter kann technische Daten wie die IP-Adresse in Server-Logs verarbeiten."),
    ("Wofür", "Um Ihre Anfrage zu beantworten und ein Angebot vorzubereiten. Grundlage sind Ihre Einwilligung und vorvertragliche Maßnahmen auf Ihre Anfrage."),
    ("Empfänger", "Unser Hosting-Anbieter und der Formular-Dienst {form}. Wir verkaufen Ihre Daten nicht."),
    ("Speicherdauer", "Solange zur Bearbeitung Ihrer Anfrage nötig und danach {ret}, oder länger, wenn das Gesetz es verlangt."),
    ("Ihre Rechte", "Sie können Auskunft, Berichtigung oder Löschung verlangen, die Einwilligung widerrufen und sich bei einer Datenschutzbehörde beschweren."),
    ("Cookies", "Wir setzen keine Tracking- oder Werbe-Cookies ein. Ihr Browser speichert Design- und Länderauswahl lokal auf Ihrem Gerät."),
    ("Kontakt", "Schreiben Sie an {mail}.")]),
  terms=("Geschäftsbedingungen", [
    ("Leistungen", "Wir erstellen Werkzeuge zur Schichtplanung, Bestell- und Chat-Assistenten, Prozess-Apps und Websites wie im schriftlichen Angebot beschrieben."),
    ("Angebot und Preis", "Umfang, Ergebnis, Zeitplan und Festpreis stehen im schriftlichen Angebot. Verbindlich ist nur das Angebot, nicht der Werbetext dieser Website."),
    ("Vorauszahlung", "Die Arbeit beginnt nach der vereinbarten Vorauszahlung per Rechnung oder Zahlungslink. Währung und Zahlungsweise stehen im Angebot."),
    ("Website inklusive", "Die Website ist bei Vorauszahlung des Pakets Wachstum enthalten, wie im Angebot angegeben. Ihr Umfang steht im Angebot."),
    ("Lieferung und Abnahme", "Sie prüfen eine lauffähige Version und geben Rückmeldung. Die Abnahme wird schriftlich bestätigt."),
    ("Erstattung", "Erstattungsbedingungen stehen im Angebot. {ret}"),
    ("Rechte am Ergebnis", "Eigentum und Lizenzen am gelieferten Ergebnis stehen im Angebot."),
    ("Planungshilfe", "Die Erfassung von Stunden und Pausen ist eine Planungshilfe nach von Ihnen festgelegten Grenzen. Sie ist keine Rechtsberatung. Die Einhaltung von Arbeitsrecht und Vereinbarungen bleibt Ihre Verantwortung."),
    ("Haftung und Recht", "Die Haftung ist wie im Angebot begrenzt. Es gilt das Recht von {law}, soweit zwingendes Verbraucherrecht nichts anderes vorsieht."),
    ("Anbieter", "{seller}, {addr}, {mail}.")]),
 ),
 "uk": dict(
  note="Шаблон. Перед запуском покажіть юристу вашої країни. Виділені поля потрібно заповнити.",
  privacy=("Повідомлення про конфіденційність", [
    ("Хто відповідає", "{seller}, {addr}, {mail}."),
    ("Що ми збираємо", "Під час надсилання форми: ім'я, телефон, пошту або месенджер, розмір команди та ваше повідомлення. Хостинг-провайдер може обробляти технічні дані, наприклад IP-адресу в логах сервера."),
    ("Навіщо", "Щоб відповісти на заявку й підготувати пропозицію. Підстава: ваша згода та дії на ваш запит до укладення договору."),
    ("Хто отримує дані", "Наш хостинг-провайдер і сервіс форм {form}. Ми не продаємо ваші дані."),
    ("Як довго зберігаємо", "Доки потрібно для обробки заявки та ще {ret}, або довше, якщо цього вимагає закон."),
    ("Ваші права", "Ви можете запросити доступ, виправлення чи видалення даних, відкликати згоду та поскаржитися до органу із захисту даних."),
    ("Cookies", "Ми не використовуємо трекінгові й рекламні cookies. Браузер локально зберігає вибір теми й країни."),
    ("Контакт", "Пишіть на {mail}.")]),
  terms=("Умови надання послуг", [
    ("Послуги", "Ми створюємо інструменти планування змін, асистентів для замовлень і чату, застосунки для процесів і сайти в обсязі письмової пропозиції."),
    ("Пропозиція і ціна", "Обсяг, результат, строки та фіксована ціна визначаються письмовою пропозицією. Обов'язкова лише пропозиція, а не рекламний текст сайту."),
    ("Передоплата", "Робота починається після погодженої передоплати за рахунком або посиланням. Валюта й спосіб указані в пропозиції."),
    ("Сайт у подарунок", "Сайт входить у вартість при передоплаті пакета «Зростання», як указано в пропозиції. Його обсяг описано в пропозиції."),
    ("Здача й приймання", "Ви перевіряєте робочу версію й даєте відгук. Приймання підтверджується письмово."),
    ("Повернення", "Умови повернення вказані в пропозиції. {ret}"),
    ("Права на результат", "Права на результат і ліцензії вказані в пропозиції."),
    ("Допомога в плануванні", "Облік годин і перерв це допомога в плануванні за лімітами, які задаєте ви. Це не юридична консультація. Дотримуватися трудового законодавства й домовленостей зобов'язані ви."),
    ("Відповідальність і право", "Відповідальність обмежена, як указано в пропозиції. Застосовується право: {law}, якщо імперативні норми про захист споживачів не передбачають іншого."),
    ("Продавець", "{seller}, {addr}, {mail}.")]),
 ),
}

# ----------------------------------------------------------------- CRYPTO PAYMENTS (added)
CRYPTO_POINT = {
    "en": "Cryptocurrency is accepted too (for example USDT or USDC). The coin, network and wallet address are written in your invoice, never published on this website.",
    "ru": "Принимаем и криптовалюту (например USDT или USDC). Монета, сеть и адрес кошелька указываются в вашем счёте и не публикуются на сайте.",
    "de": "Kryptowährung nehmen wir ebenfalls an (zum Beispiel USDT oder USDC). Coin, Netzwerk und Wallet-Adresse stehen in Ihrer Rechnung und werden nicht auf dieser Website veröffentlicht.",
    "uk": "Приймаємо й криптовалюту (наприклад USDT або USDC). Монета, мережа й адреса гаманця вказуються у вашому рахунку та не публікуються на сайті.",
}
CRYPTO_TERMS = {
    "en": ("Crypto payments", "If you pay in cryptocurrency, the amount is fixed in the invoice currency and converted at the rate stated in the invoice. Network fees are paid by the payer. Pay only to the wallet address written in your invoice, we never change it by chat. The payment counts once it is confirmed on the network. Crypto transfers cannot be reversed. {ret}"),
    "ru": ("Оплата криптовалютой", "При оплате криптовалютой сумма фиксируется в валюте счёта и пересчитывается по курсу, указанному в счёте. Комиссию сети платит плательщик. Платите только на адрес кошелька из вашего счёта, мы никогда не меняем его в переписке. Платёж засчитывается после подтверждения в сети. Криптоперевод нельзя отменить. {ret}"),
    "de": ("Zahlung in Kryptowährung", "Bei Zahlung in Kryptowährung wird der Betrag in der Rechnungswährung festgelegt und zum in der Rechnung genannten Kurs umgerechnet. Netzwerkgebühren trägt der Zahler. Zahlen Sie nur an die Wallet-Adresse aus Ihrer Rechnung, wir ändern sie nie per Chat. Die Zahlung gilt als erfolgt, sobald sie im Netzwerk bestätigt ist. Krypto-Überweisungen sind nicht umkehrbar. {ret}"),
    "uk": ("Оплата криптовалютою", "При оплаті криптовалютою сума фіксується у валюті рахунку та перераховується за курсом, указаним у рахунку. Комісію мережі сплачує платник. Платіть лише на адресу гаманця з вашого рахунку, ми ніколи не змінюємо її в листуванні. Платіж зараховується після підтвердження в мережі. Криптопереказ не можна скасувати. {ret}"),
}
for _l in C.LANGS:
    C.LANGS[_l]["pay_points"] = list(C.LANGS[_l]["pay_points"]) + [CRYPTO_POINT[_l]]
    _secs = LEGAL[_l]["terms"][1]
    _secs.insert(3, CRYPTO_TERMS[_l])

# ----------------------------------------------------------------- GERMANY: seller data, imprint, hosting (added)
import json as _json, os as _os
_SELLER = _json.load(open(_os.path.join(_os.path.dirname(__file__), "seller.json"), encoding="utf-8"))
_LAW = {"en": "Germany", "ru": "Германия", "de": "Deutschland", "uk": "Німеччина"}
_PHN = {"en": ["[Name / business]", "[Postal address in Germany]", "[Contact email]", "[Phone]", "[VAT note]", "[Form provider]", "[Refund terms]"],
        "ru": ["[Имя / бизнес]", "[Почтовый адрес в Германии]", "[Контактная почта]", "[Телефон]", "[Сведения об НДС]", "[Провайдер формы]", "[Условия возврата]"],
        "de": ["[Name / Betrieb]", "[Postanschrift in Deutschland]", "[Kontakt-E-Mail]", "[Telefon]", "[Angabe zur Umsatzsteuer]", "[Formular-Anbieter]", "[Erstattungsbedingungen]"],
        "uk": ["[Ім'я / бізнес]", "[Поштова адреса в Німеччині]", "[Контактна пошта]", "[Телефон]", "[Відомості про ПДВ]", "[Провайдер форми]", "[Умови повернення]"]}
_KEYS = ["name", "address", "email", "phone", "vat", "form_provider", "refund_terms"]
SV = {}  # per language: dict of placeholder values (filled value or [placeholder])
for _l in C.LANGS:
    SV[_l] = {k: (_SELLER.get(k) or _PHN[_l][i]) for i, k in enumerate(_KEYS)}
    SV[_l]["law"] = _LAW[_l]
    SV[_l]["ret"] = SV[_l]["refund_terms"]

IMPRINT = {
 "en": ("Legal notice (Impressum)", [
    ("Information pursuant to § 5 DDG", "{name}, {address}."),
    ("Contact", "Email: {email}. Phone: {phone}."),
    ("VAT", "{vat}"),
    ("Responsible for content (§ 18 (2) MStV)", "{name}, {address}."),
    ("Dispute resolution", "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.")]),
 "ru": ("Выходные данные (Impressum)", [
    ("Сведения согласно § 5 DDG", "{name}, {address}."),
    ("Контакты", "Почта: {email}. Телефон: {phone}."),
    ("НДС", "{vat}"),
    ("Ответственный за содержание (§ 18 абз. 2 MStV)", "{name}, {address}."),
    ("Разрешение споров", "Мы не готовы и не обязаны участвовать в процедурах урегулирования споров перед потребительской арбитражной комиссией.")]),
 "de": ("Impressum", [
    ("Angaben gemäß § 5 DDG", "{name}, {address}."),
    ("Kontakt", "E-Mail: {email}. Telefon: {phone}."),
    ("Umsatzsteuer", "{vat}"),
    ("Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)", "{name}, {address}."),
    ("Streitbeilegung", "Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.")]),
 "uk": ("Вихідні дані (Impressum)", [
    ("Відомості згідно з § 5 DDG", "{name}, {address}."),
    ("Контакти", "Пошта: {email}. Телефон: {phone}."),
    ("ПДВ", "{vat}"),
    ("Відповідальний за зміст (§ 18 абз. 2 MStV)", "{name}, {address}."),
    ("Вирішення спорів", "Ми не готові й не зобов'язані брати участь у процедурах вирішення спорів перед споживчою арбітражною комісією.")]),
}
_HOST = {
 "en": ("Hosting", "This website is hosted on GitHub Pages (GitHub, Inc., USA). When you visit, the provider processes technical data such as your IP address. Our legitimate interest is secure and efficient operation (Art. 6 (1)(f) GDPR)."),
 "ru": ("Хостинг", "Сайт размещён на GitHub Pages (GitHub, Inc., США). При посещении провайдер обрабатывает технические данные, например ваш IP-адрес. Наш законный интерес: безопасная и эффективная работа сайта (ст. 6 абз. 1 лит. f GDPR)."),
 "de": ("Hosting", "Diese Website wird bei GitHub Pages (GitHub, Inc., USA) gehostet. Beim Aufruf verarbeitet der Anbieter technische Daten wie Ihre IP-Adresse. Unser berechtigtes Interesse ist der sichere und effiziente Betrieb (Art. 6 Abs. 1 lit. f DSGVO)."),
 "uk": ("Хостинг", "Сайт розміщено на GitHub Pages (GitHub, Inc., США). Під час відвідування провайдер обробляє технічні дані, наприклад вашу IP-адресу. Наш законний інтерес: безпечна й ефективна робота сайту (ст. 6 абз. 1 лит. f GDPR)."),
}
_IMP_LABEL = {"en": "Legal notice", "ru": "Импрессум", "de": "Impressum", "uk": "Імпресум"}
for _l in C.LANGS:
    LEGAL[_l]["imprint"] = IMPRINT[_l]
    LEGAL[_l]["privacy"][1].insert(3, _HOST[_l])
    C.LANGS[_l]["legal"]["imprint"] = _IMP_LABEL[_l]

# ----------------------------------------------------------------- contact via email (no third-party form service), retention, notes
_FORM_DEFAULT = "Google Mail (Google)"
_RETENTION = {"en": "six months", "ru": "шесть месяцев", "de": "sechs Monate", "uk": "шість місяців"}
_RECIP = {"en": ("and the form service {form}", "and our email provider {form}"),
          "ru": ("и сервис форм {form}", "и наш почтовый провайдер {form}"),
          "de": ("und der Formular-Dienst {form}", "und unser E-Mail-Anbieter {form}"),
          "uk": ("і сервіс форм {form}", "і наш поштовий провайдер {form}")}
_MAILNOTE = {"en": "Your email app should open with the request ready to send. If not, write to",
             "ru": "Откроется почтовая программа с готовым письмом. Если нет, напишите на",
             "de": "Ihr E-Mail-Programm sollte sich mit der fertigen Anfrage öffnen. Falls nicht, schreiben Sie an",
             "uk": "Відкриється поштова програма з готовим листом. Якщо ні, напишіть на"}
for _l in C.LANGS:
    if not _SELLER.get("form_provider"):
        SV[_l]["form_provider"] = _FORM_DEFAULT
    SV[_l]["retention"] = _RETENTION[_l]
    _secs = LEGAL[_l]["privacy"][1]
    for _i, (_h, _t) in enumerate(_secs):
        _t = _t.replace(*_RECIP[_l]).replace("{ret}", "{retention}")
        _secs[_i] = (_h, _t)
    C.LANGS[_l]["ct"]["mail_note"] = _MAILNOTE[_l]
for _l in C.LANGS:
    SV[_l]["form"] = SV[_l]["form_provider"]
for _l in C.LANGS:
    SV[_l]["seller"] = SV[_l]["name"]
    SV[_l]["addr"] = SV[_l]["address"]
    SV[_l]["mail"] = SV[_l]["email"]
