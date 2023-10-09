/**
 * Format given date in format of "YYYY.MM.DD".
 * @param date Date to format.
 * @returns Formatted string.
 */
export function formatDate(date: Date): string {
	const fullMonth = (date.getMonth() + 1).toString().padStart(2, '0');
	const fullDay = (date.getDay() + 1).toString().padStart(2, '0');

	return `${date.getFullYear()}.${fullMonth}.${fullDay}`;
}
