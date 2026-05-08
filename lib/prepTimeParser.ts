export function parsePrepTime(prepTimeStr: string | undefined): number {
  if (!prepTimeStr) return 0;

  const timeStr = prepTimeStr.trim().toLowerCase();

  const match = timeStr.match(/(\d+)\s*-?\s*(\d+)?\s*(mins?|minutes?)/);
  if (match) {
    const firstNum = parseInt(match[1], 10);
    const secondNum = match[2] ? parseInt(match[2], 10) : firstNum;
    return Math.ceil((firstNum + secondNum) / 2);
  }

  const singleMatch = timeStr.match(/(\d+)\s*(mins?|minutes?)/);
  if (singleMatch) {
    return parseInt(singleMatch[1], 10);
  }

  return 0;
}

export function calculateAveragePrepTime(foodItems: Array<{ prepTime?: string }>): number {
  if (!foodItems || foodItems.length === 0) return 0;

  const prepTimes = foodItems
    .map((item) => parsePrepTime(item.prepTime))
    .filter((time) => time > 0);

  if (prepTimes.length === 0) return 0;

  return Math.ceil(prepTimes.reduce((sum, time) => sum + time, 0) / prepTimes.length);
}
