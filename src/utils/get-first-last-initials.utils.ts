/**
 * Extracts first and last name initials from a display name.
 *
 * @param displayName - Full name to extract initials from
 * @returns Uppercase two-letter initials (e.g., "JD" for "John Doe")
 *
 * @example
 * getFirstLastInitials("John Doe")         // "JD"
 * getFirstLastInitials("Alice")            // "A"
 * getFirstLastInitials("Mary Jane Smith")  // "MS"
 * getFirstLastInitials("")                 // ""
 */
export function getFirstLastInitials(displayName: string): string {
    if (!displayName || typeof displayName !== 'string') {
        return ''
    }

    const names = displayName.trim().split(/\s+/).filter(Boolean)

    if (names.length === 0) {
        return ''
    }

    if (names.length === 1) {
        return names[0][0].toUpperCase()
    }

    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}
