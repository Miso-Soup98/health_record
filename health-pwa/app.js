"use strict";

const STORAGE_KEY = "health-record-pwa.v1";
const DEFAULT_SETTINGS = {
  heightCm: 174,
  bmrKcal: 1700,
  currentWeightKg: 80,
  targetWeightKg: 70,
  normalTargetKcal: 2000,
  runTargetKcal: 2200,
  badmintonTargetKcal: 2600,
};

const DEFAULT_FOODS = [
  { key: "egg", name: "鸡蛋", unit: "1个", kcal: 75, protein: 6.2, fat: 5, carb: 0.4, category: "蛋白/脂肪" },
  { key: "yogurt", name: "森永ビヒダスプレーンヨーグルト", unit: "100g", kcal: 65, protein: 3.7, fat: 3.1, carb: 5.5, category: "乳制品" },
  { key: "oatmeal", name: "日食プレミアムピュアオートミール", unit: "30g", kcal: 111, protein: 4.4, fat: 2, carb: 20.6, category: "主食/谷物" },
  { key: "rice", name: "微波炉米饭", unit: "1份", kcal: 222, protein: 3.8, fat: 0.6, carb: 48, category: "主食" },
  { key: "konjac", name: "魔芋丝", unit: "100g", kcal: 8, protein: 0.2, fat: 0, carb: 3.5, category: "低热量" },
  { key: "vegetables", name: "白菜蘑菇等蔬菜", unit: "100g", kcal: 25, protein: 1.6, fat: 0.2, carb: 5, category: "蔬菜" },
  { key: "banana", name: "香蕉", unit: "1根", kcal: 90, protein: 1.1, fat: 0.2, carb: 23, category: "水果/碳水" },
  { key: "chickenBreast", name: "鸡胸/瘦鸡肉", unit: "100g生重", kcal: 120, protein: 23, fat: 2.5, carb: 0, category: "肉类" },
  { key: "chickenLeg", name: "鸡腿/普通鸡肉", unit: "100g生重", kcal: 180, protein: 18, fat: 12, carb: 0, category: "肉类" },
  { key: "leanBeef", name: "瘦牛肉", unit: "100g生重", kcal: 220, protein: 20, fat: 15, carb: 0, category: "肉类" },
  { key: "leanPork", name: "瘦猪肉", unit: "100g生重", kcal: 180, protein: 20, fat: 10, carb: 0, category: "肉类" },
  { key: "lamb", name: "羊肉", unit: "100g生重", kcal: 230, protein: 18, fat: 17, carb: 0, category: "肉类" },
  { key: "fattyMeat", name: "肥牛/五花等肥肉", unit: "100g生重", kcal: 350, protein: 14, fat: 32, carb: 0, category: "肉类" },
];
const DEFAULT_FOOD_KEYS = DEFAULT_FOODS.map((item) => item.key);

const DEFAULT_EXERCISES = [
  { key: "walking", name: "步行", met: 3.3, category: "日常" },
  { key: "briskWalking", name: "快走", met: 4.3, category: "有氧" },
  { key: "hiking", name: "徒步", met: 6, category: "户外" },
  { key: "swimming", name: "游泳", met: 7, category: "有氧" },
  { key: "cycling", name: "骑行", met: 6.8, category: "有氧" },
  { key: "manualBurn", name: "手动输入消耗", met: 0, category: "手填" },
];
const DEFAULT_EXERCISE_KEYS = DEFAULT_EXERCISES.map((item) => item.key);

const DAY_TYPES = [
  { value: "normal", label: "普通日" },
  { value: "run", label: "跑步+力量" },
  { value: "badminton", label: "羽毛球" },
  { value: "friday", label: "周五放纵/跑步" },
  { value: "rest", label: "休息" },
];

const FOOD_QUERY_ALIASES = [
  { terms: ["西红柿", "番茄"], query: "tomatoes red ripe raw" },
  { terms: ["圣女果", "小番茄"], query: "grape tomato raw" },
  { terms: ["黄瓜", "青瓜"], query: "cucumber raw" },
  { terms: ["土豆", "马铃薯"], query: "potato raw" },
  { terms: ["红薯", "地瓜", "番薯"], query: "sweet potato raw" },
  { terms: ["胡萝卜"], query: "carrot raw" },
  { terms: ["玉米"], query: "corn cooked" },
  { terms: ["洋葱"], query: "onion raw" },
  { terms: ["菠菜"], query: "spinach raw" },
  { terms: ["南瓜"], query: "pumpkin raw" },
  { terms: ["西兰花", "花椰菜"], query: "broccoli raw" },
  { terms: ["白菜", "大白菜"], query: "napa cabbage raw" },
  { terms: ["生菜"], query: "lettuce raw" },
  { terms: ["蘑菇", "香菇", "口蘑"], query: "mushroom raw" },
  { terms: ["苹果"], query: "apple raw" },
  { terms: ["香蕉"], query: "banana raw" },
  { terms: ["橙子", "橘子"], query: "orange raw" },
  { terms: ["草莓"], query: "strawberry raw" },
  { terms: ["蓝莓"], query: "blueberry raw" },
  { terms: ["葡萄"], query: "grape raw" },
  { terms: ["牛油果", "鳄梨"], query: "avocado raw" },
  { terms: ["鸡胸", "鸡胸肉"], query: "chicken breast raw" },
  { terms: ["鸡腿", "鸡腿肉"], query: "chicken thigh raw" },
  { terms: ["牛肉", "瘦牛肉"], query: "beef lean raw" },
  { terms: ["猪肉", "瘦猪肉"], query: "pork lean raw" },
  { terms: ["羊肉"], query: "lamb raw" },
  { terms: ["鸡蛋", "蛋"], query: "egg whole raw" },
  { terms: ["米饭", "白米饭"], query: "rice cooked" },
  { terms: ["乌冬", "乌冬面"], query: "udon noodles cooked" },
  { terms: ["荞麦面"], query: "soba noodles cooked" },
  { terms: ["意面", "意大利面"], query: "pasta cooked" },
  { terms: ["燕麦", "燕麦片"], query: "oats" },
  { terms: ["酸奶", "无糖酸奶"], query: "plain yogurt" },
  { terms: ["牛奶"], query: "milk" },
  { terms: ["豆腐"], query: "tofu" },
  { terms: ["虾", "虾仁"], query: "shrimp raw" },
  { terms: ["三文鱼", "鲑鱼"], query: "salmon raw" },
  { terms: ["金枪鱼"], query: "tuna raw" },
  { terms: ["饭团"], query: "onigiri" },
];

const FOOD_QUERY_TRANSLATIONS = [
  ["乐事", "lays"],
  ["卡乐比", "calbee"],
  ["格力高", "glico"],
  ["百奇", "pocky"],
  ["奥利奥", "oreo"],
  ["明治", "meiji"],
  ["森永", "morinaga"],
  ["日清", "nissin"],
  ["黄瓜味", "cucumber flavor"],
  ["烧烤味", "barbecue flavor"],
  ["原味", "original flavor"],
  ["海苔味", "seaweed flavor"],
  ["番茄味", "tomato flavor"],
  ["薯片", "potato chips"],
  ["薯条", "french fries"],
  ["虾条", "shrimp chips"],
  ["饼干", "biscuits"],
  ["曲奇", "cookies"],
  ["巧克力", "chocolate"],
  ["糖果", "candy"],
  ["软糖", "gummy candy"],
  ["果冻", "jelly"],
  ["冰淇淋", "ice cream"],
  ["雪糕", "ice cream bar"],
  ["蛋糕", "cake"],
  ["面包", "bread"],
  ["泡面", "instant noodles"],
  ["方便面", "instant noodles"],
  ["拉面", "ramen"],
  ["饭团", "onigiri"],
  ["便当", "bento"],
  ["三明治", "sandwich"],
  ["可乐", "cola"],
  ["奶茶", "milk tea"],
  ["果汁", "juice"],
];

const LOCAL_FOOD_NUTRITION = [
  { terms: ["西红柿", "番茄"], displayName: "西红柿/番茄，生", category: "蔬菜", kcal: 18, protein: 0.9, fat: 0.2, carb: 3.9 },
  { terms: ["圣女果", "小番茄"], displayName: "圣女果/小番茄，生", category: "蔬菜", kcal: 27, protein: 0.8, fat: 0.6, carb: 5.5 },
  { terms: ["黄瓜", "青瓜"], displayName: "黄瓜，生", category: "蔬菜", kcal: 15, protein: 0.7, fat: 0.1, carb: 3.6 },
  { terms: ["土豆", "马铃薯"], displayName: "土豆，生", category: "蔬菜", kcal: 77, protein: 2, fat: 0.1, carb: 17.5 },
  { terms: ["红薯", "地瓜", "番薯"], displayName: "红薯，生", category: "主食/谷物", kcal: 86, protein: 1.6, fat: 0.1, carb: 20.1 },
  { terms: ["胡萝卜"], displayName: "胡萝卜，生", category: "蔬菜", kcal: 41, protein: 0.9, fat: 0.2, carb: 9.6 },
  { terms: ["玉米"], displayName: "玉米，熟", category: "主食/谷物", kcal: 96, protein: 3.4, fat: 1.5, carb: 21 },
  { terms: ["洋葱"], displayName: "洋葱，生", category: "蔬菜", kcal: 40, protein: 1.1, fat: 0.1, carb: 9.3 },
  { terms: ["菠菜"], displayName: "菠菜，生", category: "蔬菜", kcal: 23, protein: 2.9, fat: 0.4, carb: 3.6 },
  { terms: ["南瓜"], displayName: "南瓜，生", category: "蔬菜", kcal: 26, protein: 1, fat: 0.1, carb: 6.5 },
  { terms: ["西兰花", "花椰菜"], displayName: "西兰花，生", category: "蔬菜", kcal: 34, protein: 2.8, fat: 0.4, carb: 6.6 },
  { terms: ["白菜", "大白菜"], displayName: "大白菜，生", category: "蔬菜", kcal: 16, protein: 1.2, fat: 0.2, carb: 3.2 },
  { terms: ["蘑菇", "香菇", "口蘑"], displayName: "蘑菇，生", category: "蔬菜", kcal: 22, protein: 3.1, fat: 0.3, carb: 3.3 },
  { terms: ["苹果"], displayName: "苹果，生", category: "水果/碳水", kcal: 52, protein: 0.3, fat: 0.2, carb: 13.8 },
  { terms: ["香蕉"], displayName: "香蕉，生", category: "水果/碳水", kcal: 89, protein: 1.1, fat: 0.3, carb: 22.8 },
  { terms: ["橙子", "橘子"], displayName: "橙子，生", category: "水果/碳水", kcal: 47, protein: 0.9, fat: 0.1, carb: 11.8 },
  { terms: ["草莓"], displayName: "草莓，生", category: "水果/碳水", kcal: 32, protein: 0.7, fat: 0.3, carb: 7.7 },
  { terms: ["蓝莓"], displayName: "蓝莓，生", category: "水果/碳水", kcal: 57, protein: 0.7, fat: 0.3, carb: 14.5 },
  { terms: ["葡萄"], displayName: "葡萄，生", category: "水果/碳水", kcal: 69, protein: 0.7, fat: 0.2, carb: 18.1 },
  { terms: ["牛油果", "鳄梨"], displayName: "牛油果/鳄梨，生", category: "水果/碳水", kcal: 160, protein: 2, fat: 14.7, carb: 8.5 },
  { terms: ["鸡胸", "鸡胸肉"], displayName: "鸡胸肉，生", category: "肉类", kcal: 120, protein: 23, fat: 2.5, carb: 0 },
  { terms: ["鸡腿", "鸡腿肉"], displayName: "鸡腿肉，生", category: "肉类", kcal: 180, protein: 18, fat: 12, carb: 0 },
  { terms: ["瘦牛肉", "牛肉"], displayName: "瘦牛肉，生", category: "肉类", kcal: 220, protein: 20, fat: 15, carb: 0 },
  { terms: ["瘦猪肉", "猪肉"], displayName: "瘦猪肉，生", category: "肉类", kcal: 180, protein: 20, fat: 10, carb: 0 },
  { terms: ["羊肉"], displayName: "羊肉，生", category: "肉类", kcal: 230, protein: 18, fat: 17, carb: 0 },
  { terms: ["鸡蛋", "蛋"], displayName: "鸡蛋", category: "蛋白/脂肪", kcal: 143, protein: 12.6, fat: 9.5, carb: 0.7 },
  { terms: ["米饭", "白米饭"], displayName: "白米饭，熟", category: "主食/谷物", kcal: 116, protein: 2.6, fat: 0.3, carb: 25.9 },
  { terms: ["乌冬", "乌冬面"], displayName: "乌冬面，熟", category: "主食/谷物", kcal: 105, protein: 2.6, fat: 0.4, carb: 21.3 },
  { terms: ["荞麦面"], displayName: "荞麦面，熟", category: "主食/谷物", kcal: 99, protein: 5.1, fat: 0.1, carb: 21.4 },
  { terms: ["意面", "意大利面"], displayName: "意大利面，熟", category: "主食/谷物", kcal: 158, protein: 5.8, fat: 0.9, carb: 30.9 },
  { terms: ["燕麦", "燕麦片"], displayName: "燕麦片", category: "主食/谷物", kcal: 370, protein: 13.2, fat: 6.5, carb: 67.7 },
  { terms: ["酸奶", "无糖酸奶"], displayName: "无糖酸奶", category: "乳制品", kcal: 61, protein: 3.5, fat: 3.3, carb: 4.7 },
  { terms: ["牛奶"], displayName: "牛奶", category: "乳制品", kcal: 61, protein: 3.2, fat: 3.3, carb: 4.8 },
  { terms: ["豆腐"], displayName: "豆腐", category: "蛋白/脂肪", kcal: 76, protein: 8.1, fat: 4.8, carb: 1.9 },
  { terms: ["虾", "虾仁"], displayName: "虾仁，生", category: "肉类", kcal: 85, protein: 20.1, fat: 0.5, carb: 0 },
  { terms: ["三文鱼", "鲑鱼"], displayName: "三文鱼，生", category: "肉类", kcal: 208, protein: 20.4, fat: 13.4, carb: 0 },
  { terms: ["金枪鱼"], displayName: "金枪鱼，生", category: "肉类", kcal: 109, protein: 24.4, fat: 0.5, carb: 0 },
];

const PACKAGED_FOOD_ESTIMATES = [
  { terms: ["薯片", "薯条", "虾条", "膨化", "乐事", "卡乐比", "lays", "calbee", "potato chips", "ポテトチップス"], displayName: "薯片/膨化零食估算", category: "零食", kcal: 540, protein: 6, fat: 34, carb: 52 },
  { terms: ["饼干", "曲奇", "奥利奥", "oreo", "cookie", "biscuit", "クッキー", "ビスケット"], displayName: "饼干/曲奇估算", category: "零食", kcal: 480, protein: 6, fat: 20, carb: 70 },
  { terms: ["巧克力", "可可", "明治", "meiji", "kitkat", "chocolate", "チョコ"], displayName: "巧克力估算", category: "零食", kcal: 540, protein: 7, fat: 32, carb: 56 },
  { terms: ["百奇", "pocky", "格力高", "glico"], displayName: "巧克力饼干棒估算", category: "零食", kcal: 500, protein: 7, fat: 24, carb: 64 },
  { terms: ["糖果", "软糖", "硬糖", "gummy", "candy", "グミ", "キャンディ"], displayName: "糖果/软糖估算", category: "零食", kcal: 390, protein: 0, fat: 0.2, carb: 96 },
  { terms: ["果冻", "布丁", "jelly", "pudding", "ゼリー", "プリン"], displayName: "果冻/布丁估算", category: "零食", kcal: 120, protein: 2, fat: 2, carb: 24 },
  { terms: ["冰淇淋", "雪糕", "冰激凌", "ice cream", "アイス"], displayName: "冰淇淋/雪糕估算", category: "零食", kcal: 210, protein: 3.5, fat: 11, carb: 24 },
  { terms: ["蛋糕", "泡芙", "甜甜圈", "cake", "donut", "ケーキ", "ドーナツ"], displayName: "蛋糕/甜点估算", category: "零食", kcal: 360, protein: 5, fat: 18, carb: 45 },
  { terms: ["坚果", "花生", "杏仁", "腰果", "瓜子", "nuts", "peanut", "almond", "cashew"], displayName: "坚果零食估算", category: "零食", kcal: 600, protein: 20, fat: 50, carb: 20 },
  { terms: ["泡面", "方便面", "杯面", "日清", "nissin", "instant noodles", "cup noodles", "ラーメン", "カップヌードル"], displayName: "方便面/杯面估算", category: "主食/谷物", kcal: 450, protein: 9, fat: 18, carb: 62 },
  { terms: ["面包", "吐司", "可颂", "菓子パン", "bread", "toast", "croissant", "パン"], displayName: "面包/烘焙估算", category: "主食/谷物", kcal: 280, protein: 8, fat: 6, carb: 50 },
  { terms: ["饭团", "おにぎり", "onigiri"], displayName: "饭团估算", category: "主食/谷物", kcal: 180, protein: 4, fat: 2, carb: 37 },
  { terms: ["便当", "弁当", "盒饭", "bento"], displayName: "便当估算", category: "主食/谷物", kcal: 180, protein: 7, fat: 6, carb: 25 },
  { terms: ["三明治", "sandwich", "サンド"], displayName: "三明治估算", category: "主食/谷物", kcal: 240, protein: 9, fat: 9, carb: 30 },
  { terms: ["可乐", "汽水", "碳酸饮料", "cola", "soda", "ソーダ"], displayName: "含糖汽水估算", category: "饮料", unitLabel: "ml", kcal: 42, protein: 0, fat: 0, carb: 10.6 },
  { terms: ["奶茶", "milk tea", "ミルクティー"], displayName: "奶茶估算", category: "饮料", unitLabel: "ml", kcal: 55, protein: 1, fat: 1.5, carb: 9.5 },
  { terms: ["果汁", "juice", "ジュース"], displayName: "果汁估算", category: "饮料", unitLabel: "ml", kcal: 45, protein: 0.3, fat: 0.1, carb: 10.5 },
  { terms: ["拿铁", "咖啡牛奶", "latte", "カフェラテ"], displayName: "拿铁/咖啡牛奶估算", category: "饮料", unitLabel: "ml", kcal: 45, protein: 2.5, fat: 1.8, carb: 4.8 },
  { terms: ["蛋白棒", "protein bar"], displayName: "蛋白棒估算", category: "零食", kcal: 360, protein: 22, fat: 12, carb: 42 },
];

const GENERIC_PACKAGED_ESTIMATE = {
  displayName: "未识别成品估算",
  category: "其他",
  kcal: 300,
  protein: 6,
  fat: 12,
  carb: 42,
  confidence: "low",
};

const app = document.getElementById("app");
const toastEl = document.getElementById("toast");
let installPrompt = null;
let toastTimer = null;
let draftOverride = null;
let foodLookupState = {
  status: "idle",
  query: "",
  message: "",
  results: [],
  formDraft: null,
};
const foodLookupCache = new Map();

const state = loadState();

function loadState() {
  const fallback = {
    version: 1,
    activeTab: "dashboard",
    selectedDate: localISODate(),
    settings: { ...DEFAULT_SETTINGS },
    foods: normalizeFoods(DEFAULT_FOODS),
    exercises: normalizeExercises(DEFAULT_EXERCISES),
    records: {},
    cloud: {
      supabaseUrl: "",
      anonKey: "",
      email: "",
      accessToken: "",
      refreshToken: "",
      userId: "",
      lastSyncAt: "",
    },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      settings: { ...fallback.settings, ...(parsed.settings || {}) },
      foods: Array.isArray(parsed.foods) && parsed.foods.length ? normalizeFoods(parsed.foods) : fallback.foods,
      exercises: Array.isArray(parsed.exercises) && parsed.exercises.length ? normalizeExercises(parsed.exercises) : fallback.exercises,
      records: parsed.records || {},
      cloud: { ...fallback.cloud, ...(parsed.cloud || {}) },
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function localISODate(date = new Date()) {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return copy.toISOString().slice(0, 10);
}

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(iso, days) {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return localISODate(date);
}

function zhWeekday(iso) {
  return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][parseISODate(iso).getDay()];
}

function formatDate(iso) {
  if (!iso) return "-";
  const [year, month, day] = iso.split("-");
  return `${year}.${month}.${day}`;
}

function numberValue(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function inferFoodUnit(unit) {
  const text = String(unit || "").trim();
  const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { baseAmount: 1, unitLabel: text || "份" };
  const amount = numberValue(match[1], 1);
  const rest = match[2].trim();
  const labelMatch = rest.match(/^(g|kg|ml|l|个|根|份|勺|杯|包|片|枚|kcal)/i);
  return {
    baseAmount: amount || 1,
    unitLabel: labelMatch ? labelMatch[1] : rest || "份",
  };
}

function normalizeFood(item) {
  const inferred = inferFoodUnit(item.unit);
  const baseAmount = numberValue(item.baseAmount, inferred.baseAmount || 1) || 1;
  const unitLabel = String(item.unitLabel || inferred.unitLabel || "份").trim();
  return {
    key: item.key || makeFoodKey(item.name || "food"),
    name: String(item.name || "未命名食品"),
    unit: item.unit || `${baseAmount}${unitLabel}`,
    baseAmount,
    unitLabel,
    kcal: numberValue(item.kcal),
    protein: numberValue(item.protein),
    fat: numberValue(item.fat),
    carb: numberValue(item.carb),
    category: String(item.category || "其他"),
    custom: Boolean(item.custom) || !DEFAULT_FOOD_KEYS.includes(item.key),
  };
}

function normalizeFoods(foods) {
  return structuredCloneSafe(foods).map(normalizeFood);
}

function normalizeExercise(item) {
  return {
    key: item.key || makeExerciseKey(item.name || "exercise"),
    name: String(item.name || "未命名运动"),
    met: numberValue(item.met, 0),
    category: String(item.category || "其他"),
    custom: Boolean(item.custom) || !DEFAULT_EXERCISE_KEYS.includes(item.key),
  };
}

function normalizeExercises(exercises) {
  return structuredCloneSafe(exercises).map(normalizeExercise);
}

function makeFoodKey(name) {
  const safe = String(name || "food")
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
  return `custom_${safe || "food"}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function makeExerciseKey(name) {
  const safe = String(name || "exercise")
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
  return `exercise_${safe || "item"}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function displayFoodUnit(item) {
  if (!item) return "";
  return `${fmt(numberValue(item.baseAmount, 1), numberValue(item.baseAmount, 1) % 1 ? 1 : 0)}${item.unitLabel || "份"}`;
}

function fmt(value, digits = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "-";
  return numeric.toLocaleString("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.add("show");
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function foodByKey(key) {
  return state.foods.find((item) => item.key === key) || DEFAULT_FOODS.find((item) => item.key === key);
}

function exerciseByKey(key) {
  return state.exercises.find((item) => item.key === key) || DEFAULT_EXERCISES.find((item) => item.key === key);
}

function foodOptionsHTML(selected) {
  const selectedExists = state.foods.some((item) => item.key === selected);
  return `
    ${selected && !selectedExists ? `<option value="${escapeHTML(selected)}" selected>已删除食品</option>` : ""}
    ${state.foods
      .map((item) => `<option value="${escapeHTML(item.key)}" ${item.key === selected ? "selected" : ""}>${escapeHTML(item.name)} / ${escapeHTML(displayFoodUnit(item))}</option>`)
      .join("")}
  `;
}

function exerciseOptionsHTML(selected) {
  const selectedExists = state.exercises.some((item) => item.key === selected);
  return `
    ${selected && !selectedExists ? `<option value="${escapeHTML(selected)}" selected>已删除运动</option>` : ""}
    ${state.exercises
      .map((item) => `<option value="${escapeHTML(item.key)}" ${item.key === selected ? "selected" : ""}>${escapeHTML(item.name)}${item.met ? ` / ${fmt(item.met, 1)} MET` : " / 手填 kcal"}</option>`)
      .join("")}
  `;
}

function meatOptionsHTML(selected) {
  return state.foods
    .filter((item) => item.category === "肉类")
    .map((item) => `<option value="${escapeHTML(item.key)}" ${item.key === selected ? "selected" : ""}>${escapeHTML(item.name)}</option>`)
    .join("");
}

function defaultRecordForDate(date) {
  const day = parseISODate(date).getDay();
  const meatCycle = ["chickenBreast", "lamb", "leanBeef", "leanPork", "chickenBreast", "leanBeef", "leanPork"];
  const base = {
    date,
    dayType: "run",
    eggs: 2,
    yogurtG: 400,
    oatmealG: 30,
    riceServings: 1,
    konjacG: 150,
    vegetablesG: 250,
    meatKey: meatCycle[day],
    meatG: 250,
    bananas: 3,
    extraKcal: 0,
    runKm: 6.5,
    walkingMin: 0,
    strengthMin: 30,
    burpeeCount: 0,
    badmintonHours: 0,
    otherExercises: [],
    weightKg: "",
    waistCm: "",
    otherFoods: [],
    notes: "",
  };

  if (day === 5) {
    return { ...base, dayType: "friday", extraKcal: 1000 };
  }
  if (day === 6 || day === 0) {
    return {
      ...base,
      dayType: "badminton",
      runKm: 0,
      walkingMin: 0,
      strengthMin: 0,
      badmintonHours: 3.5,
    };
  }
  return base;
}

function getRecord(date) {
  if (draftOverride?.date === date) return draftOverride;
  return state.records[date] || defaultRecordForDate(date);
}

function sortedRecords(direction = "asc") {
  const records = Object.values(state.records).filter(Boolean);
  records.sort((a, b) => a.date.localeCompare(b.date));
  if (direction === "desc") records.reverse();
  return records;
}

function lastWeightBefore(date) {
  const records = sortedRecords("asc").filter((record) => record.date <= date && numberValue(record.weightKg, 0) > 0);
  const latest = records.at(-1);
  return numberValue(latest?.weightKg, state.settings.currentWeightKg);
}

function ratioForFood(item, amount, mode) {
  if (!item) return { kcal: 0, protein: 0, fat: 0, carb: 0 };
  const divisor = mode === "per30" ? 30 : mode === "per100" ? 100 : mode === "base" ? numberValue(item.baseAmount, 1) || 1 : 1;
  const ratio = numberValue(amount) / divisor;
  return {
    kcal: ratio * item.kcal,
    protein: ratio * item.protein,
    fat: ratio * item.fat,
    carb: ratio * item.carb,
  };
}

function otherFoodsNutrition(record) {
  return (record.otherFoods || []).map((entry) => ratioForFood(foodByKey(entry.foodKey), entry.amount, "base"));
}

function otherExercisesKcal(record, weight) {
  return (record.otherExercises || []).reduce((sum, entry) => {
    const manualKcal = numberValue(entry.kcal, 0);
    if (manualKcal > 0) return sum + manualKcal;
    const exercise = exerciseByKey(entry.exerciseKey);
    if (!exercise) return sum;
    return sum + weight * numberValue(exercise.met, 0) * numberValue(entry.minutes, 0) / 60;
  }, 0);
}

function addNutrition(...parts) {
  return parts.reduce(
    (sum, part) => ({
      kcal: sum.kcal + part.kcal,
      protein: sum.protein + part.protein,
      fat: sum.fat + part.fat,
      carb: sum.carb + part.carb,
    }),
    { kcal: 0, protein: 0, fat: 0, carb: 0 },
  );
}

function computeRecord(record) {
  const weight = numberValue(record.weightKg, lastWeightBefore(record.date));
  const nutrition = addNutrition(
    ratioForFood(foodByKey("egg"), record.eggs, "unit"),
    ratioForFood(foodByKey("yogurt"), record.yogurtG, "per100"),
    ratioForFood(foodByKey("oatmeal"), record.oatmealG, "per30"),
    ratioForFood(foodByKey("rice"), record.riceServings, "unit"),
    ratioForFood(foodByKey("konjac"), record.konjacG, "per100"),
    ratioForFood(foodByKey("vegetables"), record.vegetablesG, "per100"),
    ratioForFood(foodByKey(record.meatKey), record.meatG, "per100"),
    ratioForFood(foodByKey("banana"), record.bananas, "unit"),
    { kcal: numberValue(record.extraKcal), protein: 0, fat: 0, carb: 0 },
    ...otherFoodsNutrition(record),
  );

  const exerciseKcal =
    weight * numberValue(record.runKm) +
    weight * 3.3 * numberValue(record.walkingMin) / 60 +
    weight * 4 * numberValue(record.strengthMin) / 60 +
    weight * 8 * numberValue(record.burpeeCount) / 120 +
    weight * 7 * numberValue(record.badmintonHours) +
    otherExercisesKcal(record, weight);
  const totalBurn = state.settings.bmrKcal * 1.2 + exerciseKcal;
  const netKcal = nutrition.kcal - totalBurn;
  const targetKcal =
    record.dayType === "badminton"
      ? state.settings.badmintonTargetKcal
      : record.dayType === "run" || record.dayType === "friday"
        ? state.settings.runTargetKcal
        : state.settings.normalTargetKcal;

  return {
    weight,
    intakeKcal: nutrition.kcal,
    protein: nutrition.protein,
    fat: nutrition.fat,
    carb: nutrition.carb,
    exerciseKcal,
    totalBurn,
    netKcal,
    targetKcal,
  };
}

function dateRangeRecords(endDate, days) {
  const start = addDays(endDate, -(days - 1));
  return sortedRecords("asc").filter((record) => record.date >= start && record.date <= endDate);
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

function dashboardSummary() {
  const today = localISODate();
  const records = sortedRecords("asc");
  const latest = records.filter((record) => record.date <= today).at(-1) || records.at(-1);
  const latestComputed = latest ? computeRecord(latest) : null;
  const last7 = dateRangeRecords(today, 7);
  const last30 = dateRangeRecords(today, 30);
  const weight7 = average(last7.map((record) => numberValue(record.weightKg, NaN)));
  const intake7 = average(last7.map((record) => computeRecord(record).intakeKcal));
  const burn7 = average(last7.map((record) => computeRecord(record).totalBurn));
  const net7 = average(last7.map((record) => computeRecord(record).netKcal));
  const intake30 = average(last30.map((record) => computeRecord(record).intakeKcal));
  const net30 = average(last30.map((record) => computeRecord(record).netKcal));

  return {
    today,
    records,
    latest,
    latestComputed,
    last7,
    last30,
    weight7,
    intake7,
    burn7,
    net7,
    intake30,
    net30,
  };
}

function icon(name) {
  const paths = {
    chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15l3-4 3 2 4-7"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.05.05a2.1 2.1 0 1 1-2.97 2.97l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66V21a2.1 2.1 0 1 1-4.2 0v-.07a1.8 1.8 0 0 0-1.18-1.66 1.8 1.8 0 0 0-1.98.36l-.05.05a2.1 2.1 0 1 1-2.97-2.97l.05-.05a1.8 1.8 0 0 0 .36-1.98 1.8 1.8 0 0 0-1.66-1.1H3a2.1 2.1 0 1 1 0-4.2h.07a1.8 1.8 0 0 0 1.66-1.18 1.8 1.8 0 0 0-.36-1.98l-.05-.05A2.1 2.1 0 1 1 7.3 3.2l.05.05a1.8 1.8 0 0 0 1.98.36H9.4A1.8 1.8 0 0 0 10.5 2V2a2.1 2.1 0 1 1 4.2 0v.07a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.05-.05a2.1 2.1 0 1 1 2.97 2.97l-.05.05a1.8 1.8 0 0 0-.36 1.98v.07A1.8 1.8 0 0 0 22 9.5h0a2.1 2.1 0 1 1 0 4.2h-.07A1.8 1.8 0 0 0 20.27 15Z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',
    cloud: '<path d="M17.5 19H7a5 5 0 1 1 1.2-9.85A6 6 0 0 1 19.7 12 3.5 3.5 0 0 1 17.5 19Z"/>',
    install: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/><path d="M19 3h2v4"/>',
    weight: '<path d="M6 7h12l2 14H4Z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M12 12v4"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-3.2-2-5.2-4.2-7.4-.6 2-1.7 3.4-3.3 4.3.5-3.4-1.1-6-4.2-8.9C7.6 7.4 5 10.6 5 15c0 4 3 7 7 7Z"/>',
    run: '<path d="m13 4 3 3-2 4"/><path d="M4 17l5-3 2-5 4 3 4 1"/><path d="m7 21 2-7"/><path d="m14 21-3-4"/><path d="M16 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/>',
    food: '<path d="M4 3v8"/><path d="M8 3v8"/><path d="M4 7h4"/><path d="M6 11v10"/><path d="M15 3v18"/><path d="M15 3c3 1.2 5 4.2 5 7.5 0 2.2-1.8 3.5-5 3.5"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v7h7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.chart}</svg>`;
}

function render() {
  app.innerHTML = `
    <div class="app-frame">
      ${renderTopbar()}
      ${renderNav()}
      ${renderActiveScreen()}
    </div>
  `;
  bindCurrentScreen();
  requestAnimationFrame(drawCharts);
}

function renderTopbar() {
  const summary = dashboardSummary();
  const latest = summary.latest;
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">${icon("chart")}</div>
        <div>
          <h1>健康记录</h1>
          <p>${latest ? `最近：${formatDate(latest.date)} ${zhWeekday(latest.date)}` : `今天：${formatDate(localISODate())} ${zhWeekday(localISODate())}`}</p>
        </div>
      </div>
      <div class="top-actions">
        <button class="icon-button" data-action="export-json" title="导出备份" aria-label="导出备份">${icon("download")}</button>
        <button class="icon-button" data-action="install-app" title="安装应用" aria-label="安装应用">${icon("install")}</button>
      </div>
    </header>
  `;
}

function renderNav() {
  const items = [
    ["dashboard", "总览", "chart"],
    ["record", "记录", "edit"],
    ["history", "历史", "list"],
    ["settings", "设置", "settings"],
  ];
  return `
    <nav class="nav-tabs" aria-label="主导航">
      ${items
        .map(
          ([tab, label, iconName]) => `
            <button class="nav-button ${state.activeTab === tab ? "active" : ""}" data-tab="${tab}">
              ${icon(iconName)}<span>${label}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function renderActiveScreen() {
  if (state.activeTab === "record") return renderRecordScreen();
  if (state.activeTab === "history") return renderHistoryScreen();
  if (state.activeTab === "settings") return renderSettingsScreen();
  return renderDashboardScreen();
}

function renderDashboardScreen() {
  const summary = dashboardSummary();
  const latest = summary.latest;
  const computed = summary.latestComputed;
  const netClass = computed && computed.netKcal > 0 ? "warning" : "positive";
  return `
    <main class="screen">
      <section class="grid four">
        ${renderStatCard("food", "最近摄入", computed ? `${fmt(computed.intakeKcal)} kcal` : "-", latest ? formatDate(latest.date) : "暂无记录")}
        ${renderStatCard("run", "最近总消耗", computed ? `${fmt(computed.totalBurn)} kcal` : "-", computed ? `运动 ${fmt(computed.exerciseKcal)} kcal` : "BMR + 活动")}
        ${renderStatCard("flame", "最近净热量", computed ? `<span class="${netClass}">${fmt(computed.netKcal)} kcal</span>` : "-", "摄入 - 总消耗")}
        ${renderStatCard("weight", "7日均重", summary.weight7 ? `${fmt(summary.weight7, 1)} kg` : "-", `目标 ${fmt(state.settings.targetWeightKg, 1)} kg`)}
      </section>

      <section class="grid two">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">摄入 / 消耗 / 净热量</h2>
              <p class="panel-subtitle">最近 14 条记录</p>
            </div>
            <button class="text-button" data-open-record="${localISODate()}">${icon("plus")}今天</button>
          </div>
          <div class="chart-wrap"><canvas id="energyChart" aria-label="摄入消耗趋势"></canvas></div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">体重趋势</h2>
              <p class="panel-subtitle">已记录体重与 7 日均重</p>
            </div>
            <button class="text-button" data-open-record="${localISODate()}">${icon("weight")}体重</button>
          </div>
          <div class="chart-wrap"><canvas id="weightChart" aria-label="体重趋势"></canvas></div>
        </div>
      </section>

      <section class="grid two">
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">三大营养素</h2>
              <p class="panel-subtitle">${latest ? `${formatDate(latest.date)} 的估算` : "保存记录后显示"}</p>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="macroChart" aria-label="三大营养素"></canvas></div>
        </div>
        <div class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">区间摘要</h2>
              <p class="panel-subtitle">按真实保存记录计算</p>
            </div>
          </div>
          <div class="summary-strip">
            ${renderMiniStat("7日平均摄入", summary.intake7 ? `${fmt(summary.intake7)} kcal` : "-")}
            ${renderMiniStat("7日平均消耗", summary.burn7 ? `${fmt(summary.burn7)} kcal` : "-")}
            ${renderMiniStat("7日平均净热量", summary.net7 ? `${fmt(summary.net7)} kcal` : "-")}
            ${renderMiniStat("30日平均摄入", summary.intake30 ? `${fmt(summary.intake30)} kcal` : "-")}
            ${renderMiniStat("30日平均净热量", summary.net30 ? `${fmt(summary.net30)} kcal` : "-")}
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderStatCard(iconName, label, value, note) {
  return `
    <article class="stat-card">
      <div class="stat-label">${icon(iconName)}<span>${label}</span></div>
      <div class="stat-value">${value}</div>
      <div class="stat-note">${escapeHTML(note)}</div>
    </article>
  `;
}

function renderMiniStat(label, value) {
  return `<div class="mini-stat"><span>${escapeHTML(label)}</span><strong>${value}</strong></div>`;
}

function renderRecordScreen() {
  const record = getRecord(state.selectedDate);
  const computed = computeRecord(record);
  return `
    <main class="screen">
      <form id="recordForm" class="grid">
        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">每日记录</h2>
              <p class="panel-subtitle">${formatDate(record.date)} ${zhWeekday(record.date)}</p>
            </div>
            <div class="button-row">
              <button type="button" class="ghost-button" data-action="apply-default">${icon("reset")}默认</button>
              <button type="submit" class="primary-button">${icon("save")}保存</button>
            </div>
          </div>
          <div class="form-grid">
            <div class="field">
              <label for="date">日期</label>
              <input id="date" name="date" type="date" value="${escapeHTML(record.date)}" />
            </div>
            <div class="field">
              <label for="dayType">日类型</label>
              <select id="dayType" name="dayType">
                ${DAY_TYPES.map((item) => `<option value="${item.value}" ${item.value === record.dayType ? "selected" : ""}>${item.label}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="weightKg">体重 kg</label>
              <input id="weightKg" name="weightKg" inputmode="decimal" value="${escapeHTML(record.weightKg)}" placeholder="${fmt(lastWeightBefore(record.date), 1)}" />
            </div>
            <div class="field">
              <label for="waistCm">腰围 cm</label>
              <input id="waistCm" name="waistCm" inputmode="decimal" value="${escapeHTML(record.waistCm)}" />
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">饮食</h2>
              <p class="panel-subtitle">按你的 Excel 食品库估算热量和营养素</p>
            </div>
          </div>
          <div class="form-grid">
            ${inputField("eggs", "鸡蛋 个", record.eggs)}
            ${inputField("yogurtG", "酸奶 g", record.yogurtG)}
            ${inputField("oatmealG", "麦片 g", record.oatmealG)}
            ${inputField("riceServings", "米饭 份", record.riceServings)}
            ${inputField("konjacG", "魔芋丝 g", record.konjacG)}
            ${inputField("vegetablesG", "蔬菜 g", record.vegetablesG)}
            <div class="field">
              <label for="meatKey">肉类</label>
              <select id="meatKey" name="meatKey">${meatOptionsHTML(record.meatKey)}</select>
            </div>
            ${inputField("meatG", "肉 g", record.meatG)}
            ${inputField("bananas", "香蕉 根", record.bananas)}
            ${inputField("extraKcal", "额外/放纵 kcal", record.extraKcal)}
          </div>
          <div class="panel-header compact-header">
            <div>
              <h3 class="panel-title">其他食物</h3>
              <p class="panel-subtitle">从食品库选择，数量按食品库里的基准单位换算</p>
            </div>
            <button type="button" class="text-button" data-action="add-other-food">${icon("plus")}添加</button>
          </div>
          ${renderOtherFoodRows(record)}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">运动</h2>
              <p class="panel-subtitle">运动消耗会随体重自动变化</p>
            </div>
          </div>
          <div class="form-grid">
            ${inputField("runKm", "跑步 km", record.runKm)}
            ${inputField("walkingMin", "走路 min", record.walkingMin)}
            ${inputField("strengthMin", "力量训练 min", record.strengthMin)}
            ${inputField("burpeeCount", "波比 个", record.burpeeCount)}
            ${inputField("badmintonHours", "羽毛球 h", record.badmintonHours)}
          </div>
          <div class="panel-header compact-header">
            <div>
              <h3 class="panel-title">其他运动</h3>
              <p class="panel-subtitle">按运动库 MET 估算，也可以手填 kcal</p>
            </div>
            <button type="button" class="text-button" data-action="add-other-exercise">${icon("plus")}添加</button>
          </div>
          ${renderOtherExerciseRows(record)}
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">保存前预览</h2>
              <p class="panel-subtitle">实时估算，不替代专业测量</p>
            </div>
          </div>
          <div class="summary-strip">
            ${renderMiniStat("总摄入", `${fmt(computed.intakeKcal)} kcal`)}
            ${renderMiniStat("运动消耗", `${fmt(computed.exerciseKcal)} kcal`)}
            ${renderMiniStat("总消耗", `${fmt(computed.totalBurn)} kcal`)}
            ${renderMiniStat("净热量", `${fmt(computed.netKcal)} kcal`)}
            ${renderMiniStat("蛋白 / 脂肪 / 碳水", `${fmt(computed.protein, 1)} / ${fmt(computed.fat, 1)} / ${fmt(computed.carb, 1)} g`)}
          </div>
          <div class="field full" style="margin-top: 14px;">
            <label for="notes">备注</label>
            <textarea id="notes" name="notes">${escapeHTML(record.notes)}</textarea>
          </div>
          <div class="button-row" style="margin-top: 14px;">
            <button type="submit" class="primary-button">${icon("save")}保存记录</button>
            ${state.records[record.date] ? `<button type="button" class="danger-button" data-action="delete-record">${icon("trash")}删除</button>` : ""}
          </div>
        </section>
      </form>
    </main>
  `;
}

function inputField(name, label, value) {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" inputmode="decimal" value="${escapeHTML(value)}" />
    </div>
  `;
}

function renderOtherFoodRows(record) {
  const rows = record.otherFoods || [];
  if (!rows.length) {
    return `<div class="empty-state compact-empty">今天没有额外食物</div>`;
  }
  return `
    <div class="dynamic-list">
      ${rows.map((entry, index) => renderOtherFoodRow(entry, index)).join("")}
    </div>
  `;
}

function renderOtherFoodRow(entry, index) {
  const food = foodByKey(entry.foodKey);
  const unit = food ? displayFoodUnit(food) : "单位";
  return `
    <div class="food-row">
      <div class="field">
        <label for="otherFoodKey_${index}">食物</label>
        <select id="otherFoodKey_${index}" name="otherFoodKey">${foodOptionsHTML(entry.foodKey)}</select>
      </div>
      <div class="field">
        <label for="otherFoodAmount_${index}">数量</label>
        <input id="otherFoodAmount_${index}" name="otherFoodAmount" inputmode="decimal" value="${escapeHTML(entry.amount ?? "")}" placeholder="${escapeHTML(unit)}" />
      </div>
      <div class="field">
        <label for="otherFoodNote_${index}">备注</label>
        <input id="otherFoodNote_${index}" name="otherFoodNote" value="${escapeHTML(entry.note || "")}" />
      </div>
      <button type="button" class="icon-button row-delete" data-remove-other="${index}" title="删除这行" aria-label="删除这行">${icon("trash")}</button>
    </div>
  `;
}

function renderOtherExerciseRows(record) {
  const rows = record.otherExercises || [];
  if (!rows.length) {
    return `<div class="empty-state compact-empty">今天没有额外运动</div>`;
  }
  return `
    <div class="dynamic-list">
      ${rows.map((entry, index) => renderOtherExerciseRow(entry, index)).join("")}
    </div>
  `;
}

function renderOtherExerciseRow(entry, index) {
  const exercise = exerciseByKey(entry.exerciseKey);
  const helper = exercise?.met ? `${fmt(exercise.met, 1)} MET` : "可直接填 kcal";
  return `
    <div class="exercise-row">
      <div class="field">
        <label for="otherExerciseKey_${index}">运动</label>
        <select id="otherExerciseKey_${index}" name="otherExerciseKey">${exerciseOptionsHTML(entry.exerciseKey)}</select>
      </div>
      <div class="field">
        <label for="otherExerciseMinutes_${index}">时长 min</label>
        <input id="otherExerciseMinutes_${index}" name="otherExerciseMinutes" inputmode="decimal" value="${escapeHTML(entry.minutes ?? "")}" placeholder="${escapeHTML(helper)}" />
      </div>
      <div class="field">
        <label for="otherExerciseKcal_${index}">手填 kcal</label>
        <input id="otherExerciseKcal_${index}" name="otherExerciseKcal" inputmode="decimal" value="${escapeHTML(entry.kcal ?? "")}" />
      </div>
      <div class="field">
        <label for="otherExerciseNote_${index}">备注</label>
        <input id="otherExerciseNote_${index}" name="otherExerciseNote" value="${escapeHTML(entry.note || "")}" />
      </div>
      <button type="button" class="icon-button row-delete" data-remove-exercise="${index}" title="删除这行" aria-label="删除这行">${icon("trash")}</button>
    </div>
  `;
}

function renderHistoryScreen() {
  const records = sortedRecords("desc");
  const month = state.historyMonth || localISODate().slice(0, 7);
  const filtered = records.filter((record) => record.date.startsWith(month));
  const list = filtered.length ? filtered : records.slice(0, 30);
  return `
    <main class="screen">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">历史记录</h2>
            <p class="panel-subtitle">${records.length} 条已保存记录</p>
          </div>
          <div class="field" style="min-width: 180px;">
            <label for="historyMonth">月份</label>
            <input id="historyMonth" type="month" value="${escapeHTML(month)}" />
          </div>
        </div>
        ${list.length ? `<div class="history-list">${list.map(renderHistoryItem).join("")}</div>` : `<div class="empty-state">暂无记录</div>`}
      </section>
    </main>
  `;
}

function renderHistoryItem(record) {
  const computed = computeRecord(record);
  const dayType = DAY_TYPES.find((item) => item.value === record.dayType)?.label || record.dayType;
  const netClass = computed.netKcal > 0 ? "warning" : "positive";
  return `
    <article class="history-item">
      <div class="history-main">
        <h3 class="history-title">${formatDate(record.date)} ${zhWeekday(record.date)} · ${escapeHTML(dayType)}</h3>
        <div class="history-meta">
          <span>摄入 ${fmt(computed.intakeKcal)} kcal</span>
          <span>消耗 ${fmt(computed.totalBurn)} kcal</span>
          <span class="${netClass}">净 ${fmt(computed.netKcal)} kcal</span>
          <span>体重 ${numberValue(record.weightKg, 0) ? `${fmt(record.weightKg, 1)} kg` : "-"}</span>
        </div>
      </div>
      <div class="history-actions">
        <button class="icon-button" data-open-record="${record.date}" title="编辑" aria-label="编辑">${icon("edit")}</button>
        <button class="icon-button" data-delete-date="${record.date}" title="删除" aria-label="删除">${icon("trash")}</button>
      </div>
    </article>
  `;
}

function renderSettingsScreen() {
  return `
    <main class="screen">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">个人参数</h2>
            <p class="panel-subtitle">这些值会影响消耗和目标估算</p>
          </div>
          <button form="settingsForm" class="primary-button">${icon("save")}保存</button>
        </div>
        <form id="settingsForm" class="form-grid">
          ${settingsInput("heightCm", "身高 cm")}
          ${settingsInput("bmrKcal", "基础代谢 BMR kcal")}
          ${settingsInput("currentWeightKg", "当前体重 kg")}
          ${settingsInput("targetWeightKg", "目标体重 kg")}
          ${settingsInput("normalTargetKcal", "普通日目标 kcal")}
          ${settingsInput("runTargetKcal", "跑步日目标 kcal")}
          ${settingsInput("badmintonTargetKcal", "羽毛球日目标 kcal")}
        </form>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">运动库</h2>
            <p class="panel-subtitle">MET 越高，同样体重和时长下估算消耗越高</p>
          </div>
          <div class="button-row">
            <button class="text-button" data-action="save-exercises">${icon("save")}保存运动库</button>
            <button class="ghost-button" data-action="reset-exercises">${icon("reset")}恢复默认</button>
          </div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table compact-table">
            <thead>
              <tr>
                <th>运动</th><th>MET</th><th>类别</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${state.exercises
                .map(
                  (item, index) => `
                    <tr>
                      <td><input data-exercise="${index}" data-prop="name" value="${escapeHTML(item.name)}" aria-label="运动名称" /></td>
                      <td><input inputmode="decimal" data-exercise="${index}" data-prop="met" value="${escapeHTML(item.met)}" aria-label="${escapeHTML(item.name)} MET" /></td>
                      <td><input data-exercise="${index}" data-prop="category" value="${escapeHTML(item.category)}" aria-label="${escapeHTML(item.name)}类别" /></td>
                      <td>
                        ${
                          item.custom
                            ? `<button type="button" class="icon-button table-action" data-delete-exercise="${index}" title="删除运动" aria-label="删除运动">${icon("trash")}</button>`
                            : `<span class="status-pill">默认</span>`
                        }
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <form id="addExerciseForm" class="form-grid add-food-form">
          <div class="field">
            <label for="newExerciseName">新运动</label>
            <input id="newExerciseName" name="name" placeholder="例如 爬楼" />
          </div>
          <div class="field">
            <label for="newExerciseMet">MET</label>
            <input id="newExerciseMet" name="met" inputmode="decimal" value="4" />
          </div>
          <div class="field">
            <label for="newExerciseCategory">类别</label>
            <input id="newExerciseCategory" name="category" value="其他" />
          </div>
          <div class="field">
            <label>&nbsp;</label>
            <button class="primary-button" type="submit">${icon("plus")}添加到运动库</button>
          </div>
        </form>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">食品库</h2>
            <p class="panel-subtitle">来自你的 Excel 模板，可按包装标签调整，也可自动补全缺失营养数据</p>
          </div>
          <div class="button-row">
            <button class="text-button" data-action="save-foods">${icon("save")}保存食品库</button>
            <button class="ghost-button" data-action="reset-foods">${icon("reset")}恢复默认</button>
          </div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>食物</th><th>基准</th><th>单位</th><th>热量</th><th>蛋白质</th><th>脂肪</th><th>碳水</th><th>类别</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${state.foods
                .map(
                  (item, index) => `
                    <tr>
                      <td><input data-food="${index}" data-prop="name" value="${escapeHTML(item.name)}" aria-label="食物名称" /></td>
                      <td><input inputmode="decimal" data-food="${index}" data-prop="baseAmount" value="${escapeHTML(item.baseAmount)}" aria-label="${escapeHTML(item.name)}基准数量" /></td>
                      <td><input data-food="${index}" data-prop="unitLabel" value="${escapeHTML(item.unitLabel)}" aria-label="${escapeHTML(item.name)}单位" /></td>
                      <td><input inputmode="decimal" data-food="${index}" data-prop="kcal" value="${escapeHTML(item.kcal)}" aria-label="${escapeHTML(item.name)}热量" /></td>
                      <td><input inputmode="decimal" data-food="${index}" data-prop="protein" value="${escapeHTML(item.protein)}" aria-label="${escapeHTML(item.name)}蛋白质" /></td>
                      <td><input inputmode="decimal" data-food="${index}" data-prop="fat" value="${escapeHTML(item.fat)}" aria-label="${escapeHTML(item.name)}脂肪" /></td>
                      <td><input inputmode="decimal" data-food="${index}" data-prop="carb" value="${escapeHTML(item.carb)}" aria-label="${escapeHTML(item.name)}碳水" /></td>
                      <td><input data-food="${index}" data-prop="category" value="${escapeHTML(item.category)}" aria-label="${escapeHTML(item.name)}类别" /></td>
                      <td>
                        ${
                          item.custom
                            ? `<button type="button" class="icon-button table-action" data-delete-food="${index}" title="删除食品" aria-label="删除食品">${icon("trash")}</button>`
                            : `<span class="status-pill">默认</span>`
                        }
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <form id="addFoodForm" class="form-grid add-food-form">
          <div class="field">
            <label for="newFoodName">新食品</label>
            <input id="newFoodName" name="name" placeholder="例如 西红柿" value="${escapeHTML(foodLookupFormValue("name", ""))}" />
          </div>
          <div class="field">
            <label for="newFoodBase">基准数量</label>
            <input id="newFoodBase" name="baseAmount" inputmode="decimal" value="${escapeHTML(foodLookupFormValue("baseAmount", 100))}" />
          </div>
          <div class="field">
            <label for="newFoodUnit">单位</label>
            <input id="newFoodUnit" name="unitLabel" value="${escapeHTML(foodLookupFormValue("unitLabel", "g"))}" />
          </div>
          <div class="field">
            <label for="newFoodKcal">热量 kcal</label>
            <input id="newFoodKcal" name="kcal" inputmode="decimal" value="${escapeHTML(foodLookupFormValue("kcal", ""))}" />
          </div>
          <div class="field">
            <label for="newFoodProtein">蛋白质 g</label>
            <input id="newFoodProtein" name="protein" inputmode="decimal" value="${escapeHTML(foodLookupFormValue("protein", 0))}" />
          </div>
          <div class="field">
            <label for="newFoodFat">脂肪 g</label>
            <input id="newFoodFat" name="fat" inputmode="decimal" value="${escapeHTML(foodLookupFormValue("fat", 0))}" />
          </div>
          <div class="field">
            <label for="newFoodCarb">碳水 g</label>
            <input id="newFoodCarb" name="carb" inputmode="decimal" value="${escapeHTML(foodLookupFormValue("carb", 0))}" />
          </div>
          <div class="field">
            <label for="newFoodCategory">类别</label>
            <input id="newFoodCategory" name="category" value="${escapeHTML(foodLookupFormValue("category", "其他"))}" />
          </div>
          <div class="field full">
            <div class="button-row add-food-actions">
              <button class="text-button" type="button" data-action="lookup-food" ${foodLookupState.status === "loading" ? "disabled" : ""}>${icon("search")}自动补全</button>
              <button class="primary-button" type="submit" ${foodLookupState.status === "loading" ? "disabled" : ""}>${icon("plus")}添加到食品库</button>
            </div>
          </div>
        </form>
        ${renderFoodLookupPanel()}
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">数据与云同步</h2>
            <p class="panel-subtitle">本地可离线使用，Supabase 可选开启跨设备同步</p>
          </div>
          <span class="status-pill ${state.cloud.accessToken ? "online" : "offline"}"><span class="status-dot"></span>${state.cloud.accessToken ? "已登录" : "本地模式"}</span>
        </div>
        <div class="button-row" style="margin-bottom: 14px;">
          <button class="text-button" data-action="export-json">${icon("download")}导出备份</button>
          <label class="text-button" for="importFile">${icon("upload")}导入备份</label>
          <input id="importFile" class="sr-only" type="file" accept="application/json" />
        </div>
        <form id="cloudForm" class="form-grid">
          <div class="field full">
            <label for="supabaseUrl">Supabase URL</label>
            <input id="supabaseUrl" name="supabaseUrl" value="${escapeHTML(state.cloud.supabaseUrl)}" placeholder="https://xxxx.supabase.co" />
          </div>
          <div class="field full">
            <label for="anonKey">Anon Key</label>
            <input id="anonKey" name="anonKey" value="${escapeHTML(state.cloud.anonKey)}" />
          </div>
          <div class="field">
            <label for="cloudEmail">邮箱</label>
            <input id="cloudEmail" name="email" type="email" value="${escapeHTML(state.cloud.email)}" />
          </div>
          <div class="field">
            <label for="cloudPassword">密码</label>
            <input id="cloudPassword" name="password" type="password" autocomplete="current-password" />
          </div>
          <div class="field full">
            <div class="button-row">
              <button type="button" class="text-button" data-action="cloud-signup">${icon("cloud")}注册</button>
              <button type="button" class="primary-button" data-action="cloud-login">${icon("cloud")}登录</button>
              <button type="button" class="text-button" data-action="cloud-upload">${icon("upload")}上传</button>
              <button type="button" class="text-button" data-action="cloud-pull">${icon("download")}拉取</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  `;
}

function settingsInput(name, label) {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" inputmode="decimal" value="${escapeHTML(state.settings[name])}" />
    </div>
  `;
}

function foodLookupFormValue(field, fallback) {
  return foodLookupState.formDraft?.[field] ?? fallback;
}

function readAddFoodFormDraft(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    baseAmount: String(data.get("baseAmount") || "100").trim() || "100",
    unitLabel: String(data.get("unitLabel") || "g").trim() || "g",
    kcal: String(data.get("kcal") || "").trim(),
    protein: String(data.get("protein") ?? "0").trim(),
    fat: String(data.get("fat") ?? "0").trim(),
    carb: String(data.get("carb") ?? "0").trim(),
    category: String(data.get("category") || "其他").trim() || "其他",
  };
}

function renderFoodLookupPanel() {
  if (foodLookupState.status === "idle") return "";
  if (foodLookupState.status === "loading") {
    return `
      <div class="lookup-panel">
        <div class="lookup-header">
          <strong>正在补全</strong>
          <span>${escapeHTML(foodLookupState.query)}</span>
        </div>
      </div>
    `;
  }
  if (foodLookupState.status === "empty" || foodLookupState.status === "error") {
    return `
      <div class="lookup-panel">
        <div class="lookup-header">
          <strong>${foodLookupState.status === "empty" ? "未找到候选" : "查询失败"}</strong>
          <span>${escapeHTML(foodLookupState.message)}</span>
        </div>
      </div>
    `;
  }
  return `
    <div class="lookup-panel">
      <div class="lookup-header">
        <strong>候选结果</strong>
        <span>${escapeHTML(foodLookupState.message)}</span>
      </div>
      <div class="lookup-results">
        ${foodLookupState.results.map(renderFoodLookupResult).join("")}
      </div>
    </div>
  `;
}

function renderFoodLookupResult(result, index) {
  const note = result.note ? `<span class="lookup-note">${escapeHTML(result.note)}</span>` : "";
  const basis = `每 ${fmt(result.baseAmount || 100)}${result.unitLabel || "g"}`;
  return `
    <button type="button" class="lookup-result" data-fill-food="${index}">
      <span class="lookup-title">${escapeHTML(result.displayName)}</span>
      <span class="lookup-meta">${escapeHTML(result.sourceLabel)} · ${escapeHTML(result.category || "其他")} · ${escapeHTML(basis)}</span>
      ${note}
      <span class="lookup-macros">
        ${fmt(result.kcal)} kcal
        <span>蛋白 ${fmt(result.protein, 1)}g</span>
        <span>脂肪 ${fmt(result.fat, 1)}g</span>
        <span>碳水 ${fmt(result.carb, 1)}g</span>
      </span>
    </button>
  `;
}

function normalizeLookupText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function foodAliasForName(name) {
  const text = normalizeLookupText(name);
  return FOOD_QUERY_ALIASES.find((item) => item.terms.some((term) => text.includes(term.toLowerCase()) || term.toLowerCase().includes(text)));
}

function translatedFoodQuery(name) {
  const text = normalizeLookupText(name);
  const tokens = [];
  FOOD_QUERY_TRANSLATIONS.forEach(([term, translation]) => {
    if (text.includes(term.toLowerCase())) tokens.push(translation);
  });
  return [...new Set(tokens)].join(" ");
}

function buildFoodSearchQueries(name) {
  const alias = foodAliasForName(name);
  const translated = translatedFoodQuery(name);
  const queries = [alias?.query, translated, name].filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  return [...new Set(queries)];
}

function firstNumeric(...values) {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return NaN;
}

function roundNutrition(value, digits = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const scale = 10 ** digits;
  return Math.round(numeric * scale) / scale;
}

function inferLookupCategory(name, sourceCategory = "") {
  const text = `${name} ${sourceCategory}`.toLowerCase();
  if (/(tomato|cucumber|potato|sweet potato|carrot|broccoli|lettuce|cabbage|mushroom|vegetable|蔬菜|番茄|西红柿|黄瓜|土豆|红薯|胡萝卜|西兰花|白菜|生菜|蘑菇)/.test(text)) return "蔬菜";
  if (/(apple|banana|orange|berry|fruit|水果|苹果|香蕉|橙|莓)/.test(text)) return "水果/碳水";
  if (/(chicken|beef|pork|lamb|shrimp|salmon|tuna|fish|meat|poultry|肉|鸡|牛|猪|羊|虾|鱼)/.test(text)) return "肉类";
  if (/(egg|蛋)/.test(text)) return "蛋白/脂肪";
  if (/(milk|yogurt|cheese|dairy|乳|酸奶|牛奶|奶酪)/.test(text)) return "乳制品";
  if (/(rice|oat|bread|noodle|pasta|grain|cereal|米饭|燕麦|面|谷物|饭团)/.test(text)) return "主食/谷物";
  return "其他";
}

function hasLookupNutrition(item) {
  return Number.isFinite(item.kcal) && item.kcal > 0;
}

function lookupResultScore(item) {
  const name = item.displayName.toLowerCase();
  let score = 0;
  if (item.source === "local") score += 6;
  if (item.source === "estimate") score += item.confidence === "low" ? -8 : 5;
  if (/tomatoes, red, ripe, raw|tomatoes, raw/.test(name)) score += 8;
  if (/\braw\b|生/.test(name)) score += 4;
  if (/foundation/i.test(item.sourceType)) score += 3;
  if (/sr legacy/i.test(item.sourceType)) score += 2;
  if (/survey/i.test(item.sourceType)) score += 1;
  if (/grape|cherry|green|orange|yellow/.test(name)) score -= 2;
  if (/sauce|soup|powder|dried|fried|canned|sweetened|加糖|酱|汤|粉|油炸/.test(name)) score -= 3;
  return score;
}

function resetFoodLookupState() {
  foodLookupState = {
    status: "idle",
    query: "",
    message: "",
    results: [],
    formDraft: null,
  };
}

function showFoodLookupCandidates(name, results, form, message) {
  foodLookupState = {
    status: results.length ? "ready" : "empty",
    query: name,
    message: message || (results.length ? `找到 ${results.length} 个候选，点击一条填入表单` : "可以换个更具体的名字，或手动填写营养数据"),
    results,
    formDraft: readAddFoodFormDraft(form),
  };
  render();
}

function dedupeFoodLookupResults(results) {
  const seen = new Set();
  return results.filter((item) => {
    const key = item.sourceId || `${item.displayName}-${item.kcal}-${item.protein}-${item.fat}-${item.carb}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchJSONWithTimeout(url, options = {}, timeoutMs = 4500) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`请求失败 ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

function usdaNutrientValue(food, nutrientIds) {
  const nutrients = food.foodNutrients || [];
  const hit = nutrients.find((nutrient) => nutrientIds.includes(String(nutrient.nutrientId)) || nutrientIds.includes(String(nutrient.nutrientNumber)));
  return firstNumeric(hit?.value);
}

function usdaFoodToLookup(food) {
  const displayName = String(food.description || "").trim();
  const category = inferLookupCategory(displayName, food.foodCategory);
  return {
    source: "usda",
    sourceId: `usda:${food.fdcId}`,
    sourceType: food.dataType || "",
    sourceLabel: food.dataType ? `USDA ${food.dataType}` : "USDA",
    displayName,
    category,
    baseAmount: 100,
    unitLabel: "g",
    kcal: Math.round(usdaNutrientValue(food, ["1008"])),
    protein: roundNutrition(usdaNutrientValue(food, ["1003"])),
    fat: roundNutrition(usdaNutrientValue(food, ["1004"])),
    carb: roundNutrition(usdaNutrientValue(food, ["1005"])),
  };
}

async function searchUsdaFoods(query) {
  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
  url.searchParams.set("api_key", "DEMO_KEY");
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "8");
  ["Foundation", "SR Legacy", "Survey (FNDDS)"].forEach((dataType) => url.searchParams.append("dataType", dataType));
  const payload = await fetchJSONWithTimeout(url.toString(), { method: "GET" });
  return (payload.foods || []).map(usdaFoodToLookup).filter(hasLookupNutrition);
}

function openFoodFactsToLookup(product) {
  const nutriments = product.nutriments || {};
  const displayName = String(product.product_name_zh || product.product_name || product.product_name_en || product.generic_name || "未命名食品").trim();
  const category = inferLookupCategory(displayName, product.categories);
  const energyKcal = firstNumeric(nutriments["energy-kcal_100g"], nutriments["energy-kcal"], nutriments.energy_100g / 4.184);
  return {
    source: "openfoodfacts",
    sourceId: `off:${product.code || displayName}`,
    sourceType: "Open Food Facts",
    sourceLabel: "Open Food Facts",
    displayName: product.brands ? `${displayName} · ${product.brands}` : displayName,
    category,
    baseAmount: 100,
    unitLabel: "g",
    kcal: Math.round(energyKcal),
    protein: roundNutrition(firstNumeric(nutriments.proteins_100g, nutriments.proteins)),
    fat: roundNutrition(firstNumeric(nutriments.fat_100g, nutriments.fat)),
    carb: roundNutrition(firstNumeric(nutriments.carbohydrates_100g, nutriments.carbohydrates)),
  };
}

async function searchOpenFoodFacts(query) {
  const url = new URL("https://world.openfoodfacts.org/api/v2/search");
  url.searchParams.set("search_terms", query);
  url.searchParams.set("page_size", "8");
  url.searchParams.set("fields", "code,product_name,product_name_en,product_name_zh,generic_name,brands,categories,nutriments");
  const payload = await fetchJSONWithTimeout(url.toString(), { method: "GET" });
  return (payload.products || []).map(openFoodFactsToLookup).filter(hasLookupNutrition);
}

function searchLocalFoods(name) {
  const text = normalizeLookupText(name);
  const packagedMatches = PACKAGED_FOOD_ESTIMATES.filter((item) => item.terms.some((term) => text.includes(term.toLowerCase()))).map((item) => ({
    source: "estimate",
    sourceId: `estimate:${item.terms[0]}`,
    sourceType: "关键词估算",
    sourceLabel: "关键词估算",
    displayName: item.displayName,
    category: item.category,
    baseAmount: item.baseAmount || 100,
    unitLabel: item.unitLabel || "g",
    kcal: item.kcal,
    protein: item.protein,
    fat: item.fat,
    carb: item.carb,
    confidence: item.confidence || "medium",
    note: item.note || "估算值，不同品牌差异较大，建议按包装营养表校正",
  }));

  if (packagedMatches.length) return packagedMatches;

  return LOCAL_FOOD_NUTRITION.filter((item) => item.terms.some((term) => text.includes(term.toLowerCase()) || term.toLowerCase().includes(text))).map((item) => ({
    source: "local",
    sourceId: `local:${item.terms[0]}`,
    sourceType: "内置常见食材",
    sourceLabel: "内置常见食材",
    displayName: item.displayName,
    category: item.category,
    baseAmount: 100,
    unitLabel: "g",
    kcal: item.kcal,
    protein: item.protein,
    fat: item.fat,
    carb: item.carb,
    confidence: item.confidence || "high",
  }));
}

function genericPackagedEstimate(name) {
  return {
    source: "estimate",
    sourceId: `estimate:generic:${normalizeLookupText(name)}`,
    sourceType: "低置信估算",
    sourceLabel: "低置信估算",
    displayName: GENERIC_PACKAGED_ESTIMATE.displayName,
    category: GENERIC_PACKAGED_ESTIMATE.category,
    baseAmount: 100,
    unitLabel: "g",
    kcal: GENERIC_PACKAGED_ESTIMATE.kcal,
    protein: GENERIC_PACKAGED_ESTIMATE.protein,
    fat: GENERIC_PACKAGED_ESTIMATE.fat,
    carb: GENERIC_PACKAGED_ESTIMATE.carb,
    confidence: GENERIC_PACKAGED_ESTIMATE.confidence,
    note: "没有识别出具体类别，仅用于临时占位，请优先按包装营养表修改",
  };
}

async function fetchFoodNutritionCandidates(name) {
  const cacheKey = normalizeLookupText(name);
  if (foodLookupCache.has(cacheKey)) {
    return foodLookupCache.get(cacheKey).map((item) => ({ ...item }));
  }

  const queries = buildFoodSearchQueries(name);
  const localResults = searchLocalFoods(name);
  if (localResults.length) {
    const candidates = dedupeFoodLookupResults(localResults)
      .sort((left, right) => lookupResultScore(right) - lookupResultScore(left))
      .slice(0, 6);
    foodLookupCache.set(cacheKey, candidates);
    return candidates.map((item) => ({ ...item }));
  }

  const results = [];
  const errors = [];

  const onlineSearches = queries.flatMap((query) => [searchUsdaFoods(query), searchOpenFoodFacts(query)]);
  const settled = await Promise.allSettled(onlineSearches);
  settled.forEach((item) => {
    if (item.status === "fulfilled") {
      results.push(...item.value);
    } else {
      errors.push(item.reason);
    }
  });

  const candidates = dedupeFoodLookupResults(results)
    .sort((left, right) => lookupResultScore(right) - lookupResultScore(left))
    .slice(0, 6);

  if (!candidates.length && errors.length) {
    const fallback = genericPackagedEstimate(name);
    foodLookupCache.set(cacheKey, [fallback]);
    return [{ ...fallback }];
  }

  const finalCandidates = candidates.length ? candidates : [genericPackagedEstimate(name)];
  foodLookupCache.set(cacheKey, finalCandidates);
  return finalCandidates.map((item) => ({ ...item }));
}

function addFoodDataLooksIncomplete(data) {
  const kcal = String(data.get("kcal") || "").trim();
  const protein = String(data.get("protein") ?? "").trim();
  const fat = String(data.get("fat") ?? "").trim();
  const carb = String(data.get("carb") ?? "").trim();
  const macrosProvided = [protein, fat, carb].some((value) => value !== "" && Number(value) !== 0);
  return !kcal || !macrosProvided;
}

function valueOrLookup(data, field, lookupValue, treatZeroAsBlank = false) {
  const raw = String(data.get(field) ?? "").trim();
  if (!raw || (treatZeroAsBlank && Number(raw) === 0)) return lookupValue;
  return numberValue(raw, lookupValue);
}

function foodLookupErrorMessage(error) {
  if (error.name === "AbortError") return "查询超时，可以稍后再试或手动填写";
  if (/Failed to fetch|CORS|请求失败 429|请求失败 503/i.test(error.message)) return "在线数据源暂时不可用，可以手动填写营养数据";
  return error.message || "查询失败，可以手动填写营养数据";
}

async function lookupFoodNutrition() {
  const form = document.getElementById("addFoodForm");
  if (!form) return;
  const draft = readAddFoodFormDraft(form);
  if (!draft.name) {
    showToast("请先填写食品名称");
    return;
  }

  foodLookupState = {
    status: "loading",
    query: draft.name,
    message: "",
    results: [],
    formDraft: draft,
  };
  render();

  try {
    const results = await fetchFoodNutritionCandidates(draft.name);
    foodLookupState = {
      status: results.length ? "ready" : "empty",
      query: draft.name,
      message: results.length ? `找到 ${results.length} 个候选，点击一条填入表单` : "可以换个更具体的名字，或手动填写营养数据",
      results,
      formDraft: draft,
    };
    render();
  } catch (error) {
    foodLookupState = {
      status: "error",
      query: draft.name,
      message: foodLookupErrorMessage(error),
      results: [],
      formDraft: draft,
    };
    render();
  }
}

function fillFoodFormFromLookup(index) {
  const result = foodLookupState.results[index];
  const form = document.getElementById("addFoodForm");
  if (!result || !form) return;
  const setValue = (name, value) => {
    const input = form.elements[name];
    if (input) input.value = value;
  };
  if (!String(form.elements.name?.value || "").trim()) setValue("name", result.displayName);
  setValue("baseAmount", result.baseAmount);
  setValue("unitLabel", result.unitLabel);
  setValue("kcal", result.kcal);
  setValue("protein", result.protein);
  setValue("fat", result.fat);
  setValue("carb", result.carb);
  if (!String(form.elements.category?.value || "").trim() || form.elements.category.value === "其他") {
    setValue("category", result.category || "其他");
  }
  foodLookupState.formDraft = readAddFoodFormDraft(form);
  showToast("营养数据已填入，可以继续调整后添加");
}

function bindCurrentScreen() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-open-record]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDate = button.dataset.openRecord;
      state.activeTab = "record";
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-delete-date]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord(button.dataset.deleteDate));
  });

  document.querySelectorAll("[data-remove-other]").forEach((button) => {
    button.addEventListener("click", () => removeOtherFood(Number(button.dataset.removeOther)));
  });

  document.querySelectorAll("[data-remove-exercise]").forEach((button) => {
    button.addEventListener("click", () => removeOtherExercise(Number(button.dataset.removeExercise)));
  });

  document.querySelectorAll("[data-delete-food]").forEach((button) => {
    button.addEventListener("click", () => deleteFood(Number(button.dataset.deleteFood)));
  });

  document.querySelectorAll("[data-delete-exercise]").forEach((button) => {
    button.addEventListener("click", () => deleteExercise(Number(button.dataset.deleteExercise)));
  });

  document.querySelectorAll("[data-fill-food]").forEach((button) => {
    button.addEventListener("click", () => fillFoodFormFromLookup(Number(button.dataset.fillFood)));
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });

  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.addEventListener("change", () => {
      state.selectedDate = dateInput.value || localISODate();
      draftOverride = null;
      saveState();
      render();
    });
  }

  const recordForm = document.getElementById("recordForm");
  if (recordForm) {
    recordForm.addEventListener("input", renderPreviewDebounced);
    recordForm.addEventListener("change", renderPreviewDebounced);
    recordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveRecordFromForm(recordForm);
    });
  }

  const historyMonth = document.getElementById("historyMonth");
  if (historyMonth) {
    historyMonth.addEventListener("change", () => {
      state.historyMonth = historyMonth.value;
      render();
    });
  }

  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      saveSettings(settingsForm);
    });
  }

  const addFoodForm = document.getElementById("addFoodForm");
  if (addFoodForm) {
    addFoodForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addFoodFromForm(addFoodForm);
    });
  }

  const addExerciseForm = document.getElementById("addExerciseForm");
  if (addExerciseForm) {
    addExerciseForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addExerciseFromForm(addExerciseForm);
    });
  }

  const importFile = document.getElementById("importFile");
  if (importFile) {
    importFile.addEventListener("change", importJSON);
  }
}

let previewTimer = null;
function renderPreviewDebounced(event) {
  if (event.target?.id === "date") return;
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    const form = document.getElementById("recordForm");
    if (!form) return;
    const date = new FormData(form).get("date") || state.selectedDate;
    const draft = formToRecord(form, date);
    const previewTarget = document.querySelector(".summary-strip");
    if (!previewTarget) return;
    const computed = computeRecord(draft);
    previewTarget.innerHTML = `
      ${renderMiniStat("总摄入", `${fmt(computed.intakeKcal)} kcal`)}
      ${renderMiniStat("运动消耗", `${fmt(computed.exerciseKcal)} kcal`)}
      ${renderMiniStat("总消耗", `${fmt(computed.totalBurn)} kcal`)}
      ${renderMiniStat("净热量", `${fmt(computed.netKcal)} kcal`)}
      ${renderMiniStat("蛋白 / 脂肪 / 碳水", `${fmt(computed.protein, 1)} / ${fmt(computed.fat, 1)} / ${fmt(computed.carb, 1)} g`)}
    `;
  }, 90);
}

function formToRecord(form, date) {
  const data = new FormData(form);
  const otherFoodKeys = data.getAll("otherFoodKey");
  const otherFoodAmounts = data.getAll("otherFoodAmount");
  const otherFoodNotes = data.getAll("otherFoodNote");
  const otherExerciseKeys = data.getAll("otherExerciseKey");
  const otherExerciseMinutes = data.getAll("otherExerciseMinutes");
  const otherExerciseKcals = data.getAll("otherExerciseKcal");
  const otherExerciseNotes = data.getAll("otherExerciseNote");
  return {
    date,
    dayType: String(data.get("dayType") || "normal"),
    eggs: numberValue(data.get("eggs")),
    yogurtG: numberValue(data.get("yogurtG")),
    oatmealG: numberValue(data.get("oatmealG")),
    riceServings: numberValue(data.get("riceServings")),
    konjacG: numberValue(data.get("konjacG")),
    vegetablesG: numberValue(data.get("vegetablesG")),
    meatKey: String(data.get("meatKey") || "chickenBreast"),
    meatG: numberValue(data.get("meatG")),
    bananas: numberValue(data.get("bananas")),
    extraKcal: numberValue(data.get("extraKcal")),
    runKm: numberValue(data.get("runKm")),
    walkingMin: numberValue(data.get("walkingMin")),
    strengthMin: numberValue(data.get("strengthMin")),
    burpeeCount: numberValue(data.get("burpeeCount")),
    badmintonHours: numberValue(data.get("badmintonHours")),
    weightKg: data.get("weightKg") === "" ? "" : numberValue(data.get("weightKg")),
    waistCm: data.get("waistCm") === "" ? "" : numberValue(data.get("waistCm")),
    otherFoods: otherFoodKeys
      .map((foodKey, index) => ({
        foodKey: String(foodKey || ""),
        amount: numberValue(otherFoodAmounts[index], 0),
        note: String(otherFoodNotes[index] || ""),
      }))
      .filter((entry) => entry.foodKey && entry.amount > 0),
    otherExercises: otherExerciseKeys
      .map((exerciseKey, index) => ({
        exerciseKey: String(exerciseKey || ""),
        minutes: numberValue(otherExerciseMinutes[index], 0),
        kcal: numberValue(otherExerciseKcals[index], 0),
        note: String(otherExerciseNotes[index] || ""),
      }))
      .filter((entry) => entry.exerciseKey && (entry.minutes > 0 || entry.kcal > 0)),
    notes: String(data.get("notes") || ""),
    updatedAt: new Date().toISOString(),
  };
}

function saveRecordFromForm(form) {
  const date = String(new FormData(form).get("date") || localISODate());
  const record = formToRecord(form, date);
  state.records[date] = record;
  draftOverride = null;
  if (numberValue(record.weightKg, 0) > 0) {
    state.settings.currentWeightKg = numberValue(record.weightKg);
  }
  state.selectedDate = date;
  saveState();
  showToast("记录已保存");
  render();
}

function saveSettings(form) {
  const data = new FormData(form);
  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    state.settings[key] = numberValue(data.get(key), state.settings[key]);
  });
  saveState();
  showToast("参数已保存");
  render();
}

function saveFoodsFromTable() {
  document.querySelectorAll("[data-food][data-prop]").forEach((input) => {
    const index = Number(input.dataset.food);
    const prop = input.dataset.prop;
    if (!state.foods[index]) return;
    if (["kcal", "protein", "fat", "carb", "baseAmount"].includes(prop)) {
      state.foods[index][prop] = numberValue(input.value, 0);
    } else if (["name", "unitLabel", "category"].includes(prop)) {
      state.foods[index][prop] = String(input.value || "").trim();
    }
  });
  state.foods = normalizeFoods(state.foods).map((item) => ({
    ...item,
    unit: `${item.baseAmount}${item.unitLabel}`,
  }));
  saveState();
  showToast("食品库已保存");
  render();
}

async function addFoodFromForm(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  if (!name) {
    showToast("请先填写食品名称");
    return;
  }
  let lookup = null;
  let lookupResults = [];
  if (addFoodDataLooksIncomplete(data)) {
    showToast("正在智能补全营养数据...");
    try {
      const results = await fetchFoodNutritionCandidates(name);
      lookupResults = results;
      lookup = results[0] || null;
      if (lookup?.confidence === "low") {
        showFoodLookupCandidates(name, results, form, "只找到低置信估算，请点击候选确认或手动填写营养数据");
        showToast("只找到低置信估算，请确认后再添加");
        return;
      }
      if (results.length > 1) {
        foodLookupState = {
          status: "ready",
          query: name,
          message: `已用第一条候选添加，另外找到 ${results.length - 1} 个候选`,
          results,
          formDraft: readAddFoodFormDraft(form),
        };
      }
    } catch (error) {
      if (!String(data.get("kcal") || "").trim()) {
        showToast(`${foodLookupErrorMessage(error)}，请手动填写热量后再添加`);
        return;
      }
    }
  }
  if (addFoodDataLooksIncomplete(data) && !lookup && !String(data.get("kcal") || "").trim()) {
    showToast("没有查到营养数据，请手动填写热量后再添加");
    return;
  }
  const rawBaseAmount = String(data.get("baseAmount") || "").trim();
  const rawUnitLabel = String(data.get("unitLabel") || "").trim();
  const baseAmount = numberValue(rawBaseAmount || lookup?.baseAmount, 1) || 1;
  const unitLabel = !rawUnitLabel || (lookup?.unitLabel && rawUnitLabel === "g" && lookup.unitLabel !== "g") ? lookup?.unitLabel || "份" : rawUnitLabel;
  const rawCategory = String(data.get("category") || "").trim();
  const category = !rawCategory || rawCategory === "其他" ? lookup?.category || "其他" : rawCategory;
  const macrosMissing = ["protein", "fat", "carb"].every((field) => {
    const raw = String(data.get(field) ?? "").trim();
    return !raw || Number(raw) === 0;
  });
  state.foods.push(
    normalizeFood({
      key: makeFoodKey(name),
      name,
      baseAmount,
      unitLabel,
      unit: `${baseAmount}${unitLabel}`,
      kcal: valueOrLookup(data, "kcal", lookup?.kcal || 0),
      protein: valueOrLookup(data, "protein", lookup?.protein || 0, macrosMissing),
      fat: valueOrLookup(data, "fat", lookup?.fat || 0, macrosMissing),
      carb: valueOrLookup(data, "carb", lookup?.carb || 0, macrosMissing),
      category,
      custom: true,
    }),
  );
  saveState();
  resetFoodLookupState();
  const extra = lookupResults.length > 1 ? `，另有 ${lookupResults.length - 1} 个候选可参考` : "";
  showToast(lookup ? `新食品已添加，营养数据来自 ${lookup.sourceLabel}${extra}` : "新食品已添加");
  render();
}

function deleteFood(index) {
  const item = state.foods[index];
  if (!item || !item.custom) return;
  const used = sortedRecords("asc").some((record) => (record.otherFoods || []).some((entry) => entry.foodKey === item.key) || record.meatKey === item.key);
  const message = used
    ? `“${item.name}”已经出现在历史记录里，删除后旧记录里这项会按 0 计算。确定删除？`
    : `删除“${item.name}”？`;
  if (!window.confirm(message)) return;
  state.foods.splice(index, 1);
  saveState();
  showToast("食品已删除");
  render();
}

function saveExercisesFromTable() {
  document.querySelectorAll("[data-exercise][data-prop]").forEach((input) => {
    const index = Number(input.dataset.exercise);
    const prop = input.dataset.prop;
    if (!state.exercises[index]) return;
    if (prop === "met") {
      state.exercises[index][prop] = numberValue(input.value, 0);
    } else if (["name", "category"].includes(prop)) {
      state.exercises[index][prop] = String(input.value || "").trim();
    }
  });
  state.exercises = normalizeExercises(state.exercises);
  saveState();
  showToast("运动库已保存");
  render();
}

function addExerciseFromForm(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  if (!name) {
    showToast("请先填写运动名称");
    return;
  }
  state.exercises.push(
    normalizeExercise({
      key: makeExerciseKey(name),
      name,
      met: numberValue(data.get("met"), 0),
      category: String(data.get("category") || "其他").trim() || "其他",
      custom: true,
    }),
  );
  saveState();
  showToast("新运动已添加");
  render();
}

function deleteExercise(index) {
  const item = state.exercises[index];
  if (!item || !item.custom) return;
  const used = sortedRecords("asc").some((record) => (record.otherExercises || []).some((entry) => entry.exerciseKey === item.key));
  const message = used
    ? `“${item.name}”已经出现在历史记录里，删除后旧记录里这项会按 0 计算。确定删除？`
    : `删除“${item.name}”？`;
  if (!window.confirm(message)) return;
  state.exercises.splice(index, 1);
  saveState();
  showToast("运动已删除");
  render();
}

function deleteRecord(date = state.selectedDate) {
  if (!state.records[date]) return;
  const ok = window.confirm(`删除 ${formatDate(date)} 的记录？`);
  if (!ok) return;
  delete state.records[date];
  saveState();
  showToast("记录已删除");
  render();
}

function currentRecordDraft() {
  const form = document.getElementById("recordForm");
  if (!form) return getRecord(state.selectedDate);
  const date = String(new FormData(form).get("date") || state.selectedDate);
  state.selectedDate = date;
  return formToRecord(form, date);
}

function addOtherFood() {
  const draft = currentRecordDraft();
  const defaultFood = state.foods.find((item) => item.key !== "egg") || state.foods[0];
  draft.otherFoods = [...(draft.otherFoods || []), { foodKey: defaultFood?.key || "", amount: "", note: "" }];
  draftOverride = draft;
  saveState();
  render();
}

function removeOtherFood(index) {
  const draft = currentRecordDraft();
  draft.otherFoods = (draft.otherFoods || []).filter((_, itemIndex) => itemIndex !== index);
  draftOverride = draft;
  saveState();
  render();
}

function addOtherExercise() {
  const draft = currentRecordDraft();
  const defaultExercise = state.exercises.find((item) => item.key !== "manualBurn") || state.exercises[0];
  draft.otherExercises = [...(draft.otherExercises || []), { exerciseKey: defaultExercise?.key || "", minutes: "", kcal: "", note: "" }];
  draftOverride = draft;
  saveState();
  render();
}

function removeOtherExercise(index) {
  const draft = currentRecordDraft();
  draft.otherExercises = (draft.otherExercises || []).filter((_, itemIndex) => itemIndex !== index);
  draftOverride = draft;
  saveState();
  render();
}

function handleAction(action) {
  if (action === "apply-default") {
    draftOverride = defaultRecordForDate(state.selectedDate);
    showToast("已套用默认日程");
    render();
  }
  if (action === "delete-record") deleteRecord(state.selectedDate);
  if (action === "add-other-food") addOtherFood();
  if (action === "add-other-exercise") addOtherExercise();
  if (action === "lookup-food") lookupFoodNutrition();
  if (action === "save-foods") saveFoodsFromTable();
  if (action === "save-exercises") saveExercisesFromTable();
  if (action === "reset-foods") {
    if (!window.confirm("恢复默认会删除你新增的食品，并重置食品库营养值。确定继续？")) return;
    state.foods = structuredCloneSafe(DEFAULT_FOODS);
    state.foods = normalizeFoods(state.foods);
    saveState();
    showToast("食品库已恢复");
    render();
  }
  if (action === "reset-exercises") {
    if (!window.confirm("恢复默认会删除你新增的运动，并重置运动库 MET。确定继续？")) return;
    state.exercises = normalizeExercises(DEFAULT_EXERCISES);
    saveState();
    showToast("运动库已恢复");
    render();
  }
  if (action === "export-json") exportJSON();
  if (action === "install-app") installApp();
  if (action === "cloud-signup") cloudSignup();
  if (action === "cloud-login") cloudLogin();
  if (action === "cloud-upload") cloudUpload();
  if (action === "cloud-pull") cloudPull();
}

function exportJSON() {
  const backup = {
    exportedAt: new Date().toISOString(),
    app: "health-record-pwa",
    data: {
      settings: state.settings,
      foods: state.foods,
      exercises: state.exercises,
      records: state.records,
    },
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `health-record-backup-${localISODate()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const data = parsed.data || parsed;
    if (!data.records || !data.settings) throw new Error("invalid backup");
    state.settings = { ...state.settings, ...data.settings };
    state.foods = Array.isArray(data.foods) ? normalizeFoods(data.foods) : state.foods;
    state.exercises = Array.isArray(data.exercises) ? normalizeExercises(data.exercises) : state.exercises;
    state.records = data.records;
    saveState();
    showToast("备份已导入");
    render();
  } catch {
    showToast("导入失败：文件格式不正确");
  }
}

async function installApp() {
  if (!installPrompt) {
    showToast("当前浏览器会在地址栏或分享菜单提供安装入口");
    return;
  }
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
}

function getCloudFormValues() {
  const form = document.getElementById("cloudForm");
  const data = new FormData(form);
  const supabaseUrl = String(data.get("supabaseUrl") || "").replace(/\/$/, "");
  const anonKey = String(data.get("anonKey") || "");
  const email = String(data.get("email") || "");
  const password = String(data.get("password") || "");
  Object.assign(state.cloud, { supabaseUrl, anonKey, email });
  saveState();
  if (!supabaseUrl || !anonKey || !email || !password) {
    throw new Error("请先填写 Supabase URL、Anon Key、邮箱和密码");
  }
  return { supabaseUrl, anonKey, email, password };
}

async function cloudFetch(path, options = {}) {
  const { supabaseUrl, anonKey, accessToken } = state.cloud;
  if (!supabaseUrl || !anonKey) throw new Error("Supabase 尚未配置");
  const headers = {
    apikey: anonKey,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${supabaseUrl}${path}`, { ...options, headers });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(payload?.msg || payload?.message || `请求失败 ${response.status}`);
  }
  return payload;
}

async function cloudSignup() {
  try {
    const { supabaseUrl, anonKey, email, password } = getCloudFormValues();
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.msg || payload.message || "注册失败");
    showToast("注册完成，请按 Supabase 邮件设置确认策略");
  } catch (error) {
    showToast(error.message);
  }
}

async function cloudLogin() {
  try {
    const { supabaseUrl, anonKey, email, password } = getCloudFormValues();
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.msg || payload.message || "登录失败");
    Object.assign(state.cloud, {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      userId: payload.user?.id || "",
    });
    saveState();
    showToast("云同步已登录");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

async function cloudUpload() {
  try {
    if (!state.cloud.accessToken || !state.cloud.userId) throw new Error("请先登录云同步");
    await cloudFetch("/rest/v1/health_app_state?on_conflict=user_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        user_id: state.cloud.userId,
        data: {
          settings: state.settings,
          foods: state.foods,
          exercises: state.exercises,
          records: state.records,
        },
        updated_at: new Date().toISOString(),
      }),
    });
    state.cloud.lastSyncAt = new Date().toISOString();
    saveState();
    showToast("已上传到 Supabase");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

async function cloudPull() {
  try {
    if (!state.cloud.accessToken || !state.cloud.userId) throw new Error("请先登录云同步");
    const rows = await cloudFetch(`/rest/v1/health_app_state?select=data&user_id=eq.${encodeURIComponent(state.cloud.userId)}`);
    const data = rows?.[0]?.data;
    if (!data) throw new Error("云端暂无数据，可先上传一次");
    state.settings = { ...state.settings, ...(data.settings || {}) };
    state.foods = Array.isArray(data.foods) ? normalizeFoods(data.foods) : state.foods;
    state.exercises = Array.isArray(data.exercises) ? normalizeExercises(data.exercises) : state.exercises;
    state.records = data.records || state.records;
    state.cloud.lastSyncAt = new Date().toISOString();
    saveState();
    showToast("已从 Supabase 拉取");
    render();
  } catch (error) {
    showToast(error.message);
  }
}

function drawCharts() {
  if (state.activeTab !== "dashboard") return;
  drawEnergyChart();
  drawWeightChart();
  drawMacroChart();
}

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width * ratio));
  canvas.height = Math.max(220, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  return { canvas, ctx, width: canvas.width / ratio, height: canvas.height / ratio };
}

function drawEmpty(ctx, width, height, text) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#657267";
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);
}

function drawEnergyChart() {
  const setup = setupCanvas("energyChart");
  if (!setup) return;
  const { ctx, width, height } = setup;
  const records = sortedRecords("asc").slice(-14);
  if (!records.length) return drawEmpty(ctx, width, height, "暂无记录");
  const labels = records.map((record) => record.date.slice(5));
  const intake = records.map((record) => computeRecord(record).intakeKcal);
  const burn = records.map((record) => computeRecord(record).totalBurn);
  const net = records.map((record) => computeRecord(record).netKcal);
  drawMultiLine(ctx, width, height, labels, [
    { label: "摄入", color: "#2f7d62", values: intake },
    { label: "消耗", color: "#d77843", values: burn },
    { label: "净热量", color: "#4f67b1", values: net },
  ]);
}

function drawWeightChart() {
  const setup = setupCanvas("weightChart");
  if (!setup) return;
  const { ctx, width, height } = setup;
  const records = sortedRecords("asc").filter((record) => numberValue(record.weightKg, 0) > 0).slice(-30);
  if (!records.length) return drawEmpty(ctx, width, height, "暂无体重记录");
  const labels = records.map((record) => record.date.slice(5));
  const weights = records.map((record) => numberValue(record.weightKg));
  const rolling = records.map((record) => {
    const nearby = dateRangeRecords(record.date, 7).map((item) => numberValue(item.weightKg, NaN));
    return average(nearby);
  });
  drawMultiLine(ctx, width, height, labels, [
    { label: "体重", color: "#4f67b1", values: weights },
    { label: "7日均重", color: "#2f7d62", values: rolling },
  ]);
}

function drawMacroChart() {
  const setup = setupCanvas("macroChart");
  if (!setup) return;
  const { ctx, width, height } = setup;
  const latest = dashboardSummary().latest;
  if (!latest) return drawEmpty(ctx, width, height, "暂无记录");
  const computed = computeRecord(latest);
  drawBars(ctx, width, height, [
    { label: "蛋白质", color: "#2f7d62", value: computed.protein },
    { label: "脂肪", color: "#d77843", value: computed.fat },
    { label: "碳水", color: "#4f67b1", value: computed.carb },
  ]);
}

function drawMultiLine(ctx, width, height, labels, series) {
  const pad = { top: 28, right: 18, bottom: 42, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const values = series.flatMap((item) => item.values).filter((value) => Number.isFinite(value));
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 100;
    max += 100;
  }
  const span = max - min;
  min -= span * 0.12;
  max += span * 0.12;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#d9e0da";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#657267";
  ctx.font = "12px system-ui, sans-serif";

  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    const value = max - ((max - min) / 4) * i;
    ctx.fillText(fmt(value), 6, y + 4);
  }

  const xFor = (index) => pad.left + (labels.length === 1 ? plotW / 2 : (plotW / (labels.length - 1)) * index);
  const yFor = (value) => pad.top + ((max - value) / (max - min)) * plotH;

  series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    item.values.forEach((value, index) => {
      const x = xFor(index);
      const y = yFor(value);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = item.color;
    item.values.forEach((value, index) => {
      const x = xFor(index);
      const y = yFor(value);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  ctx.fillStyle = "#657267";
  labels.forEach((label, index) => {
    if (index % Math.ceil(labels.length / 5) !== 0 && index !== labels.length - 1) return;
    ctx.fillText(label, xFor(index) - 14, height - 16);
  });

  let legendX = pad.left;
  series.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, 8, 12, 3);
    ctx.fillStyle = "#1d231f";
    ctx.fillText(item.label, legendX + 17, 12);
    legendX += 78;
  });
}

function drawBars(ctx, width, height, bars) {
  const pad = { top: 28, right: 22, bottom: 42, left: 34 };
  const max = Math.max(...bars.map((item) => item.value), 10) * 1.18;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const barW = Math.min(86, plotW / bars.length * 0.52);
  const gap = (plotW - barW * bars.length) / Math.max(1, bars.length - 1);

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#d9e0da";
  ctx.fillStyle = "#657267";
  ctx.font = "12px system-ui, sans-serif";

  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
  }

  bars.forEach((bar, index) => {
    const x = pad.left + (barW + gap) * index;
    const barH = (bar.value / max) * plotH;
    const y = pad.top + plotH - barH;
    ctx.fillStyle = bar.color;
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = "#1d231f";
    ctx.textAlign = "center";
    ctx.fillText(`${fmt(bar.value, 1)}g`, x + barW / 2, y - 8);
    ctx.fillStyle = "#657267";
    ctx.fillText(bar.label, x + barW / 2, height - 16);
  });
  ctx.textAlign = "left";
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
});

window.addEventListener("resize", () => {
  requestAnimationFrame(drawCharts);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

render();
