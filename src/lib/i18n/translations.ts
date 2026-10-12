/**
 * i18n система для МКТУ.рус — RU/EN/ZH (по ЗАКОНУ №3, эталон iznaki.ru / aipat.ru)
 *
 * Логика:
 * - Cookie `lang` хранит выбор пользователя ('ru' | 'en' | 'zh')
 * - URL /en/... или /zh/... middleware rewrite → тот же компонент, но lang=xx
 * - useLanguage() hook читает язык и возвращает t() функцию
 *
 * ЭТАП 2 (доливка, прецедент aipat «ВРЕМЕННО RU»): перечни позиций классов
 * (mktu-data.json), пояснения классов (mktu-notes.json), тексты кейсов
 * (faq-cases), why-строки матрицы related и okved-названия остаются RU.
 */

export type Lang = 'ru' | 'en' | 'zh';

export const DEFAULT_LANG: Lang = 'ru';

export const LANGUAGES: { code: Lang; label: string; nativeName: string; flag: string }[] = [
  { code: 'ru', label: 'RU', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'EN', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中', nativeName: '中文', flag: '🇨🇳' },
];

/** Словарь переводов — все ключи и их RU/EN/ZH значения */
export const translations = {
  // ===== Общие =====
  'common.clear': { ru: 'Очистить', en: 'Clear', zh: '清空' },
  'common.favAdd': { ru: 'В избранное', en: 'Add to favorites', zh: '加入收藏' },
  'common.favRemove': { ru: 'Убрать из избранного', en: 'Remove from favorites', zh: '移出收藏' },
  'common.favOn': { ru: 'В избранном', en: 'In favorites', zh: '已收藏' },
  'common.cartAdd': { ru: 'В корзину', en: 'Add to cart', zh: '加入购物车' },
  'common.cartOn': { ru: 'В корзине', en: 'In cart', zh: '已在购物车' },
  'common.cartAlready': { ru: 'Уже в корзине', en: 'Already in cart', zh: '已在购物车' },
  'common.goods': { ru: 'Товары', en: 'Goods', zh: '商品' },
  'common.services': { ru: 'Услуги', en: 'Services', zh: '服务' },
  'common.home': { ru: 'На главную', en: 'Home', zh: '返回首页' },
  'common.homeShort': { ru: 'Главная', en: 'Home', zh: '首页' },
  'common.itemsUnit': { ru: 'позиций', en: 'items', zh: '项' },
  'common.itemsShort': { ru: 'поз.', en: 'items', zh: '项' },
  'common.open': { ru: 'Открыть', en: 'Open', zh: '打开' },

  // ===== Language switcher =====
  'lang.switch': { ru: 'Язык', en: 'Language', zh: '语言' },

  // ===== Header =====
  'header.edition': { ru: 'ред. 13 2026', en: '13th ed. 2026', zh: '第13版 2026' },
  'header.classes': { ru: 'Классы', en: 'Classes', zh: '类别' },
  'header.allClasses': { ru: 'Все классы 1–45', en: 'All classes 1–45', zh: '全部类别 1–45' },
  'header.gridHint': {
    ru: 'Все классы МКТУ — нажмите для перехода',
    en: 'All Nice classes — click to navigate',
    zh: '所有尼斯分类类别 — 点击跳转',
  },
  'header.goodsLegend': { ru: 'Товары (1–34)', en: 'Goods (1–34)', zh: '商品（1–34）' },
  'header.servicesLegend': { ru: 'Услуги (35–45)', en: 'Services (35–45)', zh: '服务（35–45）' },
  'header.services': { ru: 'Сервисы', en: 'Services', zh: '服务' },
  'header.allServices': { ru: 'Все сервисы МКТУ', en: 'All MKTU services', zh: '所有服务' },
  'header.ai': { ru: 'ИИ-помощник', en: 'AI Assistant', zh: 'AI 助手' },
  'header.aiDesc': {
    ru: 'Определит классы с объяснениями',
    en: 'Finds classes with explanations',
    zh: '带解释地确定类别',
  },
  'header.wizard': { ru: 'Мастер определения', en: 'Class Wizard', zh: '分类向导' },
  'header.wizardDesc': {
    ru: 'Пошаговый опросник для новичков',
    en: 'Step-by-step quiz for beginners',
    zh: '新手分步问答',
  },
  'header.okvedDesc': {
    ru: 'Конвертер кодов деятельности',
    en: 'Business activity code converter',
    zh: '经济活动代码转换器',
  },
  'header.related': { ru: 'Связанные классы', en: 'Related classes', zh: '关联类别' },
  'header.relatedDesc': {
    ru: 'Что ещё нужно вместе с классом',
    en: 'What else goes with a class',
    zh: '该类别通常还需搭配什么',
  },
  'header.cases': { ru: 'Частые кейсы', en: 'Common cases', zh: '常见案例' },
  'header.casesDesc': {
    ru: 'IT, общепит, торговля — готовые ответы',
    en: 'IT, food service, retail — ready answers',
    zh: 'IT、餐饮、零售 — 现成答案',
  },
  'header.fees': { ru: 'Калькулятор пошлин', en: 'Fee calculator', zh: '规费计算器' },
  'header.feesDesc': {
    ru: 'Роспатент: 2.1 + 2.4 + 2.11',
    en: 'Rospatent: 2.1 + 2.4 + 2.11',
    zh: '俄罗斯专利局：2.1 + 2.4 + 2.11',
  },
  'header.check': { ru: 'Проверка знака', en: 'Trademark check', zh: '商标查询' },
  'header.checkDesc': {
    ru: 'Поиск по реестру товарных знаков',
    en: 'Search the trademark registry',
    zh: '商标注册簿检索',
  },
  'header.fontDown': { ru: 'Уменьшить шрифт', en: 'Decrease font size', zh: '缩小字体' },
  'header.fontUp': { ru: 'Увеличить шрифт', en: 'Increase font size', zh: '放大字体' },
  'header.themePrefix': { ru: 'Тема: ', en: 'Theme: ', zh: '主题：' },
  'theme.dark': { ru: 'Тёмная', en: 'Dark', zh: '深色' },
  'theme.light': { ru: 'Светлая', en: 'Light', zh: '浅色' },
  'theme.navy': { ru: 'Тёмно-синяя', en: 'Dark blue', zh: '深蓝色' },
  'header.favorites': { ru: 'Избранное', en: 'Favorites', zh: '收藏' },
  'header.cart': { ru: 'Корзина', en: 'Cart', zh: '购物车' },

  // ===== Footer =====
  'footer.aboutTitle': { ru: 'О системе', en: 'About the system', zh: '关于体系' },
  'footer.aboutText': {
    ru: 'Международная (Ниццкая) классификация товаров и услуг для регистрации товарных знаков, используемая Всемирной организацией интеллектуальной собственности (ВОИС).',
    en: 'The international (Nice) classification of goods and services for trademark registration, used by the World Intellectual Property Organization (WIPO).',
    zh: '用于商标注册的国际（尼斯）商品和服务分类，由世界知识产权组织（WIPO）采用。',
  },
  'footer.f1': { ru: '45 классов: 34 товара и 11 услуг', en: '45 classes: 34 goods, 11 services', zh: '45 个类别：34 商品 + 11 服务' },
  'footer.f2': { ru: 'Принята Ниццким соглашением 1957 года', en: 'Adopted by the Nice Agreement (1957)', zh: '1957 年《尼斯协定》确立' },
  'footer.f3': { ru: 'Действует в более чем 80 странах', en: 'Used in more than 80 countries', zh: '在 80 多个国家适用' },
  'footer.f4': { ru: 'Периодически обновляется ВОИС', en: 'Updated periodically by WIPO', zh: '由世界知识产权组织定期更新' },
  'footer.editions': { ru: 'Редакции', en: 'Editions', zh: '版本' },
  'footer.ed13': { ru: '13-я редакция — 2026 (актуальная)', en: '13th edition — 2026 (current)', zh: '第13版 — 2026（现行）' },
  'footer.ed12': { ru: '12-я редакция — 2023', en: '12th edition — 2023', zh: '第12版 — 2023' },
  'footer.ed11': { ru: '11-я редакция — 2019', en: '11th edition — 2019', zh: '第11版 — 2019' },
  'footer.ed10': { ru: '10-я редакция — 2014', en: '10th edition — 2014', zh: '第10版 — 2014' },
  'footer.copyright': {
    ru: 'МКТУ 13-я редакция 2026 • Справочное издание',
    en: 'Nice Classification 13th edition 2026 • Reference publication',
    zh: '尼斯分类第13版 2026 • 参考出版物',
  },
  'footer.disclaimer': {
    ru: 'Данные носят информационный характер. Для официальной регистрации обратитесь к Роспатенту.',
    en: 'Information is provided for reference. For official registration contact Rospatent.',
    zh: '信息仅供参考。正式注册请联系俄罗斯专利局（Rospatent）。',
  },

  // ===== Hero (главная) =====
  'hero.badge': { ru: '13-я редакция • 2026', en: '13th edition • 2026', zh: '第13版 • 2026' },
  'hero.statGoods': { ru: 'Классов товаров', en: 'Goods classes', zh: '商品类别' },
  'hero.statServices': { ru: 'Классов услуг', en: 'Service classes', zh: '服务类别' },
  'hero.statEdition': { ru: 'Редакция МКТУ', en: 'Nice edition', zh: '尼斯分类版本' },
  'hero.close': { ru: 'Закрыть блок', en: 'Close banner', zh: '关闭横幅' },
  'hero.sub1': {
    ru: 'Международная классификация товаров и услуг для регистрации товарных знаков. Полный справочник всех 45 классов МКТУ.',
    en: 'The international classification of goods and services for trademark registration. A complete reference for all 45 Nice classes.',
    zh: '用于商标注册的商品和服务国际分类。涵盖全部 45 个尼斯类别的完整参考手册。',
  },
  'hero.sub2': {
    ru: 'Бесплатный онлайн сервис для определения МКТУ. Без рекламы и услуг.',
    en: 'Free online tool to determine Nice classes. No ads, no paid services.',
    zh: '免费在线确定尼斯分类。无广告、无推销服务。',
  },
  'hero.cta': { ru: 'Найти классы', en: 'Find classes', zh: '查找类别' },
  'hero.scroll': { ru: 'Прокрутите вниз', en: 'Scroll down', zh: '向下滚动' },

  // ===== Главная страница =====
  'home.h1': {
    ru: 'Международная классификация товаров и услуг для товарных знаков (торговых марок)',
    en: 'International classification of goods and services for trademarks',
    zh: '用于商标（品牌）的商品和服务国际分类',
  },
  'home.badge': { ru: '13-я редакция 2026 · 45 классов МКТУ', en: '13th edition 2026 · 45 Nice classes', zh: '第13版 2026 · 45 个尼斯类别' },
  'home.sub': {
    ru: 'Определение МКТУ бесплатно онлайн с помощью ИИ (AI). Полный справочник классов для регистрации товарного знака в Роспатенте.',
    en: 'Determine the right Nice class online for free with AI. A complete class reference for trademark registration with Rospatent.',
    zh: '借助 AI 免费在线确定尼斯分类。为俄罗斯专利局商标注册提供完整类别参考。',
  },
  'home.askAi': { ru: 'Спросить ИИ', en: 'Ask AI', zh: '问 AI' },
  'f.ai': { ru: 'ИИ-помощник', en: 'AI Assistant', zh: 'AI 助手' },
  'f.aiD': { ru: 'Определит классы с объяснениями', en: 'Finds classes with explanations', zh: '带解释地确定类别' },
  'f.wizard': { ru: 'Мастер', en: 'Wizard', zh: '向导' },
  'f.wizardD': { ru: '4 вопроса → список классов', en: '4 questions → class list', zh: '4 个问题 → 类别列表' },
  'f.okved': { ru: 'ОКВЭД → МКТУ', en: 'OKVED → Nice', zh: 'OKVED → 尼斯分类' },
  'f.okvedD': { ru: '84 кода соответствий', en: '84 code mappings', zh: '84 个代码对应关系' },
  'f.cases': { ru: 'Кейсы', en: 'Cases', zh: '案例' },
  'f.casesD': { ru: 'IT, еда, одежда, косметика', en: 'IT, food, apparel, cosmetics', zh: 'IT、食品、服装、化妆品' },
  'f.related': { ru: 'Связанные классы', en: 'Related classes', zh: '关联类别' },
  'f.relatedD': { ru: 'Что ещё нужно вместе', en: 'What goes together', zh: '需要搭配的类别' },
  'f.map': { ru: 'Карта классов', en: 'Class map', zh: '类别地图' },
  'f.mapD': { ru: '15 категорий, 45 классов', en: '15 categories, 45 classes', zh: '15 个分类，45 个类别' },
  'f.fees': { ru: 'Пошлины', en: 'Fees', zh: '规费' },
  'f.feesD': { ru: '2.1 + 2.4 + 2.11 + 2.14', en: '2.1 + 2.4 + 2.11 + 2.14', zh: '2.1 + 2.4 + 2.11 + 2.14' },
  'f.search': { ru: 'Поиск', en: 'Search', zh: '搜索' },
  'f.searchD': { ru: 'Глубокий поиск по позициям', en: 'Deep search across items', zh: '按项目深度搜索' },
  'f.all': { ru: 'Все классы', en: 'All classes', zh: '全部类别' },
  'f.allD': { ru: '45 классов МКТУ', en: '45 Nice classes', zh: '45 个尼斯类别' },
  'f.faq': { ru: 'Вопросы', en: 'FAQ', zh: '常见问题' },
  'f.faqD': { ru: 'Частые вопросы и ответы', en: 'Common questions and answers', zh: '常见问答' },
  'home.onlineNote': {
    ru: 'Онлайн-сервис без рекламы и услуг',
    en: 'Online tool — no ads, no paid services',
    zh: '在线工具 — 无广告、无推销服务',
  },
  'home.collapse': { ru: 'Свернуть', en: 'Collapse', zh: '收起' },
  'home.expand': { ru: 'Показать сервисы', en: 'Show services', zh: '展开服务' },
  'home.hintBar': {
    ru: '⭐ Избранное → 🛒 Корзина → ⬇ Rtf',
    en: '⭐ Favorites → 🛒 Cart → ⬇ Rtf',
    zh: '⭐ 收藏 → 🛒 购物车 → ⬇ Rtf',
  },
  'home.hintFull': {
    ru: 'Подсказка: найдите нужные классы → добавьте в избранное ⭐ → из избранного выберите товары чекбоксами → скачайте Rtf',
    en: 'Tip: find the classes you need → add them to favorites ⭐ → check the specific items from favorites → download the Rtf',
    zh: '提示：找到需要的类别 → 加入收藏 ⭐ → 在收藏中用复选框勾选具体项目 → 下载 Rtf',
  },
  'home.textTitle': {
    ru: 'МКТУ — классификатор (текстовый вид)',
    en: 'Nice Classification — text view',
    zh: '尼斯分类 — 文本视图',
  },
  'home.listTitle': { ru: 'Все классы МКТУ — 1–45', en: 'All Nice classes — 1–45', zh: '全部尼斯类别 — 1–45' },
  'home.goodsTitle': { ru: 'Товары — классы 1–34', en: 'Goods — classes 1–34', zh: '商品 — 类别 1–34' },
  'home.servicesTitle': { ru: 'Услуги — классы 35–45', en: 'Services — classes 35–45', zh: '服务 — 类别 35–45' },
  'home.empty': { ru: 'Ничего не найдено', en: 'Nothing found', zh: '未找到结果' },
  'home.emptySub': {
    ru: 'Попробуйте изменить запрос или сбросить фильтры',
    en: 'Try a different query or reset the filters',
    zh: '请更改查询或重置筛选条件',
  },
  'home.of': { ru: 'из', en: 'of', zh: '／' },

  // ===== Search-section (главная) =====
  'ss.placeholder': {
    ru: 'Поиск по классам и позициям — например: косметика, программное обеспечение, кофе...',
    en: 'Search classes and items — e.g. cosmetics, software, coffee...',
    zh: '搜索类别和项目 — 例如：化妆品、软件、咖啡...',
  },
  'ss.find': { ru: 'Найти', en: 'Search', zh: '搜索' },
  'ss.ai': { ru: 'ИИ', en: 'AI', zh: 'AI' },
  'ss.aiTitle': {
    ru: 'ИИ-помощник — определит классы МКТУ с объяснениями',
    en: 'AI assistant — determines Nice classes with explanations',
    zh: 'AI 助手 — 带解释地确定尼斯类别',
  },
  'ss.cards': { ru: 'Карточки', en: 'Cards', zh: '卡片' },
  'ss.list': { ru: 'Список', en: 'List', zh: '列表' },
  'ss.text': { ru: 'Текст', en: 'Text', zh: '文本' },

  // ===== Карточка класса =====
  'cc.more': { ru: 'Подробнее →', en: 'Details →', zh: '详情 →' },

  // ===== Страница класса =====
  'cd.notFound': { ru: 'Класс не найден', en: 'Class not found', zh: '未找到该类别' },
  'cd.selectedA': { ru: 'Выбрано позиций:', en: 'Selected items:', zh: '已选项目：' },
  'cd.hint': { ru: 'Подсказка', en: 'Tips', zh: '提示' },
  'cd.hintSub': {
    ru: 'Пояснения · что относится к классу · что не относится',
    en: 'Explanations · what belongs to the class · what does not',
    zh: '解释 · 属于本类别 · 不属于本类别',
  },
  'cd.itemSearch': {
    ru: 'Поиск по позициям класса...',
    en: 'Search items in this class...',
    zh: '搜索本类别项目...',
  },
  'cd.shownA': { ru: 'Показано', en: 'Showing', zh: '显示' },
  'cd.viewList': { ru: 'Вид списком (алфавитный)', en: 'List view (alphabetical)', zh: '列表视图（按字母顺序）' },
  'cd.viewInline': { ru: 'Вид сплошным текстом', en: 'Continuous text view', zh: '连续文本视图' },
  'cd.viewOfficial': {
    ru: 'Вид классификатора (официальный порядок)',
    en: 'Classifier view (official order)',
    zh: '分类表视图（官方顺序）',
  },
  'cd.selectAll': { ru: 'Выбрать все', en: 'Select all', zh: '全选' },
  'cd.deselectAll': { ru: 'Снять все', en: 'Deselect all', zh: '取消全选' },
  'cd.noResultsA': { ru: 'Ничего не найдено по запросу', en: 'Nothing found for', zh: '未找到：' },
  'cd.openCart': { ru: 'Открыть корзину', en: 'Open cart', zh: '打开购物车' },
  'cd.download': { ru: 'Скачать Rtf', en: 'Download Rtf', zh: '下载 Rtf' },
  'cd.first': { ru: 'Это первый класс', en: 'This is the first class', zh: '这是第一个类别' },
  'cd.last': { ru: 'Это последний класс', en: 'This is the last class', zh: '这是最后一个类别' },
  'cn.explanations': { ru: 'Пояснения', en: 'Explanations', zh: '解释' },
  'cn.includes': {
    ru: 'К классу относятся, в частности',
    en: 'This class includes, in particular',
    zh: '本类别尤其包括',
  },
  'cn.excludes': {
    ru: 'К классу не относятся, в частности',
    en: 'This class does not include, in particular',
    zh: '本类别尤其不包括',
  },

  // ===== Избранное (sheet) =====
  'fs.listEmpty': { ru: 'Список пуст', en: 'List is empty', zh: '列表为空' },
  'fs.empty': { ru: 'Избранное пусто', en: 'No favorites yet', zh: '收藏为空' },
  'fs.emptyHint': {
    ru: 'Нажимайте на звёздочку в карточке класса, чтобы сохранить его здесь для быстрого доступа.',
    en: 'Tap the star on a class card to save it here for quick access.',
    zh: '点击类别卡片上的星标，即可将其保存到这里以便快速访问。',
  },
  'fs.openItems': { ru: 'Открыть товары', en: 'Open items', zh: '打开项目' },
  'fs.toCartPage': { ru: 'Перейти к корзине', en: 'Go to cart', zh: '前往购物车' },

  // ===== Корзина (sheet) =====
  'cs.title': { ru: 'Корзина для заявки', en: 'Application cart', zh: '申请购物车' },
  'cs.empty': { ru: 'Корзина пуста', en: 'Cart is empty', zh: '购物车为空' },
  'cs.emptyHint': {
    ru: 'Добавляйте классы кнопкой-сумкой в карточке, а затем выбирайте конкретные товары чекбоксами.',
    en: 'Add classes with the bag button on a card, then check the specific items.',
    zh: '先通过卡片上的购物袋按钮添加类别，再用复选框勾选具体项目。',
  },
  'cs.openFav': { ru: 'Открыть избранное', en: 'Open favorites', zh: '打开收藏' },
  'cs.selectedWord': { ru: 'выбрано', en: 'selected', zh: '已选' },
  'cs.downloadList': { ru: 'Скачать список', en: 'Download list', zh: '下载清单' },

  // ===== Мини-калькулятор в корзине =====
  'cfc.title': { ru: 'Пошлины Роспатента', en: 'Rospatent fees', zh: '俄罗斯专利局规费' },
  'cfc.filing': { ru: 'При подаче (2.1 + 2.4)', en: 'Filing (2.1 + 2.4)', zh: '申请阶段（2.1 + 2.4）' },
  'cfc.filingTotal': { ru: 'Итого при подаче', en: 'Filing total', zh: '申请阶段合计' },
  'cfc.reg': { ru: 'Регистрация (2.11)', en: 'Registration (2.11)', zh: '注册阶段（2.11）' },
  'cfc.paper': { ru: 'бумажное свидетельство', en: 'paper certificate', zh: '纸质证书' },
  'cfc.regTotal': { ru: 'Итого за регистрацию', en: 'Registration total', zh: '注册阶段合计' },
  'cfc.withPaper': { ru: ' (с бумагой)', en: ' (with paper)', zh: '（含纸质证书）' },
  'cfc.total': { ru: 'Всего', en: 'Total', zh: '总计' },
  'cfc.details': { ru: 'Подробнее на калькуляторе', en: 'Open full calculator', zh: '打开完整计算器' },

  // ===== /search =====
  'sc.title': { ru: 'Результаты поиска', en: 'Search results', zh: '搜索结果' },
  'sc.placeholder': {
    ru: 'Поиск по классам и позициям...',
    en: 'Search classes and items...',
    zh: '搜索类别和项目...',
  },
  'sc.aiTitle': { ru: 'Поиск с помощью ИИ', en: 'AI search', zh: 'AI 搜索' },
  'sc.emptySub': {
    ru: 'Попробуйте изменить запрос или используйте ИИ-поиск',
    en: 'Try a different query or use AI search',
    zh: '请更改查询或使用 AI 搜索',
  },
  'sc.aiBtn': { ru: 'Поиск с ИИ', en: 'AI search', zh: 'AI 搜索' },
  'sc.collapseAll': { ru: 'Свернуть все', en: 'Collapse all', zh: '全部收起' },
  'sc.expandAll': {
    ru: 'Раскрыть найденные позиции в классах',
    en: 'Expand matched items in classes',
    zh: '展开各类别中匹配的项目',
  },
  'sc.wholeClass': { ru: 'Весь класс →', en: 'Whole class →', zh: '整个类别 →' },
  'sc.loading': { ru: 'Загрузка…', en: 'Loading…', zh: '加载中…' },
  'sc.docTitle': { ru: 'Определить МКТУ', en: 'Determine the Nice class', zh: '确定尼斯分类' },

  // ===== /faq =====
  'fq.title': { ru: 'Часто задаваемые вопросы', en: 'Frequently asked questions', zh: '常见问题' },
  'fq.sub': {
    ru: 'Ответы на основные вопросы о МКТУ, выборе классов и использовании справочника.',
    en: 'Answers to the main questions about the Nice Classification, choosing classes and using this reference.',
    zh: '关于尼斯分类、类别选择和本参考手册使用的主要问题解答。',
  },
  'fq.searchPh': { ru: 'Поиск по вопросам...', en: 'Search questions...', zh: '搜索问题...' },
  'fq.emptySub': { ru: 'Попробуйте изменить запрос', en: 'Try a different query', zh: '请更改查询' },
  'fq.moreTitle': { ru: 'Не нашли ответ на свой вопрос?', en: "Didn't find your question?", zh: '没有找到您的问题？' },
  'fq.moreText': {
    ru: 'Используйте поиск по классам на главной странице — он автоматически найдёт подходящие позиции по ключевым словам, либо нажмите «ИИ» в строке поиска.',
    en: 'Use the class search on the home page — it will automatically find matching items by keywords, or press "AI" in the search bar.',
    zh: '请使用首页的类别搜索 — 它会根据关键词自动匹配相应项目，也可以点击搜索栏中的「AI」。',
  },
  'fq.goSearch': { ru: 'Перейти к поиску', en: 'Go to search', zh: '前往搜索' },

  // ===== /faq-cases (UI; тексты кейсов — этап 2) =====
  'fc.title': { ru: '💡 Частые кейсы', en: '💡 Common cases', zh: '💡 常见案例' },
  'fc.sub': { ru: 'Классы МКТУ для популярных бизнесов', en: 'Nice classes for popular businesses', zh: '常见行业的尼斯类别' },
  'fc.desc': {
    ru: 'Готовые решения с пояснениями. Найдите свой кейс — увидите какие классы нужны и почему. Разворачивайте карточки для деталей.',
    en: 'Ready-made solutions with explanations. Find your case — see which classes are needed and why. Expand the cards for details.',
    zh: '带解释的现成方案。找到您的案例 — 查看需要哪些类别以及原因。展开卡片查看详情。',
  },
  'fc.recommended': { ru: 'Рекомендуемые классы', en: 'Recommended classes', zh: '推荐类别' },
  'fc.optional': { ru: 'опционально', en: 'optional', zh: '可选' },
  'fc.tipLabel': { ru: '💡 Совет:', en: '💡 Tip:', zh: '💡 建议：' },
  'fc.warningLabel': { ru: '⚠ Важно:', en: '⚠ Important:', zh: '⚠ 注意：' },
  'fc.notFoundCase': { ru: 'Не нашли свой кейс?', en: "Can't find your case?", zh: '没有找到您的案例？' },
  'fc.notFoundText': {
    ru: 'Спросите ИИ-помощника — он определит классы для любого бизнеса',
    en: 'Ask the AI assistant — it will determine classes for any business',
    zh: '问问 AI 助手 — 它可以确定任何行业的类别',
  },
  'fc.openAi': { ru: 'Открыть ИИ-помощник', en: 'Open AI assistant', zh: '打开 AI 助手' },

  // ===== /services =====
  'sv.title': { ru: 'Все сервисы МКТУ', en: 'All MKTU services', zh: '所有服务' },
  'sv.sub': {
    ru: 'Инструменты для определения класса, расчёта пошлин и подготовки заявки на регистрацию товарного знака. Выберите подходящий.',
    en: 'Tools for determining the class, calculating fees and preparing a trademark application. Pick the one you need.',
    zh: '用于确定类别、计算规费和准备商标注册申请的工具。请选择合适的工具。',
  },
  'sv.open': { ru: 'Открыть', en: 'Open', zh: '打开' },
  'sv.searchTitle': { ru: 'Поиск по позициям', en: 'Item search', zh: '项目搜索' },
  'sv.allTitle': { ru: 'Все 45 классов', en: 'All 45 classes', zh: '全部 45 个类别' },
  'sv.mapTitle': { ru: 'Визуальная карта классов', en: 'Visual class map', zh: '类别可视化地图' },
  'sv.faqTitle': { ru: 'Вопросы и ответы', en: 'Q&A', zh: '问答' },
  'sv.note': {
    ru: 'Все сервисы бесплатны · без регистрации · без рекламы',
    en: 'All services are free · no sign-up · no ads',
    zh: '所有服务免费 · 无需注册 · 无广告',
  },
  's.aiD': {
    ru: 'Опишите товар или услугу — ИИ подберёт классы, объяснит почему и даст практический совет.',
    en: 'Describe your goods or service — AI will pick the classes, explain why and give practical advice.',
    zh: '描述您的商品或服务 — AI 会挑选类别、解释原因并给出实用建议。',
  },
  's.aiBadge': { ru: 'Рекомендуем', en: 'Recommended', zh: '推荐' },
  's.wizardD': {
    ru: 'Пошаговый опросник: 4 простых вопроса — получите список классов с пояснениями.',
    en: 'Step-by-step quiz: 4 simple questions — get a list of classes with explanations.',
    zh: '分步问答：4 个简单问题 — 获得带解释的类别列表。',
  },
  's.okvedD': {
    ru: 'Знаете свой ОКВЭД? Введите код — увидите подходящие классы МКТУ. 80+ соответствий.',
    en: 'Know your OKVED code? Enter it — see the matching Nice classes. 80+ mappings.',
    zh: '知道您的 OKVED 代码？输入即可查看对应的尼斯类别。80+ 对应关系。',
  },
  's.casesD': {
    ru: 'Готовые решения для популярных бизнесов: интернет-магазин, IT, кофейня, производство.',
    en: 'Ready-made solutions for popular businesses: online store, IT, coffee shop, manufacturing.',
    zh: '热门行业的现成方案：网店、IT、咖啡店、制造业。',
  },
  's.relatedD': {
    ru: 'Выбрали класс? Посмотрите какие классы часто идут вместе — не пропустите важное.',
    en: 'Picked a class? See which classes often go together — don\u2019t miss anything important.',
    zh: '选好了类别？看看哪些类别经常一起注册 — 别遗漏重要内容。',
  },
  's.feesD': {
    ru: 'Расчёт государственных пошлин Роспатента: 2.1 + 2.4 + 2.11 + опц. 2.14.',
    en: 'Rospatent official fee calculation: 2.1 + 2.4 + 2.11 + optional 2.14.',
    zh: '俄罗斯专利局官方规费计算：2.1 + 2.4 + 2.11 + 可选 2.14。',
  },
  's.searchD': {
    ru: 'Глубокий поиск по всем позициям всех 45 классов МКТУ. Найдёт даже по части слова.',
    en: 'Deep search across all items of all 45 Nice classes. Finds even partial words.',
    zh: '对全部 45 个尼斯类别的所有项目进行深度搜索。支持部分词匹配。',
  },
  's.allD': {
    ru: 'Полный каталог классов МКТУ 13-й редакции 2026: товары (1–34) и услуги (35–45).',
    en: 'Full catalogue of the 13th edition (2026) Nice classes: goods (1–34) and services (35–45).',
    zh: '尼斯分类第13版（2026）完整类别目录：商品（1–34）和服务（35–45）。',
  },
  's.mapD': {
    ru: 'Дерево из 45 классов по 13 категориям. Для визуалов — раскрывайте и ищите.',
    en: 'A tree of 45 classes in 13 categories. Visual-friendly — expand and search.',
    zh: '45 个类别按 13 个分类构成的树状图。适合视觉思维 — 展开并搜索。',
  },
  's.mapBadge': { ru: 'Новое', en: 'New', zh: '新' },
  's.faqD': {
    ru: 'Что такое МКТУ, как зарегистрировать товарный знак, отличие товаров от услуг.',
    en: 'What the Nice Classification is, how to register a trademark, goods vs services.',
    zh: '什么是尼斯分类、如何注册商标、商品与服务的区别。',
  },

  // ===== /okved (UI; названия кодов — этап 2) =====
  'ok.title': { ru: '📋 ОКВЭД → МКТУ', en: '📋 OKVED → Nice', zh: '📋 OKVED → 尼斯分类' },
  'ok.sub': { ru: 'Конвертер кодов ОКВЭД в классы МКТУ', en: 'OKVED-to-Nice class code converter', zh: 'OKVED 代码转尼斯类别转换器' },
  'ok.desc': {
    ru: 'Знаете свой ОКВЭД? Введите код или название деятельности — покажем подходящие классы МКТУ для регистрации товарного знака.',
    en: 'Know your OKVED code? Enter the code or activity name — we will show the matching Nice classes for trademark registration.',
    zh: '知道您的 OKVED 代码？输入代码或活动名称 — 我们会显示适合商标注册的尼斯类别。',
  },
  'ok.placeholder': { ru: 'Например: 47.5 или «одежда»…', en: 'For example: 47.5 or "clothing"…', zh: '例如：47.5 或「服装」…' },
  'ok.disclaimer': {
    ru: 'Соответствия справочные — определены на основе типичной практики. Для точного определения класса рекомендуется консультация патентного поверенного, так как один ОКВЭД может соответствовать разным классам МКТУ в зависимости от конкретных товаров/услуг.',
    en: 'Mappings are for reference — based on typical practice. For an exact determination consult a patent attorney, as one OKVED code may correspond to different Nice classes depending on the specific goods/services.',
    zh: '对应关系仅供参考 — 基于典型实践。如需精确确定类别，建议咨询专利代理人，因为同一个 OKVED 代码可能对应不同的尼斯类别，具体取决于商品/服务。',
  },
  'ok.noResults': { ru: 'Ничего не найдено. Попробуйте', en: 'Nothing found. Try the', zh: '未找到结果。试试' },
  'ok.shown': { ru: 'Показано', en: 'Showing', zh: '显示' },
  'ok.codesWord': { ru: 'кодов', en: 'codes', zh: '个代码' },

  // ===== /related (UI; why-строки матрицы — этап 2) =====
  'rl.title': { ru: 'Связанные классы', en: 'Related classes', zh: '关联类别' },
  'rl.sub': { ru: 'Что ещё нужно вместе с этим классом', en: 'What else goes with this class', zh: '这个类别通常还需要搭配什么' },
  'rl.desc1': {
    ru: 'Выберите класс — увидите какие классы часто идут вместе.',
    en: 'Pick a class — see which classes often go together.',
    zh: '选择一个类别 — 查看经常一起注册的类别。',
  },
  'rl.desc2': {
    ru: 'Это поможет собрать полную заявку и не пропустить важное.',
    en: 'This helps you build a complete application and not miss anything important.',
    zh: '这有助于准备完整的申请并避免遗漏重要内容。',
  },
  'rl.searchPh': { ru: 'Поиск класса…', en: 'Search a class…', zh: '搜索类别…' },
  'rl.pickLeft': { ru: 'Выберите класс слева — увидите связанные', en: 'Pick a class on the left — related ones will appear', zh: '在左侧选择类别 — 将显示关联类别' },
  'rl.noPairs': {
    ru: 'Для этого класса нет типичных пар. Скорее всего, он самодостаточен.',
    en: 'This class has no typical pairs. Most likely it is self-sufficient.',
    zh: '该类别没有典型的搭配类别。很可能它是独立完整的。',
  },
  'rl.withClass': { ru: 'Вместе с классом', en: 'Together with class', zh: '与类别一同注册' },
  'rl.openClass': { ru: 'Открыть класс', en: 'Open class', zh: '打开类别' },

  // ===== /map =====
  'mp.title': { ru: 'Визуальная карта', en: 'Visual map', zh: '可视化地图' },
  'mp.sub': { ru: 'Все 45 классов МКТУ как дерево', en: 'All 45 Nice classes as a tree', zh: '全部 45 个尼斯类别的树状图' },
  'mp.desc': {
    ru: 'Для тех, кто мыслит визуально. Классы сгруппированы по 13 категориям — раскрывайте, ищите, переходите на страницу класса.',
    en: 'For visual thinkers. Classes are grouped into 13 categories — expand, search, open a class page.',
    zh: '适合视觉思维者。类别按 13 个分类分组 — 展开、搜索、进入类别页面。',
  },
  'mp.searchPh': { ru: 'Поиск по названию…', en: 'Search by name…', zh: '按名称搜索…' },
  'mp.expandAll': { ru: 'Раскрыть всё', en: 'Expand all', zh: '全部展开' },
  'mp.collapseAll': { ru: 'Свернуть всё', en: 'Collapse all', zh: '全部收起' },
  'mp.empty': { ru: 'Ничего не найдено. Попробуйте другой запрос.', en: 'Nothing found. Try a different query.', zh: '未找到结果。请尝试其他查询。' },
  'mp.hint': {
    ru: '45 классов · 13 категорий · кликните на класс чтобы открыть детали',
    en: '45 classes · 13 categories · click a class to open details',
    zh: '45 个类别 · 13 个分类 · 点击类别查看详情',
  },
  'mp.cat1': { ru: 'Материалы и сырьё', en: 'Materials & raw materials', zh: '材料与原料' },
  'mp.cat1h': { ru: 'Химреактивы, краски, масла, бумага/картон, резина/пластик', en: 'Chemicals, paints, oils, paper/cardboard, rubber/plastic', zh: '化学试剂、油漆、油类、纸/纸板、橡胶/塑料' },
  'mp.cat2': { ru: 'Металлы и инструменты', en: 'Metals & tools', zh: '金属与工具' },
  'mp.cat2h': { ru: 'Металлы, машины, ручные инструменты', en: 'Metals, machines, hand tools', zh: '金属、机器、手动工具' },
  'mp.cat3': { ru: 'Техника и электроника', en: 'Machines & electronics', zh: '机器与电子' },
  'mp.cat3h': { ru: 'ПО, медприборы, освещение, транспорт, оружие, ювелирка', en: 'Software, medical devices, lighting, vehicles, weapons, jewellery', zh: '软件、医疗器械、照明、交通工具、武器、珠宝' },
  'mp.cat4': { ru: 'Косметика и фармацевтика', en: 'Cosmetics & pharma', zh: '化妆品与制药' },
  'mp.cat4h': { ru: 'Косметика, парфюмерия, лекарства, ветеринарные препараты', en: 'Cosmetics, perfumery, pharmaceuticals, veterinary products', zh: '化妆品、香水、药品、兽药' },
  'mp.cat5': { ru: 'Искусство и развлечения', en: 'Arts & entertainment', zh: '艺术与娱乐' },
  'mp.cat5h': { ru: 'Музыкальные инструменты, игрушки, игры, спорт', en: 'Musical instruments, toys, games, sports', zh: '乐器、玩具、游戏、体育' },
  'mp.cat6': { ru: 'Дом и мебель', en: 'Home & furniture', zh: '家居与家具' },
  'mp.cat6h': { ru: 'Стройматериалы, мебель, посуда, ковры/покрытия', en: 'Building materials, furniture, tableware, carpets/covers', zh: '建材、家具、餐具、地毯/覆盖物' },
  'mp.cat7': { ru: 'Текстиль и одежда', en: 'Textiles & apparel', zh: '纺织与服装' },
  'mp.cat7h': { ru: 'Веревки, нити, ткани, одежда, галантерея', en: 'Ropes, threads, fabrics, clothing, haberdashery', zh: '绳索、纱线、织物、服装、服饰配件' },
  'mp.cat8': { ru: 'Кожа, сумки, зонты', en: 'Leather, bags, umbrellas', zh: '皮革、箱包、雨伞' },
  'mp.cat8h': { ru: 'Кожа, багаж, сумки, зонты, трости, сбруя', en: 'Leather, luggage, bags, umbrellas, canes, harness', zh: '皮革、行李、箱包、雨伞、手杖、马具' },
  'mp.cat9': { ru: 'Еда и напитки', en: 'Food & beverages', zh: '食品与饮料' },
  'mp.cat9h': { ru: 'Мясо/молоко, кофе/чай, сельхоз, безалкогольные, алкоголь', en: 'Meat/dairy, coffee/tea, agriculture, non-alcoholic, alcoholic', zh: '肉/奶、咖啡/茶、农产品、无酒精、酒精饮料' },
  'mp.cat10': { ru: 'Табак', en: 'Tobacco', zh: '烟草' },
  'mp.cat10h': { ru: 'Табачные изделия, электронки', en: 'Tobacco products, e-cigarettes', zh: '烟草制品、电子烟' },
  'mp.cat11': { ru: 'Бизнес и финансы', en: 'Business & finance', zh: '商业与金融' },
  'mp.cat11h': { ru: 'Реклама/торговля, финансы/страхование/недвижимость', en: 'Advertising/retail, finance/insurance/real estate', zh: '广告/零售、金融/保险/不动产' },
  'mp.cat12': { ru: 'Строительство и ремонт', en: 'Construction & repair', zh: '建筑与维修' },
  'mp.cat12h': { ru: 'Строительство, монтаж, ремонт, добыча', en: 'Construction, installation, repair, mining', zh: '建筑、安装、维修、采矿' },
  'mp.cat13': { ru: 'Связь и транспорт', en: 'Telecom & transport', zh: '通信与运输' },
  'mp.cat13h': { ru: 'Телеком, перевозки/доставка, обработка материалов', en: 'Telecom, transport/delivery, material processing', zh: '电信、运输/配送、材料加工' },
  'mp.cat14': { ru: 'Образование и IT', en: 'Education & IT', zh: '教育与 IT' },
  'mp.cat14h': { ru: 'Образование/развлечения, научные/IT-услуги', en: 'Education/entertainment, scientific/IT services', zh: '教育/娱乐、科学/IT 服务' },
  'mp.cat15': { ru: 'Услуги для людей', en: 'Personal services', zh: '生活服务' },
  'mp.cat15h': { ru: 'Общепит/жильё, медицина/красота, юр./охранные услуги', en: 'Food service/housing, medical/beauty, legal/security services', zh: '餐饮/住宿、医疗/美容、法律/安保服务' },

  // ===== /wizard =====
  'wz.title': { ru: '🧭 Мастер', en: '🧭 Wizard', zh: '🧭 向导' },
  'wz.sub1': { ru: 'Определение класса МКТУ', en: 'Determine the Nice class', zh: '确定尼斯分类' },
  'wz.sub2': {
    ru: 'Ответьте на 4 коротких вопроса — получите список классов с пояснениями',
    en: 'Answer 4 short questions — get a list of classes with explanations',
    zh: '回答 4 个简短问题 — 获得带解释的类别列表',
  },
  'wz.stepA': { ru: 'Шаг', en: 'Step', zh: '第' },
  'wz.stepB': { ru: 'из', en: 'of', zh: '步，共' },
  'wz.stepC': { ru: '', en: '', zh: '步' },
  'wz.q1': { ru: 'Что регистрируем?', en: 'What are you registering?', zh: '要注册什么？' },
  'wz.q1h': {
    ru: 'Товар — это физический продукт. Услуга — деятельность.',
    en: 'A good is a physical product. A service is an activity.',
    zh: '商品是实物产品。服务是一种活动。',
  },
  'wz.tGoods': { ru: 'Товары', en: 'Goods', zh: '商品' },
  'wz.tGoodsD': { ru: 'Физический продукт', en: 'Physical product', zh: '实物产品' },
  'wz.tServices': { ru: 'Услуги', en: 'Services', zh: '服务' },
  'wz.tServicesD': { ru: 'Деятельность, сервис', en: 'Activity, service', zh: '活动、服务' },
  'wz.tBoth': { ru: 'И то и другое', en: 'Both', zh: '两者都有' },
  'wz.tBothD': { ru: 'Например, товар + доставка', en: 'E.g. goods + delivery', zh: '例如商品 + 配送' },
  'wz.q2': { ru: 'К какой категории относится?', en: 'Which category does it belong to?', zh: '属于哪个行业分类？' },
  'wz.q2h': {
    ru: 'Выберите ближайшую — это сузит список классов',
    en: 'Pick the closest one — it will narrow the class list',
    zh: '选择最接近的 — 这会缩小类别范围',
  },
  'wz.cat.food': { ru: 'Еда и напитки', en: 'Food & beverages', zh: '食品与饮料' },
  'wz.cat.foodH': { ru: 'Производство, продажа', en: 'Production, sales', zh: '生产、销售' },
  'wz.cat.clothing': { ru: 'Одежда и обувь', en: 'Apparel & footwear', zh: '服装与鞋类' },
  'wz.cat.clothingH': { ru: 'Производство, бренд', en: 'Manufacturing, brand', zh: '制造、品牌' },
  'wz.cat.it': { ru: 'IT и ПО', en: 'IT & software', zh: 'IT 与软件' },
  'wz.cat.itH': { ru: 'Софт, приложения, SaaS', en: 'Software, apps, SaaS', zh: '软件、应用、SaaS' },
  'wz.cat.beauty': { ru: 'Косметика и красота', en: 'Cosmetics & beauty', zh: '化妆品与美容' },
  'wz.cat.beautyH': { ru: 'Средства, салоны', en: 'Products, salons', zh: '产品、美容院' },
  'wz.cat.services': { ru: 'Услуги', en: 'Services', zh: '服务' },
  'wz.cat.servicesH': { ru: 'Консалтинг, сервис', en: 'Consulting, service', zh: '咨询、服务' },
  'wz.cat.manufacturing': { ru: 'Производство', en: 'Manufacturing', zh: '制造业' },
  'wz.cat.manufacturingH': { ru: 'Завод, цех', en: 'Factory, workshop', zh: '工厂、车间' },
  'wz.cat.retail': { ru: 'Торговля', en: 'Retail', zh: '零售业' },
  'wz.cat.retailH': { ru: 'Магазин, маркетплейс', en: 'Store, marketplace', zh: '商店、电商平台' },
  'wz.cat.education': { ru: 'Образование', en: 'Education', zh: '教育' },
  'wz.cat.educationH': { ru: 'Курсы, обучение', en: 'Courses, training', zh: '课程、培训' },
  'wz.cat.finance': { ru: 'Финансы', en: 'Finance', zh: '金融' },
  'wz.cat.financeH': { ru: 'Банки, инвестиции', en: 'Banks, investments', zh: '银行、投资' },
  'wz.cat.health': { ru: 'Медицина', en: 'Healthcare', zh: '医疗' },
  'wz.cat.healthH': { ru: 'Клиники, препараты', en: 'Clinics, pharmaceuticals', zh: '诊所、药品' },
  'wz.cat.transport': { ru: 'Транспорт', en: 'Transport', zh: '运输' },
  'wz.cat.transportH': { ru: 'Доставка, перевозки', en: 'Delivery, freight', zh: '配送、货运' },
  'wz.cat.other': { ru: 'Другое', en: 'Other', zh: '其他' },
  'wz.cat.otherH': { ru: 'Опишу в свободной форме', en: 'I will describe it myself', zh: '我将自由描述' },
  'wz.q3': { ru: 'Опишите подробнее', en: 'Describe in more detail', zh: '请详细描述' },
  'wz.q3h': {
    ru: '1-3 слова о конкретном продукте/услуге',
    en: '1–3 words about the specific product/service',
    zh: '用 1–3 个词描述具体产品/服务',
  },
  'wz.q3ph': {
    ru: 'Например: кофе, мобильное приложение, одежда для детей…',
    en: 'For example: coffee, mobile app, kids clothing…',
    zh: '例如：咖啡、移动应用、童装…',
  },
  'wz.back': { ru: 'Назад', en: 'Back', zh: '上一步' },
  'wz.next': { ru: 'Далее', en: 'Next', zh: '下一步' },
  'wz.q4': { ru: 'Как продаёте?', en: 'How do you sell?', zh: '如何销售？' },
  'wz.q4h': {
    ru: 'От этого зависит нужен ли класс 35 (реклама/продажи)',
    en: 'This determines whether class 35 (advertising/retail) is needed',
    zh: '这决定是否需要第35类（广告/销售）',
  },
  'wz.sellPhys': { ru: 'Физически', en: 'Physically', zh: '线下' },
  'wz.sellPhysD': { ru: 'Магазин, точка', en: 'Store, outlet', zh: '商店、门店' },
  'wz.sellOnline': { ru: 'Онлайн', en: 'Online', zh: '线上' },
  'wz.sellOnlineD': { ru: 'Сайт, маркетплейс', en: 'Website, marketplace', zh: '网站、电商平台' },
  'wz.sellBoth': { ru: 'Оба', en: 'Both', zh: '两者' },
  'wz.sellBothD': { ru: 'Офлайн + онлайн', en: 'Offline + online', zh: '线下 + 线上' },
  'wz.result': { ru: 'Рекомендуемые классы', en: 'Recommended classes', zh: '推荐类别' },
  'wz.basedOn': { ru: 'На основе:', en: 'Based on:', zh: '基于：' },
  'wz.basedGoods': { ru: 'товары', en: 'goods', zh: '商品' },
  'wz.basedServices': { ru: 'услуги', en: 'services', zh: '服务' },
  'wz.basedBoth': { ru: 'товары+услуги', en: 'goods+services', zh: '商品+服务' },
  'wz.fail': {
    ru: 'Не получилось определить автоматически. Попробуйте ИИ-помощник — он справится с любым описанием.',
    en: 'Could not determine automatically. Try the AI assistant — it can handle any description.',
    zh: '无法自动确定。请试试 AI 助手 — 它可以处理任何描述。',
  },
  'wz.openAi': { ru: 'Открыть ИИ-помощник', en: 'Open AI assistant', zh: '打开 AI 助手' },
  'wz.main': { ru: 'Основные', en: 'Main', zh: '主要类别' },
  'wz.extra': { ru: 'Дополнительные (если применимо)', en: 'Additional (if applicable)', zh: '附加类别（如适用）' },
  'wz.tip': { ru: '💡 Хотите точнее?', en: '💡 Want more precision?', zh: '💡 想更精确？' },
  'wz.askAi': { ru: 'Спросите ИИ-помощника', en: 'Ask the AI assistant', zh: '问问 AI 助手' },
  'wz.tipTail': { ru: '— он учтёт все нюансы.', en: '— it will take all the nuances into account.', zh: '— 它会考虑所有细节。' },
  'wz.restart': { ru: 'Начать заново', en: 'Start over', zh: '重新开始' },

  // ===== /assistant =====
  'as.title': { ru: 'ИИ-помощник', en: 'AI Assistant', zh: 'AI 助手' },
  'as.sub1': { ru: 'Определите классы МКТУ с ИИ', en: 'Determine Nice classes with AI', zh: '用 AI 确定尼斯类别' },
  'as.sub2': {
    ru: 'Опишите ваш товар или услугу — ИИ подберёт подходящие классы, объяснит почему и даст практический совет.',
    en: 'Describe your goods or service — AI will pick the matching classes, explain why and give practical advice.',
    zh: '描述您的商品或服务 — AI 会挑选合适的类别、解释原因并给出实用建议。',
  },
  'as.greet1': { ru: 'Опишите, что хотите зарегистрировать', en: 'Describe what you want to register', zh: '描述您想注册的内容' },
  'as.greet2': {
    ru: 'Например: «мобильное приложение для доставки еды»',
    en: 'For example: "a food delivery mobile app"',
    zh: '例如：「外卖配送移动应用」',
  },
  'as.try': { ru: 'Попробуйте примеры:', en: 'Try these examples:', zh: '试试这些例子：' },
  'as.thinking': { ru: 'ИИ думает…', en: 'AI is thinking…', zh: 'AI 思考中…' },
  'as.error': { ru: 'Ошибка:', en: 'Error:', zh: '错误：' },
  'as.ph': { ru: 'Опишите товар или услугу…', en: 'Describe goods or a service…', zh: '描述商品或服务…' },
  'as.stop': { ru: 'Стоп', en: 'Stop', zh: '停止' },
  'as.send': { ru: 'Отправить (Enter)', en: 'Send (Enter)', zh: '发送（Enter）' },
  'as.hint': {
    ru: 'Enter — отправить · Shift+Enter — новая строка',
    en: 'Enter — send · Shift+Enter — new line',
    zh: 'Enter — 发送 · Shift+Enter — 换行',
  },
  'as.toolO': { ru: '📋 Из ОКВЭД в МКТУ', en: '📋 From OKVED to Nice', zh: '📋 从 OKVED 到尼斯分类' },
  'as.toolOD': { ru: 'Знаете ОКВЭД? Найдём классы МКТУ', en: 'Know OKVED? We will find the Nice classes', zh: '知道 OKVED？帮您找到尼斯类别' },
  'as.again': { ru: 'Продолжить спрашивать', en: 'Continue asking', zh: '继续提问' },
  'as.errMsg': {
    ru: 'Извините, не удалось получить ответ. Попробуйте переформулировать вопрос.',
    en: 'Sorry, failed to get a response. Try rephrasing the question.',
    zh: '抱歉，未能获得回答。请换一种方式提问。',
  },
  'as.ex1': { ru: 'Мобильное приложение для доставки еды', en: 'Food delivery mobile app', zh: '外卖配送移动应用' },
  'as.ex2': { ru: 'Интернет-магазин одежды', en: 'Online clothing store', zh: '服装网店' },
  'as.ex3': { ru: 'Кофейня с собственным производством зёрен', en: 'Coffee shop roasting its own beans', zh: '自行烘焙咖啡豆的咖啡店' },
  'as.ex4': { ru: 'SaaS-платформа для бухгалтерии', en: 'SaaS accounting platform', zh: '财会 SaaS 平台' },
  'as.ex5': { ru: 'Производство косметики', en: 'Cosmetics manufacturing', zh: '化妆品制造' },
  'as.ex6': { ru: 'Фитнес-клуб с онлайн-тренировками', en: 'Fitness club with online workouts', zh: '提供在线训练的健身俱乐部' },
  'as.ex7': { ru: 'Маркетплейс handmade-товаров', en: 'Handmade goods marketplace', zh: '手工艺品电商平台' },
  'as.ex8': { ru: 'Производство мебели на заказ', en: 'Custom furniture manufacturing', zh: '定制家具制造' },

  // ===== /calculator =====
  'ca.title': { ru: 'Калькулятор пошлин Роспатента', en: 'Rospatent fee calculator', zh: '俄罗斯专利局规费计算器' },
  'ca.sub': {
    ru: 'Расчёт государственных пошлин за регистрацию товарного знака',
    en: 'Calculation of state fees for trademark registration',
    zh: '商标注册国家规费计算',
  },
  'ca.basis': {
    ru: 'Базовые пошлины за 1 класс МКТУ по Положению о патентных и иных пошлинах (актуально на 2026 год). Источник:',
    en: 'Base fees for 1 Nice class under the Regulation on patent and other fees (current as of 2026). Source:',
    zh: '依据《专利及其他规费条例》的 1 个尼斯类别基础规费（2026 年现行）。来源：',
  },
  'ca.input': { ru: 'Введите параметры заявки', en: 'Enter application parameters', zh: '输入申请参数' },
  'ca.classes': { ru: 'Количество классов МКТУ', en: 'Number of Nice classes', zh: '尼斯类别数量' },
  'ca.dec': { ru: 'Уменьшить', en: 'Decrease', zh: '减少' },
  'ca.inc': { ru: 'Увеличить', en: 'Increase', zh: '增加' },
  'ca.range': {
    ru: 'от 1 до 45 (товары: 1–34, услуги: 35–45)',
    en: 'from 1 to 45 (goods: 1–34, services: 35–45)',
    zh: '1 至 45（商品：1–34，服务：35–45）',
  },
  'ca.items': { ru: 'Товаров и услуг в перечне (всего)', en: 'Goods and services in the list (total)', zh: '清单中商品和服务总数' },
  'ca.fee24hint': {
    ru: 'пошлина 2.4: +500 ₽ за каждую позицию свыше 10 в классе',
    en: 'fee 2.4: +500 ₽ for each item over 10 in a class',
    zh: '规费 2.4：每类超出 10 项后每项 +500 ₽',
  },
  'ca.overLine': { ru: 'Позиций сверх лимита:', en: 'Items over the limit:', zh: '超出限额的项目：' },
  'ca.freeA': { ru: 'бесплатно', en: 'free', zh: '免费' },
  'ca.freeB': { ru: '× классов =', en: '× classes =', zh: '× 类别 =' },
  'ca.freeC': { ru: 'всего в перечне', en: 'total in the list', zh: '清单总计' },
  'ca.extra': { ru: 'Доплата:', en: 'Extra:', zh: '补缴：' },
  'ca.paper': { ru: 'Бумажное свидетельство (+3 000 ₽)', en: 'Paper certificate (+3 000 ₽)', zh: '纸质证书（+3 000 ₽）' },
  'ca.paperHint': {
    ru: 'Опционально — по умолчанию выдаётся электронное (п. 2.11). Бумажное можно запросить по ходатайству правообладателя.',
    en: 'Optional — an electronic one is issued by default (item 2.11). A paper certificate can be requested by the right holder.',
    zh: '可选 — 默认发放电子证书（第 2.11 项）。权利人可另行申请纸质证书。',
  },
  'ca.filing': { ru: 'При подаче заявки', en: 'When filing the application', zh: '提交申请时' },
  'ca.filingWhen': {
    ru: 'в течение 2 месяцев с даты подачи',
    en: 'within 2 months from the filing date',
    zh: '自申请之日起 2 个月内',
  },
  'ca.base': { ru: 'база', en: 'base', zh: '基础' },
  'ca.perExtraClass': { ru: 'за доп. класс', en: 'per extra class', zh: '每增加一类' },
  'ca.perExtraItems': { ru: 'за доп. позиции', en: 'per extra items', zh: '超出项目的费用' },
  'ca.perClassOver5': { ru: 'за класс свыше 5', en: 'per class over 5', zh: '每超过 5 类' },
  'ca.filingTotal': { ru: 'Итого при подаче заявки', en: 'Filing total', zh: '申请阶段合计' },
  'ca.reg': { ru: 'После решения о регистрации', en: 'After the registration decision', zh: '注册决定之后' },
  'ca.regWhen': { ru: 'продлевает знак на 10 лет', en: 'protects the mark for 10 years', zh: '商标保护期 10 年' },
  'ca.hint214': {
    ru: 'по ходатайству правообладателя · фиксированная пошлина, не зависит от числа классов',
    en: 'upon the right holder\u2019s request · fixed fee, independent of the number of classes',
    zh: '依权利人申请 · 固定规费，与类别数量无关',
  },
  'ca.regTotal': { ru: 'Итого за регистрацию', en: 'Registration total', zh: '注册阶段合计' },
  'ca.withPaper': { ru: ' (с бумажным свидетельством)', en: ' (with paper certificate)', zh: '（含纸质证书）' },
  'ca.grand': { ru: 'Всего за весь процесс регистрации', en: 'Total for the entire registration process', zh: '整个注册流程总计' },
  'ca.inList': { ru: 'в перечне', en: 'in the list', zh: '清单中' },
  'ca.n1': {
    ru: '2.1 + 2.4 платятся одновременно — в течение 2 месяцев с даты подачи заявки на регистрацию товарного знака. Это базовые пошлины за 1 класс МКТУ; сверху начисляется доплата за каждый дополнительный класс и за позиции свыше 10 в одном классе (только для 2.4).',
    en: '2.1 + 2.4 are paid simultaneously — within 2 months from the filing date of the trademark application. These are the base fees for 1 Nice class; an extra charge applies for each additional class and for items over 10 in one class (for 2.4 only).',
    zh: '2.1 + 2.4 同时缴纳 — 在商标注册申请提交之日起 2 个月内。这是 1 个尼斯类别的基础规费；每增加一个类别、以及单类超过 10 项时需加收费用（仅针对 2.4）。',
  },
  'ca.n2': {
    ru: '2.11 платится после решения о регистрации — пошлина за регистрацию товарного знака и выдачу свидетельства в форме электронного документа. Свидетельство действует 10 лет с даты подачи заявки, после чего может быть продлено (п. 2.22 — отдельная пошлина).',
    en: '2.11 is paid after the registration decision — the fee for registering the trademark and issuing the certificate in electronic form. The certificate is valid for 10 years from the filing date and can then be renewed (item 2.22 — a separate fee).',
    zh: '2.11 在注册决定之后缴纳 — 用于商标注册和发放电子形式证书。证书自申请日起有效期 10 年，之后可续展（第 2.22 项 — 单独规费）。',
  },
  'ca.n3': {
    ru: '2.14 — опциональная бумажная выдача — если нужно свидетельство на бумажном носителе (в дополнение к электронному), подаётся отдельное ходатайство с уплатой 3 000 ₽. Большинству заявителей достаточно электронного свидетельства — оно имеет ту же юридическую силу.',
    en: '2.14 — optional paper issuance — if a paper certificate is needed (in addition to the electronic one), a separate request with a 3 000 ₽ payment is filed. For most applicants the electronic certificate suffices — it has the same legal force.',
    zh: '2.14 — 可选纸质证书 — 如需纸质证书（电子证书之外），需另行申请并缴纳 3 000 ₽。对大多数申请人而言电子证书即可 — 具有同等法律效力。',
  },
  'ca.n4': {
    ru: 'Льготных категорий для товарных знаков нет — в отличие от патентов на изобретения, для регистрации ТЗ пошлины не уменьшаются для каких-либо категорий заявителей.',
    en: 'No fee exemptions for trademarks — unlike invention patents, trademark registration fees are not reduced for any applicant categories.',
    zh: '商标无规费优惠 — 与发明专利不同，商标注册规费对任何类别申请人均不减免。',
  },
  'ca.n5': {
    ru: 'Допущено упрощение: на этой странице позиции распределяются равномерно по классам. Если распределение неравномерное (например, 25 в одном классе и 5 в другом), фактическая пошлина может быть выше. Для точного расчёта по вашему перечню — добавьте классы в корзину, там калькулятор считает по каждому классу отдельно.',
    en: 'Simplification applied: on this page items are distributed evenly across classes. If the distribution is uneven (e.g. 25 in one class and 5 in another), the actual fee may be higher. For an exact calculation add the classes to the cart — there the calculator computes per class.',
    zh: '简化说明：本页面的项目按类别平均分配。如果分布不均（例如一类 25 项、另一类 5 项），实际规费可能更高。如需精确计算，请将类别加入购物车 — 那里的计算器会按每个类别分别计算。',
  },
  'ca.footer': {
    ru: 'Данные актуальны на 2026 год · Положение о патентных и иных пошлинах, утв. Постановлением Правительства РФ',
    en: 'Data current as of 2026 · Regulation on patent and other fees, approved by the Government of the Russian Federation',
    zh: '数据截至 2026 年 · 俄罗斯联邦政府批准的《专利及其他规费条例》',
  },
  'ca.hintBaseExtra': { ru: 'база {X} + доплата {Y}', en: 'base {X} + extra {Y}', zh: '基础 {X} + 补缴 {Y}' },

  // ===== FAQ: вопросы и ответы =====
  'faq.q1': { ru: 'Что такое МКТУ?', en: 'What is the Nice Classification?', zh: '什么是尼斯分类？' },
  'faq.a1': {
    ru: 'МКТУ — Международная классификация товаров и услуг (Nice Classification), разработанная ВОИС (Всемирной организацией интеллектуальной собственности). Это единая система классификации, которая используется при регистрации товарных знаков в более чем 80 странах мира. Классификация делит все товары и услуги на 45 классов: классы 1–34 охватывают товары, а классы 35–45 — услуги.',
    en: 'The Nice Classification (MKTU) is the international classification of goods and services developed by WIPO (the World Intellectual Property Organization). It is a unified classification system used for trademark registration in more than 80 countries. It divides all goods and services into 45 classes: classes 1–34 cover goods, classes 35–45 cover services.',
    zh: '尼斯分类（MKTU）是由世界知识产权组织（WIPO）制定的商品和服务国际分类。这是一套统一的分类体系，在 80 多个国家的商标注册中使用。它将所有商品和服务分为 45 个类别：第 1–34 类为商品，第 35–45 类为服务。',
  },
  'faq.q2': {
    ru: 'Зачем нужно указывать классы МКТУ при регистрации товарного знака?',
    en: 'Why do you need to specify Nice classes when registering a trademark?',
    zh: '注册商标时为什么需要指定尼斯类别？',
  },
  'faq.a2': {
    ru: 'При подаче заявки на регистрацию товарного знака в Роспатент (или другое ведомство) необходимо указать, в отношении каких товаров и/или услуг будет использоваться знак. Для этого используется МКТУ — вы выбираете один или несколько классов, которые соответствуют вашему бизнесу. Правильный выбор классов определяет объём правовой охраны вашего товарного знака и помогает избежать конфликтов с уже зарегистрированными знаками.',
    en: 'When filing a trademark application with Rospatent (or another office), you must indicate which goods and/or services the mark will be used for. For this purpose the Nice Classification is used — you choose one or more classes matching your business. The right choice of classes defines the scope of legal protection of your trademark and helps avoid conflicts with already registered marks.',
    zh: '向俄罗斯专利局（或其他机构）提交商标注册申请时，必须说明商标将用于哪些商品和/或服务。为此使用尼斯分类 — 您选择与您业务相符的一个或多个类别。正确选择类别决定了商标的法律保护范围，并有助于避免与已注册商标发生冲突。',
  },
  'faq.q3': { ru: 'Что такое 13-я редакция МКТУ?', en: 'What is the 13th edition of the Nice Classification?', zh: '什么是尼斯分类第13版？' },
  'faq.a3': {
    ru: '13-я редакция МКТУ — это актуальная версия классификации, вступившая в силу в 2026 году. Каждая редакция вносит изменения в перечень товаров и услуг внутри классов, чтобы учитывать появление новых видов деятельности и технологий. Данная версия содержит обновлённые описания классов, добавлены новые позиции, связанные с цифровыми технологиями, искусственным интеллектом и другими современными направлениями.',
    en: 'The 13th edition is the current version of the classification, effective from 2026. Each edition updates the lists of goods and services within classes to account for new activities and technologies. This edition contains updated class descriptions and new items related to digital technologies, artificial intelligence and other modern fields.',
    zh: '尼斯分类第13版是现行版本，于 2026 年生效。每一版都会更新各类别内的商品和服务清单，以反映新出现的活动和技术。本版包含更新的类别描述，并新增了与数字技术、人工智能等现代领域相关的项目。',
  },
  'faq.q4': { ru: 'Как выбрать нужные классы МКТУ?', en: 'How to choose the right Nice classes?', zh: '如何选择合适的尼斯类别？' },
  'faq.a4': {
    ru: 'Определите, какие товары или услуги вы производите, продаёте или планируете развивать. Используйте строку поиска на главной странице, чтобы найти подходящие позиции. Можно также просматривать все классы по категориям «Товары» (классы 1–34) и «Услуги» (классы 35–45). Рекомендуется выбирать все классы, связанные с вашей деятельностью, в том числе те, которые вы планируете использовать в будущем.',
    en: 'Determine which goods or services you produce, sell or plan to develop. Use the search bar on the home page to find matching items. You can also browse all classes by category: "Goods" (classes 1–34) and "Services" (classes 35–45). It is recommended to select all classes related to your activity, including those you plan to use in the future.',
    zh: '确定您生产、销售或计划发展的商品或服务。使用首页的搜索栏查找相应项目。也可以按「商品」（第 1–34 类）和「服务」（第 35–45 类）分类浏览所有类别。建议选择与您业务相关的所有类别，包括您计划将来使用的类别。',
  },
  'faq.q5': { ru: 'Можно ли выбрать несколько классов?', en: 'Can I choose several classes?', zh: '可以选择多个类别吗？' },
  'faq.a5': {
    ru: 'Да, при регистрации товарного знака можно указать несколько классов МКТУ. Однако за каждый дополнительный класс взимается отдельная пошлина. Для начинающих бизнесов рекомендуется выбрать 1–3 ключевых класса. Крупные компании часто регистрируют товарные знаки в 10 и более классах для полной защиты бренда.',
    en: 'Yes, several Nice classes can be specified when registering a trademark. However, a separate fee applies for each additional class. For new businesses it is recommended to choose 1–3 key classes. Large companies often register trademarks in 10 or more classes for full brand protection.',
    zh: '可以，注册商标时可以指定多个尼斯类别。但每增加一个类别需单独缴纳规费。对于初创企业，建议选择 1–3 个关键类别。大公司常在 10 个及以上类别注册商标以全面保护品牌。',
  },
  'faq.q6': { ru: 'Для чего нужен раздел «Избранное»?', en: 'What is the "Favorites" section for?', zh: '「收藏」功能有什么用？' },
  'faq.a6': {
    ru: 'Раздел «Избранное» позволяет сохранить интересующие вас классы МКТУ для быстрого доступа. Нажмите на звёздочку в карточке класса, чтобы добавить его в избранное. Все выбранные классы будут отображаться при нажатии на иконку звезды в верхней панели навигации. Избранное сохраняется в браузере и не пропадёт при закрытии страницы.',
    en: 'The "Favorites" section lets you save the Nice classes you are interested in for quick access. Tap the star on a class card to add it. All selected classes appear when you tap the star icon in the top navigation bar. Favorites are stored in your browser and will not disappear when you close the page.',
    zh: '「收藏」功能让您保存感兴趣的尼斯类别以便快速访问。点击类别卡片上的星标即可加入收藏。所有选中的类别会显示在顶部导航栏的星标图标中。收藏保存在浏览器中，关闭页面不会丢失。',
  },
  'faq.q7': { ru: 'Для чего нужна корзина и как её использовать?', en: 'What is the cart for and how to use it?', zh: '购物车有什么用以及如何使用？' },
  'faq.a7': {
    ru: 'Корзина позволяет собрать классы МКТУ, которые вы планируете включить в заявку на регистрацию товарного знака. Нажмите на иконку корзины в карточке класса, чтобы добавить его. Вы можете скачать список выбранных классов в формате Rtf, который можно открыть в любом текстовом редакторе (Word, LibreOffice и др.). Скачанный файл содержит структурированный перечень классов — готовый черновик для заявки.',
    en: 'The cart collects the Nice classes you plan to include in your trademark application. Tap the bag icon on a class card to add it. You can download the list of selected classes in Rtf format, openable in any text editor (Word, LibreOffice, etc.). The downloaded file contains a structured list of classes — a ready draft for your application.',
    zh: '购物车用于收集您计划纳入商标注册申请的尼斯类别。点击类别卡片上的购物车图标即可添加。您可以将所选类别列表下载为 Rtf 格式，可在任何文本编辑器（Word、LibreOffice 等）中打开。下载的文件包含结构化的类别清单 — 可直接用于申请的草稿。',
  },
  'faq.q8': { ru: 'Как скачать список классов?', en: 'How to download the class list?', zh: '如何下载类别清单？' },
  'faq.a8': {
    ru: 'Добавьте нужные классы в корзину (нажмите на иконку корзины в карточке). Затем откройте корзину, нажав на иконку сумки в верхней панели навигации. В открывшейся панели нажмите кнопку «Скачать список». Файл будет скачан на ваше устройство в формате Rtf, который поддерживается Microsoft Word, LibreOffice Writer и другими текстовыми редакторами.',
    en: 'Add the classes you need to the cart (tap the bag icon on a card). Then open the cart via the bag icon in the top navigation bar. In the panel that opens, press "Download list". The file will be downloaded in Rtf format, supported by Microsoft Word, LibreOffice Writer and other editors.',
    zh: '将需要的类别加入购物车（点击卡片上的购物车图标）。然后通过顶部导航栏的购物袋图标打开购物车。在打开的面板中点击「下载清单」。文件将以 Rtf 格式下载，支持 Microsoft Word、LibreOffice Writer 等编辑器。',
  },
  'faq.q9': { ru: 'Являются ли данные на сайте официальными?', en: 'Is the data on this site official?', zh: '本网站的数据是官方的吗？' },
  'faq.a9': {
    ru: 'Да, данные официальные из Федерального Института Промышленной Собственности (ФИПС). Данный сайт является рабочим сервисом для профи и новичков и предназначен для удобного поиска и ознакомления с классами МКТУ. Информация основана на 13-й редакции МКТУ, официально опубликованной на сайте ФИПС. Сервис является некоммерческим обучающим и практическим ресурсом для определения классов МКТУ, предназначен для официальной регистрации товарного знака (торговой марки) в России. Для подачи международной заявки используйте английскую версию сайта (переключатель в шапке сайта). Для контроля работы сайта или для проверки своего поверенного вы можете быстро получить результаты, в том числе с помощью готовых промптов (запросов) для ИИ — нажмите кнопку «Поиск с ИИ» в поиске. Данный ресурс не является государственным сервисом, но по содержанию классов на 100% совпадает с последней редакцией МКТУ.',
    en: 'Yes, the data is official, from the Federal Institute of Industrial Property (FIPS). This site is a working service for professionals and beginners, designed for convenient search and exploration of the Nice classes. The information is based on the 13th edition of the Nice Classification officially published on the FIPS website. The service is a non-commercial educational and practical resource for determining Nice classes, intended for official trademark registration in Russia. For an international application use the English version of the site (the switcher in the header). To monitor the site or verify your attorney, you can quickly get results, including via ready-made AI prompts — press "AI search" in the search bar. This resource is not a government service, but its class content matches the latest Nice edition 100%.',
    zh: '是的，数据来自联邦工业产权研究所（FIPS），是官方数据。本网站是面向专业人士和新手的实用工具，用于便捷地搜索和了解尼斯类别。信息基于 FIPS 网站正式发布的尼斯分类第13版。本服务是用于确定尼斯类别的非商业性学习与实践资源，适用于在俄罗斯正式注册商标。如需提交国际申请，请使用网站的英文版本（页眉中的切换器）。如需核查网站或您的代理人，您可以通过现成的 AI 提示快速获得结果 — 点击搜索栏中的「AI 搜索」。本资源并非政府服务，但其类别内容与最新版尼斯分类 100% 一致。',
  },
  'faq.q10': { ru: 'Лайфхаки для МКТУ', en: 'Nice Classification lifehacks', zh: '尼斯分类实用技巧' },
  'faq.a10': {
    ru: 'Собрали полезные советы, которые сэкономят время и деньги при работе с классификацией. Проверено на практике — патентными поверенными и участниками рынка.\n\n1. Начните с поиска по ключевым словам — введите ваш основной товар или услугу в строку поиска. Система покажет все подходящие позиции с указанием класса и номера.\n\n2. Добавляйте найденные классы в Избранное (нажмите ⭐ на карточке). Это не добавит их в корзину — Избранное это ваш черновик для отбора.\n\n3. Из Избранного откройте карточки нужных классов и отметьте чекбоксами конкретные товары/услуги, которые хотите включить в заявку. Отмеченные позиции автоматически попадут в Корзину.\n\n4. Не экономьте на классах — если вы планируете развивать направление в будущем, укажите класс уже сейчас. Перерегистрация обойдётся дороже, чем дополнительный класс при первичной подаче.\n\n5. Проверьте близкие классы — например, если вы продаёте косметику (класс 3), проверьте класс 44 (медицинская косметология) и класс 35 (розничная продажа косметики).\n\n6. Скачайте результат в Rtf — файл уже отформатирован и готов для вставки в заявку. Откройте его в Word, проверьте список и при необходимости отредактируйте.\n\n7. Используйте ИИ-поиск — если не уверены в формулировке, спросите ИИ. Нажмите кнопку Поиск с ИИ в строке поиска и опишите свой бизнес своими словами.\n\n8. Сохраняйте проекты — все ваши Избранное и Корзина сохраняются в браузере. Не закрывайте вкладку с результатами, пока не скачаете Rtf-файл.\n\n9. Для международной заявки — переключитесь на английскую версию сайта (кнопка ENG в шапке). Названия классов будут на английском языке, как это требуется для международной регистрации через Мадридскую систему.',
    en: 'We collected practical tips that will save you time and money when working with the classification. Field-tested by patent attorneys and market players.\n\n1. Start with a keyword search — type your main product or service into the search bar. The system will show all matching items with their class and number.\n\n2. Add the found classes to Favorites (tap ⭐ on the card). This does not add them to the cart — Favorites is your drafting area.\n\n3. From Favorites, open the cards of the classes you need and check the specific goods/services you want to include in the application. Checked items automatically go to the Cart.\n\n4. Don\u2019t skimp on classes — if you plan to develop a direction in the future, specify the class now. Re-registration costs more than an extra class at first filing.\n\n5. Check nearby classes — for example, if you sell cosmetics (class 3), check class 44 (medical cosmetology) and class 35 (retail sale of cosmetics).\n\n6. Download the result in Rtf — the file is already formatted and ready to be inserted into your application. Open it in Word, review the list and edit if necessary.\n\n7. Use AI search — if you are unsure about the wording, ask AI. Press the AI search button in the search bar and describe your business in your own words.\n\n8. Save your projects — all your Favorites and Cart are stored in the browser. Don\u2019t close the results tab until you download the Rtf file.\n\n9. For an international application — switch to the English version of the site (ENG button in the header). Class names will be in English, as required for international registration via the Madrid System.',
    zh: '我们整理了实用建议，帮助您在使用分类时节省时间和金钱。经过专利代理人和市场从业者实践检验。\n\n1. 从关键词搜索开始 — 在搜索栏输入您的主要商品或服务。系统会显示所有匹配的项目及其类别和编号。\n\n2. 将找到的类别加入收藏（点击卡片上的 ⭐）。这不会将其加入购物车 — 收藏是您的初步筛选区。\n\n3. 从收藏中打开所需类别的卡片，用复选框勾选要纳入申请的具体商品/服务。勾选的项目会自动进入购物车。\n\n4. 不要在类别上省钱 — 如果您计划将来发展某个方向，现在就指定类别。重新注册比首次申请多加一个类别更贵。\n\n5. 检查相邻类别 — 例如，如果您销售化妆品（第3类），请检查第44类（医疗美容）和第35类（化妆品零售）。\n\n6. 将结果下载为 Rtf — 文件已排版好，可直接插入申请材料。在 Word 中打开，核对清单并按需修改。\n\n7. 使用 AI 搜索 — 如果不确定表述，问问 AI。点击搜索栏中的「AI 搜索」按钮，用自己的话描述您的业务。\n\n8. 保存您的项目 — 收藏和购物车都保存在浏览器中。在下载 Rtf 文件之前，请不要关闭结果页标签。\n\n9. 国际申请 — 切换到网站英文版（页眉中的 ENG 按钮）。类别名称将以英文显示，这是通过马德里体系进行国际注册的要求。',
  },
  'faq.q11': { ru: 'BruteForce MKTU (для нетерпеливых)', en: 'BruteForce MKTU (for the impatient)', zh: 'BruteForce 尼斯分类（急用版）' },
  'faq.a11': {
    ru: 'Если вам нужно определить классы МКТУ прямо сейчас и нет времени читать класс за классом — вот экспресс-метод, который используют опытные патентные поверенные.\n\nШаг 1. Откройте сайт и введите в поиск название вашего товара или услуги на русском языке. Не пытайтесь угадать формулировку — пишите как есть, даже бытовыми словами.\n\nШаг 2. В результатах поиска вы увидите найденные позиции с чекбоксами. Поставьте галочки напротив всех подходящих позиций. Если позиции из разных классов — ставьте галочки везде, где подходит.\n\nШаг 3. Нажмите на карточку класса, чтобы открыть полный список товаров. Просмотрите соседние позиции — часто нужный товар находится в соседней строке.\n\nШаг 4. Если нашли класс — добавьте его в Избранное ⭐, потом откройте и выберите нужные товары чекбоксами. Они автоматически попадут в Корзину.\n\nШаг 5. Если поиск ничего не дал — попробуйте синонимы. Например: телефоны → мобильные устройства → аппаратура связи. Или еда → продукты питания → пищевая продукция.\n\nШаг 6. Если и синонимы не помогли — откройте все классы по очереди через кнопку «Кнопки» (появляется сетка номеров 1–45). Это занимает 2–3 минуты, зато вы точно увидите весь перечень.\n\nШаг 7. Скачайте Rtf-файл из Корзины — готовый перечень для заявки в Роспатент. Время от поиска до готового файла: 3–5 минут.\n\nШаг 8. Если всё равно не уверены — нажмите «Поиск с ИИ» и опишите свой бизнес человеческим языком. ИИ найдёт подходящие классы и объяснит свой выбор.\n\nЭтот метод работает для 95% случаев. Оставшиеся 5% — редкие и новые виды деятельности — лучше проконсультироваться с патентным поверенным.',
    en: 'If you need to determine the Nice classes right now and have no time to read class by class — here is the express method used by experienced patent attorneys.\n\nStep 1. Open the site and type the name of your product or service in Russian into the search. Don\u2019t try to guess the official wording — write as it is, even in everyday words.\n\nStep 2. In the search results you will see matched items with checkboxes. Tick all suitable items. If items come from different classes — tick everywhere it fits.\n\nStep 3. Tap a class card to open the full list of items. Look through neighbouring items — the right item is often on the adjacent line.\n\nStep 4. If you found the class — add it to Favorites ⭐, then open it and select the items you need with checkboxes. They will automatically go to the Cart.\n\nStep 5. If the search gave nothing — try synonyms. For example: phones → mobile devices → communication equipment. Or food → groceries → food products.\n\nStep 6. If synonyms didn\u2019t help — open all classes one by one via the grid button (a grid of numbers 1–45 appears). It takes 2–3 minutes, but you will see the whole list for sure.\n\nStep 7. Download the Rtf file from the Cart — a ready list for your Rospatent application. From search to ready file: 3–5 minutes.\n\nStep 8. If you are still unsure — press "AI search" and describe your business in plain language. AI will find the matching classes and explain its choice.\n\nThis method works in 95% of cases. The remaining 5% — rare and new activities — are better discussed with a patent attorney.',
    zh: '如果您需要立即确定尼斯类别、没有时间逐类阅读 — 这里是经验丰富的专利代理人使用的快速方法。\n\n第 1 步。打开网站，在搜索中输入您的商品或服务名称。不要猜测官方表述 — 想怎么写就怎么写，日常用语也可以。\n\n第 2 步。在搜索结果中您会看到带复选框的匹配项目。勾选所有合适的项目。如果项目来自不同类别 — 凡是合适的都勾选。\n\n第 3 步。点击类别卡片打开完整项目清单。浏览相邻项目 — 所需项目常常就在相邻一行。\n\n第 4 步。找到类别后 — 将其加入收藏 ⭐，然后打开并用复选框选择所需项目。它们会自动进入购物车。\n\n第 5 步。如果搜索没有结果 — 试试同义词。例如：手机 → 移动设备 → 通信设备。或：食品 → 食品杂货 → 食品产品。\n\n第 6 步。如果同义词也无济于事 — 通过网格按钮（出现 1–45 数字网格）逐个打开所有类别。这需要 2–3 分钟，但您一定能看到完整清单。\n\n第 7 步。从购物车下载 Rtf 文件 — 可直接用于俄罗斯专利局申请的清单。从搜索到成品文件：3–5 分钟。\n\n第 8 步。如果仍不确定 — 点击「AI 搜索」并用平常的语言描述您的业务。AI 会找到合适的类别并解释其选择。\n\n这个方法在 95% 的情况下有效。其余 5% — 罕见和新兴行业 — 建议咨询专利代理人。',
  },

  // ===== Metadata (title/description ×3) =====
  'meta.home.title': {
    ru: 'МКТУ 2026/2027 товарных знаков Бесплатно определить с ИИ Онлайн',
    en: 'Nice Classification 2026/2027 for trademarks — determine for free with AI online',
    zh: '尼斯分类 2026/2027 商标 — 免费在线 AI 确定',
  },
  'meta.home.desc': {
    ru: 'Полный справочник МКТУ 13-й редакции 2026. Международная классификация товаров и услуг для регистрации товарных знаков. Все 45 классов.',
    en: 'Complete reference for the 13th edition (2026) of the Nice Classification. The international classification of goods and services for trademark registration. All 45 classes.',
    zh: '尼斯分类第13版（2026）完整参考手册。用于商标注册的商品和服务国际分类。全部 45 个类别。',
  },
  'meta.search.title': { ru: 'Поиск по классам МКТУ', en: 'Search Nice classes', zh: '搜索尼斯类别' },
  'meta.search.desc': {
    ru: 'Поиск по всем 45 классам МКТУ 13-й редакции 2026. Найдите подходящие классы для регистрации товарного знака.',
    en: 'Search across all 45 Nice classes of the 13th edition (2026). Find the right classes for trademark registration.',
    zh: '搜索尼斯分类第13版（2026）全部 45 个类别。找到适合商标注册的类别。',
  },
  'meta.faq.title': { ru: 'FAQ — Часто задаваемые вопросы по МКТУ', en: 'FAQ — Nice Classification questions', zh: '常见问题 — 尼斯分类问答' },
  'meta.faq.desc': {
    ru: 'Ответы на популярные вопросы о МКТУ, выборе классов и регистрации товарных знаков.',
    en: 'Answers to popular questions about the Nice Classification, choosing classes and trademark registration.',
    zh: '关于尼斯分类、类别选择和商标注册的常见问题解答。',
  },
  'meta.faqcases.title': {
    ru: 'Частые кейсы: классы МКТУ для популярных бизнесов',
    en: 'Common cases: Nice classes for popular businesses',
    zh: '常见案例：热门行业的尼斯类别',
  },
  'meta.faqcases.desc': {
    ru: 'Готовые решения: какой класс МКТУ для интернет-магазина, IT-стартапа, кофейни, производства одежды. С пояснениями и типичными ошибками.',
    en: 'Ready-made answers: which Nice class for an online store, IT startup, coffee shop or apparel manufacturing. With explanations and typical mistakes.',
    zh: '现成答案：网店、IT 创业公司、咖啡店、服装制造适用哪些尼斯类别。附解释和常见错误。',
  },
  'meta.assistant.title': { ru: 'ИИ-помощник по классам МКТУ', en: 'AI assistant for Nice classes', zh: '尼斯类别 AI 助手' },
  'meta.assistant.desc': {
    ru: 'Бесплатный ИИ-помощник определит подходящие классы МКТУ для вашего товарного знака. Объяснит почему именно эти классы, подскажет дополнительные и даст практический совет.',
    en: 'A free AI assistant will determine the right Nice classes for your trademark. It explains the choice, suggests additional classes and gives practical advice.',
    zh: '免费 AI 助手将为您的商标确定合适的尼斯类别。解释选择原因、建议附加类别并提供实用建议。',
  },
  'meta.calc.title': { ru: 'Калькулятор пошлин Роспатента', en: 'Rospatent fee calculator', zh: '俄罗斯专利局规费计算器' },
  'meta.calc.desc': {
    ru: 'Расчёт государственных пошлин Роспатента за регистрацию товарного знака: 2.1 + 2.4 + 2.11 + опциональное 2.14. Актуально на 2026 год.',
    en: 'Calculation of Rospatent state fees for trademark registration: 2.1 + 2.4 + 2.11 + optional 2.14. Current as of 2026.',
    zh: '俄罗斯专利局商标注册国家规费计算：2.1 + 2.4 + 2.11 + 可选 2.14。截至 2026 年现行。',
  },
  'meta.services.title': {
    ru: 'Все сервисы МКТУ — определение класса, пошлины, поиск',
    en: 'All MKTU services — class determination, fees, search',
    zh: '所有服务 — 类别确定、规费、搜索',
  },
  'meta.services.desc': {
    ru: 'Все инструменты мкту.рус на одной странице: ИИ-помощник, мастер определения класса, конвертер ОКВЭД→МКТУ, связанные классы, частые кейсы, калькулятор пошлин Роспатента.',
    en: 'All MKTU.ru tools on one page: AI assistant, class wizard, OKVED→Nice converter, related classes, common cases, Rospatent fee calculator.',
    zh: 'mktu.рус 的全部工具汇聚一页：AI 助手、分类向导、OKVED→尼斯转换器、关联类别、常见案例、规费计算器。',
  },
  'meta.okved.title': { ru: 'ОКВЭД → МКТУ: соответствие кодов', en: 'OKVED → Nice: code mapping', zh: 'OKVED → 尼斯分类：代码对应' },
  'meta.okved.desc': {
    ru: 'Конвертер ОКВЭД в классы МКТУ. Введите ваш код ОКВЭД — получите подходящие классы МКТУ для регистрации товарного знака. Таблица соответствий для популярных видов деятельности.',
    en: 'OKVED-to-Nice class converter. Enter your OKVED code — get the matching Nice classes for trademark registration. Mapping table for popular activities.',
    zh: 'OKVED 转尼斯类别转换器。输入您的 OKVED 代码 — 获取适合商标注册的尼斯类别。热门行业的对应表。',
  },
  'meta.related.title': { ru: 'Связанные классы МКТУ: что ещё нужно', en: 'Related Nice classes: what else you need', zh: '关联尼斯类别：还需要什么' },
  'meta.related.desc': {
    ru: 'Кросс-ссылки между классами МКТУ. Если выбрали класс — посмотрите какие классы часто идут вместе. Помогает собрать полную заявку на регистрацию товарного знака.',
    en: 'Cross-links between Nice classes. Picked a class? See which classes often go together. Helps you build a complete trademark application.',
    zh: '尼斯类别之间的交叉链接。选好了类别？看看哪些类别经常一起注册。帮助准备完整的商标注册申请。',
  },
  'meta.wizard.title': { ru: 'Мастер определения класса МКТУ', en: 'Nice class determination wizard', zh: '尼斯类别确定向导' },
  'meta.wizard.desc': {
    ru: 'Пошаговый опросник поможет определить подходящие классы МКТУ для регистрации товарного знака. Ответьте на 4 вопроса — получите список классов с пояснениями.',
    en: 'A step-by-step quiz to determine the right Nice classes for trademark registration. Answer 4 questions — get a list of classes with explanations.',
    zh: '分步问答帮您确定适合商标注册的尼斯类别。回答 4 个问题 — 获得带解释的类别列表。',
  },
  'meta.map.title': { ru: 'Визуальная карта классов МКТУ — дерево категорий', en: 'Visual map of Nice classes — category tree', zh: '尼斯类别可视化地图 — 分类树' },
  'meta.map.desc': {
    ru: 'Все 45 классов МКТУ в виде интерактивного дерева по категориям: химия, техника, одежда, еда, услуги. Для тех, кто мыслит визуально. Кликните на класс — откроется подробная страница.',
    en: 'All 45 Nice classes as an interactive tree by category: chemicals, machinery, apparel, food, services. For visual thinkers. Click a class to open its detailed page.',
    zh: '全部 45 个尼斯类别以交互式树状图按行业展示：化工、机械、服装、食品、服务。适合视觉思维者。点击类别查看详细页面。',
  },
  'meta.class.desc': {
    ru: 'Полный список позиций для регистрации товарного знака в Роспатенте.',
    en: 'Full list of items for trademark registration with Rospatent.',
    zh: '俄罗斯专利局商标注册的完整项目清单。',
  },

  // ===== Официальные заголовки классов 1–45 (Ниццкая классификация, ред. 13) =====
  'classdesc.1': { ru: 'Вещества химические, предназначенные для использования в промышленности, науке и фотографии, а также в сельском хозяйстве, садоводстве и лесоводстве; смолы искусственные необработанные, материалы пластические необработанные; составы для тушения огня и предотвращения пожаров; препараты для закалки и пайки; вещества для дубления кожи и шкур животных; вещества клеящие для промышленного использования; компост, навоз, удобрения; препараты биологические для промышленных и научных целей.', en: 'Chemicals used in industry, science and photography, as well as in agriculture, horticulture and forestry; unprocessed artificial resins, unprocessed plastics; manures; fire extinguishing compositions; tempering and soldering preparations; chemical substances for preserving foodstuffs; tanning substances; adhesives used in industry.', zh: '用于工业、科学、摄影、农业、园艺和林业的化学品；未加工人造树脂；未加工塑料；肥料；灭火合成物；淬火和焊接用制剂；食品防腐用化学品；鞣料；工业用粘合剂' },
  'classdesc.2': { ru: 'Краски, политуры, лаки; средства защитные, предохраняющие металлы от коррозии и древесину от разрушения; красители, вещества окрашивающие; чернила для печати, маркировки и гравировки; смолы необработанные природные; фольга металлическая и металлы порошкообразные для использования в живописи, декорировании, печати и искусстве.', en: 'Paints, varnishes, lacquers; preservatives against rust and against deterioration of wood; colorants; mordents; raw natural resins; metals in foil and powder form for painters, decorators, printers and artists.', zh: '颜料、清漆、漆；防锈剂和木材防腐剂；着色剂；媒染剂；未加工天然树脂；画家、装饰家、印刷商和艺术家用金属箔及金属粉' },
  'classdesc.3': { ru: 'Средства косметические и туалетные немедицинские; средства для чистки зубов немедицинские; изделия парфюмерные, масла эфирные; препараты для отбеливания и прочие вещества для стирки; средства чистящие, полирующие и абразивные.', en: 'Bleaching preparations and other substances for laundry use; cleaning, polishing, scouring and abrasive preparations; soaps; perfumery, essential oils, cosmetics, hair lotions; dentifrices.', zh: '洗衣用漂白制剂及其他物料；清洁、抛光、去污及研磨制剂；肥皂；香料、香精油、化妆品、洗发液；牙膏' },
  'classdesc.4': { ru: 'Масла, смазки и воски промышленные; материалы смазочные; составы для поглощения, смачивания и связывания пыли; топлива и материалы осветительные; свечи и фитили для освещения.', en: 'Industrial oils and greases; lubricants; dust absorbing, wetting, binding, dust suppressing and dust composing products; fuels (including motor spirit) and illuminants; candles and wicks for lighting.', zh: '工业用油和油脂；润滑剂；吸收、润湿、粘结、抑制灰尘和集尘用品；燃料（包括汽油）和照明剂；照明用蜡烛和灯芯' },
  'classdesc.5': { ru: 'Продукты фармацевтические, препараты медицинские и ветеринарные; средства гигиенические для медицинских целей; питание диетическое и вещества, предназначенные для медицинских или ветеринарных целей, питание детское; добавки пищевые для человека и животных; пластыри, материалы перевязочные; материалы для пломбирования зубов, воск стоматологический; средства дезинфицирующие; препараты для уничтожения вредителей; фунгициды, гербициды.', en: 'Pharmaceutical and veterinary preparations; sanitary preparations for medical purposes; dietetic food and substances adapted for medical or veterinary use, food for babies; dietary supplements for humans and animals; plasters, materials for dressings; material for stopping teeth, dental wax; disinfectants; preparations for destroying vermin; fungicides, herbicides.', zh: '药品和兽医用制剂；医用卫生制剂；医用或兽医用营养食物和物质、婴儿食品；人和动物用膳食补充剂；膏药、包扎材料；填塞牙孔用料、牙科用蜡；消毒剂；灭害虫制剂；杀真菌剂、除莠剂' },
  'classdesc.6': { ru: 'Металлы обычные и их сплавы, руды; материалы металлические строительные; сооружения передвижные металлические; тросы и проволока из обычных металлов неэлектрические; мелкие металлические и скобяные изделия; контейнеры металлические для хранения и транспортировки; сейфы.', en: 'Common metals and their alloys; metal building materials; transportable buildings of metal; materials of metal for railway tracks; non-electric cables and wires of common metal; ironmongery, small items of metal hardware; pipes and tubes of metal; safes; goods of common metal not included in other classes; ores.', zh: '普通金属及其合金；金属建筑材料；可移动金属建筑物；铁路用金属材料；普通金属制非电气用缆线和金属丝；金属五金器具；金属管；保险箱；不属别类的普通金属制品；矿石' },
  'classdesc.7': { ru: 'Машины, оборудование машинное и инструменты с механическим приводом; двигатели, за исключением предназначенных для наземных транспортных средств; соединения и элементы передач, за исключением предназначенных для наземных транспортных средств; орудия сельскохозяйственные иные, чем орудия с ручным управлением; инкубаторы для яиц; автоматы торговые.', en: 'Machines and machine tools; motors and engines (except for land vehicles); machine coupling and transmission components (except for land vehicles); agricultural implements other than hand-operated; incubators for eggs.', zh: '机器和机床；马达和引擎（陆地车辆用的除外）；机器联轴节和传动零件（陆地车辆用的除外）；非手动农业工具；孵化器' },
  'classdesc.8': { ru: 'Орудия и инструменты ручные; приборы столовые; оружие холодное; бритвы.', en: 'Hand tools and implements (hand-operated); cutlery; side arms; razors.', zh: '手工具和器具（手工操作的）；餐具；随身武器；剃刀' },
  'classdesc.9': { ru: 'Приборы и инструменты научные, исследовательские, навигационные, геодезические, фотографические, кинематографические, аудиовизуальные, оптические, для взвешивания, измерения, сигнализации, обнаружения, тестирования, спасания и обучения; приборы и инструменты для передачи, распределения, трансформации, накопления, регулирования или управления распределением или потреблением электричества; аппаратура и инструменты для записи, передачи, воспроизведения или обработки звука, изображений или данных; носители записанные или загружаемые, компьютерное программное обеспечение, чистые носители записи и хранения цифровой или аналоговой информации; механизмы для аппаратов с предварительной оплатой; аппараты кассовые, устройства счетные; компьютеры и компьютерные периферийные устройства; гидрокостюмы для дайвинга, маски для дайверов, беруши для дайверов, зажимы для носа для дайверов и пловцов, перчатки для дайверов, аппараты дыхательные для подводного плавания; оборудование для тушения огня.', en: 'Scientific, nautical, surveying, photographic, cinematographic, optical, weighing, measuring, signalling, checking (supervision), life-saving and teaching apparatus and instruments; apparatus and instruments for conducting, switching, transforming, accumulating, regulating or controlling electricity; apparatus for recording, transmission or reproduction of sound or images; magnetic data carriers, recording discs; compact discs, DVDs and other digital recording media; mechanisms for coin-operated apparatus; cash registers, calculating machines, data processing equipment, computers; computer software; fire-extinguishing apparatus.', zh: '科学、航海、测地、摄影、电影、光学、衡具、量具、信号、检验（监督）、救护（营救）和教学用具及仪器；处理、开关、转换、积累、调节或控制电的仪器；录制、传送或重放声音和图像的装置；磁性数据载体、录音盘；光盘、DVD和其他数字存储媒介；投币启动装置的机械结构；收银机、计算机器、数据处理装置、计算机；计算机软件；灭火设备' },
  'classdesc.10': { ru: 'Приборы и инструменты хирургические, медицинские, стоматологические и ветеринарные; протезы конечностей, протезы глазные и зубные; изделия ортопедические; материалы шовные; оборудование терапевтическое и вспомогательное, предназначенное для людей с ограниченными возможностями; приборы для массажа; аппараты, оборудование и изделия для детей младенческого возраста; аппараты, приборы и изделия для сексуальной активности.', en: 'Surgical, medical, dental and veterinary apparatus and instruments, artificial limbs, eyes and teeth; orthopedic articles; suture materials.', zh: '外科、内科、牙科和兽医用器械和仪器，假肢、假眼和假牙；矫形用品；缝合材料' },
  'classdesc.11': { ru: 'Устройства и установки для освещения, отопления, охлаждения, получения пара, приготовления пищи, сушки, вентиляции, водоснабжения и санитарно-технические.', en: 'Apparatus for lighting, heating, steam generating, cooking, refrigerating, drying, ventilating, water supply and sanitary purposes.', zh: '照明、加温、蒸汽发生、烹调、冷藏、干燥、通风、供水和卫生设备装置' },
  'classdesc.12': { ru: 'Средства транспортные; аппараты, перемещающиеся по земле, воде и воздуху.', en: 'Vehicles; apparatus for locomotion by land, air or water.', zh: '运载工具；陆、空、海用运载装置' },
  'classdesc.13': { ru: 'Оружие огнестрельное; боеприпасы и снаряды; вещества взрывчатые; фейерверки.', en: 'Firearms; ammunition and projectiles; explosives; fireworks.', zh: '火器；军火和弹药；爆炸物；烟花爆竹' },
  'classdesc.14': { ru: 'Металлы благородные и их сплавы; изделия ювелирные, камни драгоценные и полудрагоценные; приборы часовые и хронометрические.', en: 'Precious metals and their alloys; goods in precious metals or coated therewith, not included in other classes; jewellery, precious stones; horological and chronometric instruments.', zh: '贵重金属及其合金；不属别类的贵重金属制品或镀贵重金属制品；珠宝首饰、宝石；钟表和计时仪器' },
  'classdesc.15': { ru: 'Инструменты музыкальные; пюпитры и подставки для музыкальных инструментов; палочки дирижерские.', en: 'Musical instruments.', zh: '乐器' },
  'classdesc.16': { ru: 'Бумага, картон; продукция печатная; материалы переплетные; фотографии; принадлежности канцелярские и офисные, за исключением мебели; клеи для канцелярских и бытовых целей; материалы для рисования и принадлежности для художников; кисти для рисования; пособия и материалы учебные; листы, пленки и мешки пластмассовые для упаковки и пакетирования; шрифты, клише типографские.', en: 'Paper, cardboard and goods made from these materials, not included in other classes; printed matter; bookbinding material; photographs; stationery; adhesives for stationery or household purposes; artists’ materials; paintbrushes; typewriters and office requisites (except furniture); instructional and teaching material (except apparatus); plastic materials for packaging (not included in other classes); printers’ type; printing blocks.', zh: '不属别类的纸、纸板及其制品；印刷品；装订用品；照片；文具；文具或家庭用粘合剂；美术用品；画笔；打字机和办公用品（家具除外）；教学用品（仪器除外）；包装用塑料制品（不属别类）；印刷铅字、印版' },
  'classdesc.17': { ru: 'Каучук, резина, гуттаперча, асбест, слюда необработанные и частично обработанные и заменители этих материалов; пластмассы и резина в экструдированной форме, используемые в производстве; материалы для конопачения, уплотнения и изоляции; трубы гибкие, трубки и шланги неметаллические.', en: 'Rubber, gutta-percha, gum, asbestos, mica and goods made from these materials and not included in other classes; plastics in extruded form for use in manufacture; packing, stopping and insulating materials; flexible pipes, not of metal.', zh: '橡胶、古塔胶、树胶、石棉、云母及不属别类的这些材料制品；生产用挤压成型塑料；包装、填充和绝缘材料；非金属软管' },
  'classdesc.18': { ru: 'Кожа и имитация кожи; шкуры животных и кожсырье; изделия багажные и сумки для переноски; зонты от дождя и солнца; трости; кнуты, сбруя конская и изделия шорные; ошейники, поводки и одежда для животных.', en: 'Leather and imitations of leather, and goods made of these materials and not included in other classes; animal skins, hides; trunks and travelling bags; umbrellas and parasols; walking sticks; whips, harness and saddlery.', zh: '不属别类的皮革和人造皮革及其制品；动物皮毛；行李箱和旅行包；雨伞和阳伞；手杖；鞭、马具和鞍具' },
  'classdesc.19': { ru: 'Материалы неметаллические для строительства; трубы жесткие неметаллические для строительства; асфальт, смолы, гудрон и битум; конструкции и сооружения передвижные неметаллические; памятники неметаллические.', en: 'Building materials (non-metallic); non-metallic rigid pipes for building; asphalt, pitch and bitumen; non-metallic transportable buildings; monuments, not of metal.', zh: '建筑材料（非金属）；建筑用非金属刚性管；沥青、柏油和沥青焦油；非金属可移动建筑物；非金属纪念碑' },
  'classdesc.20': { ru: 'Мебель, зеркала, рамы для картин; контейнеры неметаллические для хранения или транспортировки; рог, кость, китовый ус или перламутр необработанные или частично обработанные; ракушки; пенка морская; янтарь желтый.', en: 'Furniture, mirrors, picture frames; goods (not included in other classes) of wood, cork, reed, cane, wicker, horn, bone, ivory, whalebone, shell, amber, mother-of-pearl, meerschaum and substitutes for all these materials, or of plastics.', zh: '家具、镜子、相框；不属别类的木、软木、苇、藤、柳条、角、骨、象牙、鲸骨、贝壳、琥珀、珍珠母、海泡石及其代用品制成的制品，或塑料制品' },
  'classdesc.21': { ru: 'Утварь и емкости бытовые или кухонные; посуда кухонная и столовая, за исключением вилок, ножей и ложек; расчески и губки; щетки, за исключением кистей; материалы для щеточных изделий; принадлежности для уборки; стекло необработанное или частично обработанное, за исключением строительного стекла; изделия из стекла, фарфора и фаянса.', en: 'Household or kitchen utensils and containers; combs and sponges; brushes (except paint brushes); brush-making materials; articles for cleaning purposes; steelwool; unworked or semi-worked glass (except glass used in building); glassware, porcelain and earthenware not included in other classes.', zh: '家庭或厨房用具和容器；梳子和海绵；刷子（画笔除外）；制刷材料；清扫用具；钢丝绒；未加工或半加工玻璃（建筑用玻璃除外）；不属别类的玻璃器皿、瓷器和陶器' },
  'classdesc.22': { ru: 'Канаты, веревки, бечевки; сети; палатки, навесы; тенты из текстильных или синтетических материалов; паруса; мешки, для транспортировки и хранения сыпучих материалов; материалы набивочные за исключением бумажных, картонных, резиновых и пластических; материалы из текстильного волокнистого сырья и их заменители.', en: 'Ropes, string, nets, tents, awnings, tarpaulins, sails, sacks and bags (not included in other classes); padding and stuffing materials (except of rubber or plastics); raw fibrous textile materials.', zh: '缆、绳、线、网、帐篷、遮篷、防水布、帆、袋（不属别类）；衬垫和填充材料（橡胶或塑料除外）；纺织用纤维原料' },
  'classdesc.23': { ru: 'Нити текстильные и пряжа.', en: 'Yarns and threads, for textile use.', zh: '纺织用纱和线' },
  'classdesc.24': { ru: 'Текстиль и его заменители; белье для бытового использования; занавеси из текстильного и пластического материалов.', en: 'Textiles and textile goods, not included in other classes; beds and table covers.', zh: '不属别类的纺织品和纺织制品；床罩和桌布' },
  'classdesc.25': { ru: 'Одежда, обувь, головные уборы.', en: 'Clothing, footwear, headgear.', zh: '服装、鞋、帽' },
  'classdesc.26': { ru: 'Кружево, тесьма и изделия вышитые, ленты галантерейные и банты; пуговицы, кнопки, крючки и петли, булавки и иглы; цветы искусственные; украшения для волос; волосы накладные.', en: 'Lace, braid and embroidery, and haberdashery ribbons and braid; buttons, hooks and eyes, pins and needles; artificial flowers.', zh: '花边、饰带和刺绣品及服饰用缎带和编带；钮扣、领钩扣、别针和缝针；人造花' },
  'classdesc.27': { ru: 'Ковры, коврики, циновки, маты, линолеум и другие покрытия для полов; материалы драпировочные настенные, нетекстильные.', en: 'Carpets, rugs, matting and linoleum and other materials for covering existing floors; wall hangings (non-textile).', zh: '地毯、席类、油毡及其他铺地板材料；非纺织壁挂' },
  'classdesc.28': { ru: 'Игры, игрушки; аппараты для видеоигр; товары гимнастические и спортивные; украшения для рождественских елок.', en: 'Games and playthings; gymnastic and sporting articles not included in other classes; decorations for Christmas trees.', zh: '游戏器具和玩具；不属别类的体操和运动用品；圣诞树用装饰品' },
  'classdesc.29': { ru: 'Мясо, рыба, птица и дичь; экстракты мясные; овощи и фрукты консервированные, сушеные, замороженные и подвергнутые тепловой обработке; желе, джемы, компоты; яйца; молоко, сыр, масло, йогурт и другие молочные продукты; масла и жиры пищевые.', en: 'Meat, fish, poultry and game; meat extracts; preserved, frozen, dried and cooked fruits and vegetables; jellies, jams, compotes; eggs, milk and milk products; edible oils and fats.', zh: '肉、鱼、家禽和野味；肉汁；腌渍、冷冻、干制和煮熟的水果和蔬菜；果冻、果酱、蜜饯；蛋、奶和乳制品；食用油和油脂' },
  'classdesc.30': { ru: 'Кофе, чай, какао и их заменители; рис, макароны и лапша; тапиока и саго; мука и продукты зерновые; хлеб, изделия кондитерские мучные и изделия кондитерские сахаристые; шоколад; мороженое, сорбеты и другой пищевой лед; сахар, мед, патока; дрожжи, порошок пекарский; соль, специи, пряности, консервированные травы; уксус, соусы и другие приправы; лед (вода замороженная).', en: 'Coffee, tea, cocoa and artificial coffee; rice; tapioca and sago; flour and preparations made from cereals; bread, pastry and confectionery; ices; sugar, honey, treacle; yeast, baking-powder; salt, mustard; vinegar, sauces (condiments); spices; ice.', zh: '咖啡、茶、可可和代用咖啡；米；西米和食用淀粉；面粉和谷类制品；面包、糕点和糖果；冰制食品；糖、蜂蜜、糖浆；鲜酵母、发酵粉；食盐、芥末；醋、沙司（调味品）；辛香料；食用冰' },
  'classdesc.31': { ru: 'Продукты сельскохозяйственные, аквакультуры, садово-огородные и лесные сырые и необработанные; зерна и семена сырые и необработанные; фрукты и овощи свежие, травы ароматические свежие; растения и цветы живые; луковицы, саженцы и семена для посадки; животные живые; корма и напитки для животных; солод.', en: 'Grains and agricultural, horticultural and forestry products not included in other classes; live animals; fresh fruits and vegetables; seeds, natural plants and flowers; foodstuffs for animals, malt.', zh: '不属别类的谷物和农业、园艺、林业产品；活动物；新鲜水果和蔬菜；种子、草木和花卉；动物饲料、麦芽' },
  'classdesc.32': { ru: 'Пиво; напитки безалкогольные; воды минеральные и газированные; напитки фруктовые и соки фруктовые; сиропы и прочие составы для изготовления безалкогольных напитков.', en: 'Beers; mineral and aerated waters and other non-alcoholic beverages; fruit beverages and fruit juices; syrups and other preparations for making beverages.', zh: '啤酒；矿泉水和汽水以及其他不含酒精的饮料；水果饮料和果汁；糖浆及其他制饮料用制剂' },
  'classdesc.33': { ru: 'Напитки алкогольные, кроме пива; составы алкогольные для приготовления напитков.', en: 'Alcoholic beverages (except beers).', zh: '含酒精饮料（啤酒除外）' },
  'classdesc.34': { ru: 'Табак и заменители табака; сигареты и сигары; сигареты электронные и вапорайзеры для курильщиков; принадлежности курительные; спички.', en: 'Tobacco; smokers’ articles; matches.', zh: '烟草；烟具；火柴' },
  'classdesc.35': { ru: 'Реклама; управление бизнесом, организация бизнеса, бизнес-администрирование; служба офисная.', en: 'Advertising; business management; business administration; office functions.', zh: '广告；商业经营；商业管理；办公事务' },
  'classdesc.36': { ru: 'Услуги финансовые, валютные и банковские; услуги страховые; услуги в сфере недвижимости.', en: 'Insurance; financial affairs; monetary affairs; real estate affairs.', zh: '保险；金融事务；货币事务；不动产事务' },
  'classdesc.37': { ru: 'Услуги строительные; услуги по установке и ремонту; добыча полезных ископаемых, бурение нефтяных и газовых скважин.', en: 'Building construction; repair; installation services.', zh: '房屋建筑；修理；安装服务' },
  'classdesc.38': { ru: 'Услуги телекоммуникационные.', en: 'Telecommunications.', zh: '电信' },
  'classdesc.39': { ru: 'Услуги транспортные; упаковывание и хранение товаров; организация путешествий.', en: 'Transport; packaging and storage of goods; travel arrangement.', zh: '运输；商品包装和贮藏；旅行安排' },
  'classdesc.40': { ru: 'Обработка материалов; переработка отходов и мусора; очистка воздуха и обработка воды; услуги полиграфические; консервирование пищевых продуктов и напитков.', en: 'Treatment of materials.', zh: '材料处理' },
  'classdesc.41': { ru: 'Образование; обеспечение обучения; развлечения; организация спортивных и культурных мероприятий.', en: 'Education; providing of training; entertainment; sporting and cultural activities.', zh: '教育；提供培训；娱乐；文体活动' },
  'classdesc.42': { ru: 'Услуги научные и технологические и относящиеся к ним исследования и разработки; услуги по промышленному анализу, промышленным исследованиям и промышленному дизайну; услуги контроля качества и аутентификации; проектирование и разработка компьютерного оборудования и программного обеспечения.', en: 'Scientific and technological services and research and design relating thereto; industrial analysis and industrial research services; design and development of computer hardware and software.', zh: '科学技术服务和与之相关的研究与设计服务；工业分析与工业研究服务；计算机硬件与软件的设计与开发' },
  'classdesc.43': { ru: 'Услуги по обеспечению пищевыми продуктами и напитками; обеспечение временного проживания.', en: 'Services for providing food and drink; temporary accommodation.', zh: '提供食物和饮料服务；临时住宿' },
  'classdesc.44': { ru: 'Услуги медицинские; услуги ветеринарные; услуги по гигиеническому и косметическому уходу за людьми и животными; услуги в области сельского хозяйства, аквакультуры, огородничества и лесоводства.', en: 'Medical services; veterinary services; hygienic and beauty care for human beings or animals; agriculture, horticulture and forestry services.', zh: '医疗服务；兽医服务；人或动物的卫生和美容服务；农业、园艺和林业服务' },
  'classdesc.45': { ru: 'Услуги юридические; службы безопасности для физической защиты материальных ценностей и людей; услуги службы знакомств, онлайн-сервисы социальных сетей; услуги ритуальные; присмотр за детьми.', en: 'Legal services; security services for the physical protection of individuals and goods; personal and social services rendered by others to meet the needs of individuals.', zh: '法律服务；为保护人身和财产的安全服务；由他人提供的为满足个人需要的私人和社会服务' },
} as const;

export type TranslationKey = keyof typeof translations;

/** Получить перевод ключа на язык */
export function t(key: TranslationKey, lang: Lang): string {
  const entry = translations[key];
  return entry[lang] ?? entry[DEFAULT_LANG];
}

/** «Класс N» / «Class N» / «第N类» */
export function tClassName(lang: Lang, id: number): string {
  if (lang === 'en') return `Class ${id}`;
  if (lang === 'zh') return `第${id}类`;
  return `Класс ${id}`;
}

/** «Кл.N» / «Cl.N» / «第N类» */
export function tClassShort(lang: Lang, id: number): string {
  if (lang === 'en') return `Cl.${id}`;
  if (lang === 'zh') return `第${id}类`;
  return `Кл.${id}`;
}

/** Официальный заголовок класса по id (fallback — RU-описание из данных) */
export function tClassDesc(lang: Lang, id: number, fallback: string): string {
  const key = `classdesc.${id}` as TranslationKey;
  if (key in translations) {
    const entry = translations[key];
    return entry[lang] ?? entry[DEFAULT_LANG];
  }
  return fallback;
}

/** Краткое имя класса в UI: имя из данных, но «Класс N» локализовано */
export function tClassLabel(lang: Lang, cls: { id: number; name: string }): string {
  return cls.name.replace(/^Класс\s+\d+/, tClassName(lang, cls.id));
}

/** «N позиций» с плюрализацией: ru позиция/позиции/позиций; en item(s); zh 项 */
export function tItems(lang: Lang, n: number): string {
  if (lang === 'en') return `${n} ${n === 1 ? 'item' : 'items'}`;
  if (lang === 'zh') return `${n} 项`;
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return `${n} позиций`;
  if (b > 1 && b < 5) return `${n} позиции`;
  if (b === 1) return `${n} позиция`;
  return `${n} позиций`;
}

/** «N классов» с плюрализацией */
export function tClassesCount(lang: Lang, n: number): string {
  if (lang === 'en') return `${n} ${n === 1 ? 'class' : 'classes'}`;
  if (lang === 'zh') return `${n} 个类别`;
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return `${n} классов`;
  if (b > 1 && b < 5) return `${n} класса`;
  if (b === 1) return `${n} класс`;
  return `${n} классов`;
}

/** «N классов в корзине» / «N classes in cart» / «购物车中 N 个类别» */
export function tClassesInCart(lang: Lang, n: number): string {
  if (lang === 'en') return `${tClassesCount(lang, n)} in cart`;
  if (lang === 'zh') return `购物车中 ${tClassesCount(lang, n)}`;
  return `${tClassesCount(lang, n)} в корзине`;
}

/** «N классов в избранном» / «N classes in favorites» / «收藏中 N 个类别» */
export function tClassesInFav(lang: Lang, n: number): string {
  if (lang === 'en') return `${tClassesCount(lang, n)} in favorites`;
  if (lang === 'zh') return `收藏中 ${tClassesCount(lang, n)}`;
  return `${tClassesCount(lang, n)} в избранном`;
}

/** «Найдено классов: N» / «Classes found: N» / «找到类别数：N» */
export function tFoundClasses(lang: Lang, n: number): string {
  if (lang === 'en') return `Classes found: ${n}`;
  if (lang === 'zh') return `找到类别数：${n}`;
  return `Найдено классов: ${n}`;
}

/** «A из B выбрано» / «A of B selected» / «已选 A／B» */
export function tOfSelected(lang: Lang, a: number, b: number): string {
  if (lang === 'en') return `${a} of ${b} selected`;
  if (lang === 'zh') return `已选 ${a}／${b}`;
  return `${a} из ${b} выбрано`;
}

/** Корзина: «N классов, M позиций выбрано» / EN / ZH */
export function tCartSummary(lang: Lang, classes: number, items: number): string {
  if (lang === 'en') return `${tClassesCount(lang, classes)}, ${tItems(lang, items)} selected`;
  if (lang === 'zh') return `已选 ${tClassesCount(lang, classes)}，${tItems(lang, items)}`;
  return `${tClassesCount(lang, classes)}, ${tItems(lang, items)} выбрано`;
}

/** «вкл. N × 500 ₽ за позиции свыше 10» / EN / ZH */
export function tOverItems(lang: Lang, n: number): string {
  if (lang === 'en') return `incl. ${n} × 500 ₽ for items over 10`;
  if (lang === 'zh') return `含 ${n} × 500 ₽（超出 10 项部分）`;
  return `вкл. ${n} × 500 ₽ за позиции свыше 10`;
}

/** «Показано A из B» / «Showing A of B» / «显示 A／B» */
export function tShownOf(lang: Lang, a: number, b: number): string {
  if (lang === 'en') return `Showing ${a} of ${b}`;
  if (lang === 'zh') return `显示 ${a}／${b}`;
  return `Показано ${a} из ${b}`;
}

/** «A из B» (счётчики карточек) */
export function tOfCount(lang: Lang, a: number, b: number): string {
  if (lang === 'en') return `${a} of ${b}`;
  if (lang === 'zh') return `${a}／${b}`;
  return `${a} из ${b}`;
}

/** Карта классов: «Классы 1–34 · N классов в M категориях» */
export function tMapStats(lang: Lang, clsRange: string, nClasses: number, nCats: number): string {
  if (lang === 'en') return `Classes ${clsRange} · ${nClasses} classes in ${nCats} categories`;
  if (lang === 'zh') return `类别 ${clsRange} · ${nCats} 个分类共 ${nClasses} 个类别`;
  return `Классы ${clsRange} · ${nClasses} классов в ${nCats} категориях`;
}

/** Распарсить cookie-строку и вернуть язык (с дефолтом ru) */
export function parseLang(cookieStr: string | null): Lang {
  if (!cookieStr) return DEFAULT_LANG;
  const m = cookieStr.match(/(?:^|;\s*)lang=(ru|en|zh)/);
  if (m && (m[1] === 'ru' || m[1] === 'en' || m[1] === 'zh')) return m[1];
  return DEFAULT_LANG;
}
