import { format, parseISO, isValid, parse } from 'date-fns'

// Small helper to normalize the date time input. Will need to check if I need to validate the rest of the pages.
export function normalizeLocalDateTime(input: string | Date | undefined | null): Date | null {
    if (!input) return null
    if (input instanceof Date) return isValid(input) ? input : null

    const value = String(input)
    try {
        if (value.includes('T') && !value.includes('Z') && !value.includes('+')) {
            const pattern = value.length > 16 ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"
            const parsed = parse(value, pattern, new Date())
            return isValid(parsed) ? parsed : null
        }
        if (value.includes(' ') && value.length >= 19) {
            const parsed = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date())
            return isValid(parsed) ? parsed : null
        }
        const parsed = parseISO(value)
        return isValid(parsed) ? parsed : null
    } catch {
        return null
    }
}

export function formatForApi(input: string | Date): string {
    const date = normalizeLocalDateTime(input)
    if (!date) return ''
    return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export function formatForInput(input: string | Date): string {
    const date = normalizeLocalDateTime(input)
    if (!date) return ''
    return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}


